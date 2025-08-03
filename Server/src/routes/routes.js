const RegisterController = require('../Controllers/RegisterController');
const routes = require('express').Router( );

routes.post('/register', RegisterController.registerChef);

module.exports = routes;