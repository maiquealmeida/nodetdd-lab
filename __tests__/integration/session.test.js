/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../../src/app')
const factory = require('../factories')

const truncate = require('../utils/truncate')

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate()
  })

  it('should authenticate whith valid credentials', async () => {
    const user = await factory.create('User', {
      password: '123456'
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.status).toBe(200)
  })

  it('should not authenticate whith invalid credentials', async () => {
    const user = await factory.create('User', {
      password: '123456'
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '654321'
      })

    expect(response.status).toBe(401)
  })

  it('should not authenticate with invalid email', async () => {
    const user = await factory.create('User', {
      password: '123456'
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'email@inexistente.com',
        password: '123456'
      })

    expect(response.status).toBe(401)
  })

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123456'
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.body).toHaveProperty('token')
  })

  it('should be able to access private routes when authticated', async () => {
    const user = await factory.create('User', {
      password: '123456'
    })

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`)

    expect(response.status).toBe(200)
  })

  it('should NOT be able to access private routes without jwt token', async () => {
    const user = await factory.create('User', {
      password: '123456'
    })

    const response = await request(app).get('/dashboard')

    expect(response.status).toBe(401)
  })

  it('should NOT be able to access private routes with invalid jwt token', async () => {
    const user = await factory.create('User', {
      password: '123456'
    })

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', 'Bearer 123123123')

    expect(response.status).toBe(401)
  })
})
