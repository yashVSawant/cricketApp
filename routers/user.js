const express = require('express');

const {restrictTo}=require('../middlewares/authentication');
const controller = require('../controllers/user');
const multer = require('multer');

const upload = multer()

const routes = express.Router();

routes.get('/top5/batter',controller.batterLeaderboard);
routes.get('/top5/bowler',controller.bowlerLeaderboard);

routes.post('/data/photo',upload.single('file') ,controller.postPhoto)
routes.get('/data',controller.getUserData);
// routes.put('/data/update/batting',restrictTo(['organization']),controller.updateBattingData);
// routes.put('/data/update/bowlings',restrictTo(['organization']),controller.updateBowlingData);

module.exports = routes;