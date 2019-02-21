/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../../src/app')

const truncate = require('../utils/truncate')

const { User } = require('../../src/app/models')

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate()
  })

  it('should authenticate whith valid credentials', async () => {
    const user = await User.create({
      name: 'Maique',
      email: 'maique.almeida@tsagro.com',
      password_hash: '123456'
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.status).toBe(200)
  })

  // it('should receive JWT token when authenticated with valid credentials', () => {})
})
