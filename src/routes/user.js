const express = require('express')
const User = require('../models/user')

const router = new express.Router()
const routePrefix = '/api/users'

const auth = require('../middlewares/auth')

router.post(routePrefix, async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch(error) {
        res.status(400).send(error)
    }
})

router.post(`${routePrefix}/login`, async (req, res) => {
    try {        
        const user = await User.findByCredentials(req.body.email, req.body.senha)        
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post(`${routePrefix}/logout`, auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post(`${routePrefix}/logoutAll`, auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.get(`${routePrefix}/me`, auth, async (req,res) => {
    res.send(req.user)
})

router.patch(`${routePrefix}/me`, auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['nome', 'email', 'senha']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete(`${routePrefix}/me`, auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router