const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Star = require('../models/star')

const router = new express.Router()
const routePrefix = '/api/stars'

const auth = require('../middlewares/auth')

router.post(routePrefix, auth, async (req, res) => {
    const star = new Star(req.body)

    try {
        await star.save()
        res.status(201).send(star)
    } catch (error) {
        res.status(400).send(error)
    }    
})

router.get(routePrefix, async (req, res) => {
    try {
        const stars = await Star.find({})
        res.send(stars)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get(`${routePrefix}/:id`, async (req, res) => {
    try {
        const star = await Star.findById(req.params.id)
        if(!star){
            return res.status(404).send()
        }
        res.send(star)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch(`${routePrefix}/:id`, auth, async (req, res) => {
    const allowedUpdatesArray = ['nome', 'paisDeOrigem', 'dataNascimento', 'categorias', 'redesSociais', 'imagem']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => allowedUpdatesArray.includes(update))

    if(!isValidOperation){
        res.status(400).send({ error: 'Invalid operation' })
    }

    try {
        const star = await Star.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if(!star){
            return res.status(404).send()
        }
        res.send(star)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete(`${routePrefix}/:id`, auth, async (req, res) => {
    try {
        const star = await Star.findByIdAndDelete(req.params.id)
        if(!star){
            return res.status(404).send()
        }
        res.send(star)
    } catch (error) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post(`${routePrefix}/:id/photo`, auth, upload.single('imagem'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 300 }).png().toBuffer()
    const star = await Star.findOne({ _id: req.params.id })

    if(!star){
        throw new Error()
    }

    star.imagem = buffer
    await star.save()        
    res.status(201).send(star)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete(`${routePrefix}/:id/photo`, auth, async (req, res) => {
    try {
        const star = await Star.findOne({ _id: req.params.id })
        
        if(!star){
            throw new Error()
        }

        star.imagem = undefined
        await star.save()
        res.send()
        
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get(`${routePrefix}/:id/photo`, async (req, res) => {
    try {
        const star = await Star.findById(req.params.id)

        if (!star || !star.imagem) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.status(201).send(star.imagem)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router