const express = require('express');

const controller = require('../controllers/match');

const userAuthentication = require('../middleware/userAuthentication');
const organizationAuthentication = require('../middleware/organizationAuthentication');

const routes = express.Router();

routes.post('/postMatch',organizationAuthentication.authenticate,controller.postMatch);
routes.get('/getMatch/:id',userAuthentication.authenticate,controller.getMatch);
routes.put('/:id/update',organizationAuthentication.authenticate,controller.updateMatch);
routes.put('/:id/endMatch',organizationAuthentication.authenticate,controller.endMatch);

routes.get('/payment',organizationAuthentication.authenticate,controller.purchasePremium);
routes.put('/payment',organizationAuthentication.authenticate,controller.updatePremium);

routes.post('/:id/batter/updates',organizationAuthentication.authenticate,controller.postBatterUpdate);
routes.put('/:id/batter/updates',organizationAuthentication.authenticate,controller.updateBatterUpdate);
routes.get('/:id/batter/updates',userAuthentication.authenticate,controller.getBatterUpdate);

routes.post('/:id/bowler/updates',organizationAuthentication.authenticate,controller.postBowlerUpdate);
routes.put('/:id/bowler/updates',organizationAuthentication.authenticate,controller.updateBowlerUpdate);
routes.put('/:id/bowler/wicket/updates',organizationAuthentication.authenticate,controller.updateBowlerWicket);
routes.get('/:id/bowler/updates',userAuthentication.authenticate,controller.getBowlerUpdate);



module.exports = routes;