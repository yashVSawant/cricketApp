const express = require('express');

const controller = require('../controllers/live');

const {restrictTo} = require('../middlewares/authentication');

const routes = express.Router();

routes.post('/:id/batter/updates',restrictTo(['organization']),controller.postBatter);
routes.put('/:id/batter/updates',restrictTo(['organization']),controller.updateBatter);
routes.get('/:id/updates',controller.getLiveUpdates);

routes.post('/:id/bowler/updates',restrictTo(['organization']),controller.postBowler);
routes.put('/:id/bowler/updates',restrictTo(['organization']),controller.updateBowler);
routes.put('/:id/bowler/wicket/updates',restrictTo(['organization']),controller.updateBowlerWicket);




module.exports = routes;