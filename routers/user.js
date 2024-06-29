const express = require('express');

const controller = require('../controllers/user');
const authentication = require('../middleware/userAuthentication');

const routes = express.Router();

routes.post('/signup',controller.signup);
routes.post('/login',controller.login);

routes.get('/data',authentication.authenticate ,controller.getUserData);
routes.put('/data/update/batting',authentication.authenticate ,controller.updateBattingData);
routes.put('/data/update/bowlings',authentication.authenticate ,controller.updateBowlingData);

module.exports = routes;