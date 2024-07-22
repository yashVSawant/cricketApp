const express = require('express');

const {restrictTo}=require('../middlewares/authentication');
const controller = require('../controllers/tournament');

const routes = express.Router();

routes.post('/',restrictTo(['organization']),controller.postTournament);
routes.get('/',restrictTo(['organization']),controller.getTournaments);
routes.get('/ongonigTournaments',restrictTo(['player']),controller.ongoingTournaments);


module.exports = routes;