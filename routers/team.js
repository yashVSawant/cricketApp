const express = require('express');

const controller = require('../controllers/team');

const userAuthentication = require('../middleware/userAuthentication');
const organizationAuthentication = require('../middleware/organizationAuthentication');

const routes = express.Router();

routes.post('/match/players',organizationAuthentication.authenticate,controller.getPlayersAndTeam);
routes.post('/',userAuthentication.authenticate,controller.postTeam);
routes.get('/',userAuthentication.authenticate,controller.getTeam);
routes.get('/:id/players',userAuthentication.authenticate,controller.getPlayers);
routes.post('/addPlayer',userAuthentication.authenticate,controller.addPlayer);
routes.delete('/:teamId/:id/remove',userAuthentication.authenticate,controller.removePlayer);


module.exports = routes;