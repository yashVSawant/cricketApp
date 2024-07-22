const express = require('express');

const controller = require('../controllers/team');
const {restrictTo}=require('../middlewares/authentication');

const routes = express.Router();

routes.post('/match/players',restrictTo(['organization']),controller.getPlayersAndTeam);
routes.post('/',restrictTo(['player']),controller.postTeam);
routes.get('/',restrictTo(['player']),controller.getTeam);
routes.get('/:id/players',restrictTo(['player']),controller.getPlayers);
routes.post('/addPlayer',restrictTo(['player']),controller.addPlayer);
routes.delete('/:teamId/:id/remove',restrictTo(['player']),controller.removePlayer);
routes.delete('/:id',restrictTo(['player']),controller.deleteTeam);


module.exports = routes;