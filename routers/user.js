const express = require('express');

const controller = require('../controllers/user');
const authentication = require('../middleware/userAuthentication');
const multer = require('multer');

const upload = multer()

const routes = express.Router();

routes.post('/signup',controller.signup);
routes.post('/login',controller.login);

routes.get('/top5/batter',authentication.authenticate ,controller.batterLeaderboard);
routes.get('/top5/bowler',authentication.authenticate ,controller.bowlerLeaderboard);

routes.post('/data/photo',authentication.authenticate,upload.single('file') ,controller.postPhoto)
routes.get('/data',authentication.authenticate ,controller.getUserData);
routes.put('/data/update/batting',authentication.authenticate ,controller.updateBattingData);
routes.put('/data/update/bowlings',authentication.authenticate ,controller.updateBowlingData);

module.exports = routes;