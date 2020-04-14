const mongoose = require('mongoose')

const starSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    paisDeOrigem: {
        type: String,
        required: true,
        trim: true
    },
    dataNascimento: {
        type: Date
    },
    categorias: {
        type: Array
    },
    redesSociais: {
        type: Array
    },
    imagem: {
        type: Buffer
    }
}, {
    timestamps: true
})

const Star = mongoose.model('Star', starSchema)

module.exports = Star