const express = require('express');

const controller = require('../controllers/team');

const userAuthentication = require('../middleware/userAuthentication');
const organizationAuthentication = require('../middleware/organizationAuthentication');

const routes = express.Router();

routes.post('/getTeam',organizationAuthentication.authenticate,controller.getTeam);
routes.post('/postTeam',organizationAuthentication.authenticate,controller.postTeam);
routes.post('/addPlayer',organizationAuthentication.authenticate,controller.addPlayerInTeam);

module.exports = routes;