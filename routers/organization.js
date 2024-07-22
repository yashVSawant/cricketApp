const express = require('express');

const {restrictTo} = require('../middlewares/authentication');

const controller = require('../controllers/organizer');

const routes = express.Router();

routes.post('/',restrictTo(['admin']),controller.signup);
routes.get('/',restrictTo(['admin']),controller.getOrganization);




module.exports = routes;