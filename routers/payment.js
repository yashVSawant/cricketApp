const express = require('express');

const {restrictTo} = require('../middlewares/authentication')
const controller = require('../controllers/payment');

const routes = express.Router();

routes.get('/',restrictTo(['organization']),controller.purchasePremium);
routes.put('/',restrictTo(['organization']),controller.updatePremium);


module.exports = routes;