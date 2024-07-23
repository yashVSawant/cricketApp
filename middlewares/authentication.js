const jwt = require('jsonwebtoken');
require('dotenv').config();

const user = require('../models/user');
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

const authenticate = async(req,res,next)=>{
        const fullToken = req.header('Authorization');
        const token = fullToken?.split("bearer ")[1] || null;
        const tokenClient =  jwt.verify(token , process.env.TOKENKEY);
        const client = await user.findByPk(tokenClient.id);
        if(!client){
            if(tokenClient.name === process.env.ADMIN_USERNAME)req.user = tokenClient;
            req.user = null;
        }else{
            req.user = client;
        }
        next();
}

const restrictTo = (role)=>{
    return asyncErrorHandler((req,res,next)=>{
            if(!req.user) throw new ApiError('user not found!' ,401);
            if(role.includes(req.user.role))next();
            else throw new ApiError('unauthorize access!' ,401);
    })
}

module.exports = {authenticate,restrictTo};