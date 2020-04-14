const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Star = require('../../src/models/star')

const userOneId = mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    nome: 'Dougras',
    email: 'eusoudougras@gmail.com',
    senha: 'aidsfatalsim',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    nome: 'Mr. Meseeks',
    email: 'lookatme@gmail.com',
    senha: 'iwanttodie',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const starOneId = mongoose.Types.ObjectId()
const starOne = {
    _id: starOneId,
    nome: 'Skin Diamond',
    paisDeOrigem: 'EUA'    
}

const starTwoId = mongoose.Types.ObjectId()
const starTwo = {
    _id: starTwoId,
    nome: 'AJ Applegate',
    paisDeOrigem: 'EUA'    
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Star.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Star(starOne).save()
    await new Star(starTwo).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    starOneId,
    starOne,
    starTwoId,
    starTwo,
    setupDatabase
}