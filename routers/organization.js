const express = require('express');

const controller = require('../controllers/organization');

const routes = express.Router();

routes.post('/signup',controller.signup);
routes.post('/login',controller.login);



module.exports = routes;