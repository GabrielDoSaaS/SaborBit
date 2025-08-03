const LoginController = require('../Controllers/LoginController');
const RegisterController = require('../Controllers/RegisterController');
const routes = require('express').Router( );

routes.post('/register', RegisterController.registerChef);
routes.post('/Login', LoginController.loginChef);

module.exports = routes;