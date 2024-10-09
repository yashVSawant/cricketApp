const express = require('express');

const controller = require('../controllers/team');
const {restrictTo}=require('../middlewares/authentication');

const routes = express.Router();

routes.post('/match/players',restrictTo(['organization']),controller.getPlayersAndTeam);
routes.post('/',controller.postTeam);
routes.get('/',controller.getTeam);
routes.get('/:id/players',controller.getPlayers);
routes.post('/addPlayer',controller.addPlayer);
routes.delete('/:teamId/:id/remove',controller.removePlayer);
routes.delete('/:id',controller.deleteTeam);


module.exports = routes;