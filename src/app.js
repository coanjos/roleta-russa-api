const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const starRouter = require('./routes/star')
const userRouter = require('./routes/user')
const randomRouter = require('./routes/random')

const app = express()

app.use(express.json())
app.use(cors())
app.use(starRouter)
app.use(userRouter)
app.use(randomRouter)

module.exports = app