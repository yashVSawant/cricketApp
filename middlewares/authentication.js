const jwt = require('jsonwebtoken');
require('dotenv').config();

const user = require('../models/user');
const ApiError = require('../utils/ApiErrors');

const authenticate = async(req,res,next)=>{
    try{
        const fullToken = req.header('Authorization');
        const token = fullToken.split("bearer ")[1] || null;
        const tokenClient =  jwt.verify(token , process.env.TOKENKEY);
        const client = await user.findByPk(tokenClient.id);
        if(!client){
            tokenClient.name === process.env.ADMIN_USERNAME
            req.user = tokenClient;
        }else{
            req.user = client;
        }
    }catch(err){
        req.user = null;
    }finally{
        next();
    }
}

const restrictTo = (role)=>{
    return (req,res,next)=>{
        try {
            if(!req.user) throw new ApiError('user not found!' ,401);
            if(role.includes(req.user.role))next();
            else throw new ApiError('unauthorize access!' ,401);
        } catch (err) {
            next(new ApiError(err.message ,err.statusCode))
        }
    }
}

module.exports = {authenticate,restrictTo};