const express = require('express');

const controller = require('../controllers/tournament');

const userAuthentication = require('../middleware/userAuthentication');
const organizationAuthentication = require('../middleware/organizationAuthentication');

const routes = express.Router();

routes.post('/',organizationAuthentication.authenticate,controller.postTournament);
routes.get('/ongonigTournaments',userAuthentication.authenticate,controller.ongoingTournaments);
routes.get('/',organizationAuthentication.authenticate,controller.getTournaments);
// routes.post('/postMatch',organizationAuthentication.authenticate,controller.postMatch);
// routes.get('/getMatch/:id',userAuthentication.authenticate,controller.getMatch);
// routes.delete('/deleteMatch',organizationAuthentication.authenticate,controller.deleteMatch);

module.exports = routes;