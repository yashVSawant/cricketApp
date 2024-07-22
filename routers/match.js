const express = require('express');

const controller = require('../controllers/match');

const {restrictTo} = require('../middlewares/authentication');

const routes = express.Router();

routes.post('/postMatch',restrictTo(['organization']),controller.postMatch);
routes.get('/getMatch/:id',restrictTo(['player']),controller.getMatch);
routes.put('/:id/update',restrictTo(['organization']),controller.updateMatch);
routes.put('/:id/endMatch',restrictTo(['organization']),controller.endMatch);


routes.post('/:id/batter/updates',restrictTo(['organization']),controller.postBatterUpdate);
routes.put('/:id/batter/updates',restrictTo(['organization']),controller.updateBatterUpdate);
routes.get('/:id/batter/updates',restrictTo(['player']),controller.getBatterUpdate);

routes.post('/:id/bowler/updates',restrictTo(['organization']),controller.postBowlerUpdate);
routes.put('/:id/bowler/updates',restrictTo(['organization']),controller.updateBowlerUpdate);
routes.put('/:id/bowler/wicket/updates',restrictTo(['organization']),controller.updateBowlerWicket);
routes.get('/:id/bowler/updates',restrictTo(['player']),controller.getBowlerUpdate);



module.exports = routes;