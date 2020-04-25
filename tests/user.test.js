const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase} = require('./fixtures/db')

const routePrefix = '/api/users'

beforeEach(setupDatabase)

test('Deve criar novo usuário', async () => {
    const response = await request(app).post(routePrefix).send({
        nome: 'Test',
        email: 'test@gmail.com',
        senha: '123456789'
    }).expect(201)

    const user = await User.findById(response.body.user._id)

    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user: {
            nome: 'Caio'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('123456789')
})

test('Deve logar usuário', async () => {
    const response = await request(app).post(`${routePrefix}/login`).send({
        email: userOne.email,
        senha: userOne.senha
    }).expect(200)

    const user = await User.findById(userOneId)

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Não deve logar usuário inexistente', async () => {
    await request(app).post(`${routePrefix}/login`).send({
        email: 'aids@gmail.com',
        senha: 123456789
    }).expect(400)
})

test('Deve pegar perfil do usuário', async () => {
    await request(app)
        .get(`${routePrefix}/me`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Não deve pegar perfil de usuário não autenticado', async () => {
    await request(app)
        .get(`${routePrefix}/me`)        
        .send()
        .expect(401)
})

test('Deve apagar perfil do usuário', async () => {
    const response = await request(app)
        .delete(`${routePrefix}/me`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId)

    expect(user).toBeNull()
    
})

test('Não deve apagar perfil do usuário sem autenticação', async () => {
    await request(app)
        .delete(`${routePrefix}/me`)        
        .send()
        .expect(401)
})

test('Deve atualizar dados válidos de usuário', async () => {
    const response = await request(app)
        .patch(`${routePrefix}/me`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            nome: 'aids'
        }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.nome).toBe('aids')

})

test('Não deve atualizar dados inválidos de usuário', async () => {
    const response = await request(app)
        .patch(`${routePrefix}/me`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            cidade: 'aids'
        }).expect(400)
})