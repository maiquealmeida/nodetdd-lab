const routes = require('express').Router()

// Definicao das rotas
const SessionController = require('./app/controllers/SessionController')
routes.post('/sessions', SessionController.store)

module.exports = routes
