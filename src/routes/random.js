const express = require('express')
const Star = require('../models/star')

const router = new express.Router()
const routePrefix = '/api/random'

router.get(routePrefix, async (req, res) => {
    try {        
        const randomStar = await Star.aggregate().sample(1)        
        res.status(200).send(randomStar[0])
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router