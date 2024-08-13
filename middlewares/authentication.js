const jwt = require('jsonwebtoken');
require('dotenv').config();

const user = require('../models/user');
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

const authenticate = asyncErrorHandler(async(req,res,next)=>{
        const fullToken = req.header('Authorization');
        if(!fullToken)return next();
        const token = fullToken.split("Bearer ")[1];
        const tokenClient =  jwt.verify(token , process.env.TOKENKEY);
        const client = await user.findByPk(tokenClient.id);
        req.user = client;
        next();
})

const restrictTo = (role)=>{
    return asyncErrorHandler((req,res,next)=>{
            if(!req.user && !(role.includes(req.user.role))) throw new ApiError('unauthorize access!' ,401);
            else next();
    })
}

module.exports = {authenticate,restrictTo};