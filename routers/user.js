const express = require('express');

const {restrictTo}=require('../middlewares/authentication');
const controller = require('../controllers/user');
const multer = require('multer');

const upload = multer()

const routes = express.Router();

routes.get('/top5/batter',restrictTo(['player']),controller.batterLeaderboard);
routes.get('/top5/bowler',restrictTo(['player']),controller.bowlerLeaderboard);

routes.post('/data/photo',restrictTo(['player']),upload.single('file') ,controller.postPhoto)
routes.get('/data',restrictTo(['player']),controller.getUserData);
routes.put('/data/update/batting',restrictTo(['organization']),controller.updateBattingData);
routes.put('/data/update/bowlings',restrictTo(['organization']),controller.updateBowlingData);

module.exports = routes;