const request = require('supertest')
const app = require('../src/app')
const Star = require('../src/models/star')
const { userOneId, userOne, starOne, starOneId, setupDatabase} = require('./fixtures/db')

const routePrefix = '/api/stars'

beforeEach(setupDatabase)

test('Deve criar nova Star', async () => {
    const response = await request(app)
        .post(routePrefix)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            nome: 'Remy Lacroix',
            paisDeOrigem: 'EUA'
        }).expect(201)

    const star = await Star.findById(response.body._id)

    expect(star).not.toBeNull()
})

test('Deve pegar todas as Stars', async () => {
    const response = await request(app)
        .get(routePrefix)
        .send()
        .expect(200)
    
    expect(response.body.length).toEqual(2)
})



test('Deve fazer upload de imagem de Star', async () => {
    const response = await request(app)
        .post(`${routePrefix}/${starOneId}/photo`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('imagem', 'tests/fixtures/guitar.jpg')
        .expect(201)

    const star = await Star.findById(starOneId)

    expect(star.imagem).toEqual(expect.any(Buffer))

})