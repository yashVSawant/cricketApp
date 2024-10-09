const express = require('express');

const controller = require('../controllers/match');

const {restrictTo} = require('../middlewares/authentication');

const routes = express.Router();

routes.post('/postMatch',restrictTo(['organization']),controller.postMatch);
routes.get('/getMatch/:id',controller.getMatch);
routes.put('/:id/update',restrictTo(['organization']),controller.updateMatch);
routes.put('/:id/endMatch',restrictTo(['organization']),controller.endMatch);



module.exports = routes;