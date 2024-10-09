const express = require('express');

const userAuthController = require('../controllers/auth');
const adminAuthController = require('../controllers/adminAuth');

const routes = express.Router();

routes.post('/signup',userAuthController.signup);
routes.post('/login',userAuthController.login);
// routes.post('/admin/login',adminAuthController.login)


module.exports = routes;