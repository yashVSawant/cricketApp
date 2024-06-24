const express = require('express');

const controller = require('../controllers/user');
const authentication = require('../middleware/userAuthentication');

const routes = express.Router();

routes.post('/signup',controller.signup);
routes.post('/login',controller.login);

routes.get('/data',authentication.authenticate ,controller.getUserData);
routes.put('/data/update',authentication.authenticate ,controller.updateUserData);

module.exports = routes;