const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler')

const User = require('../models/user');
const UserData = require('../models/userData');

const hashService = require('../services/bcrypt');

exports.signup = asyncErrorHandler(async(req,res)=>{
    const session = await mongoose.startSession()
    try{
        session.startTransaction()
        let {name , password ,playerType} = req.body;
        name = name.trim();
        password = password.trim();
        if(isNullValue(name) || isNullValue(password) ||isNullValue(playerType)){
            throw new ApiError("invalid input!",400);
        }
        const isExist = await User.findOne({name:name})
        if(isExist)throw new ApiError('username already exists!' ,400);
        const hash = await hashService.createHash(password);
        const newUser = new User({
                    name:name,
                    password:hash,
                    role:'player'
        })
        const newUserData = new UserData({
                    userId:newUser.id,
                    playerType:playerType
        })
        await newUser.save({ session })
        await newUserData.save({ session });
        await session.commitTransaction();
        session.endSession()
        res.status(201).json({success:true});      
    }catch(err){
        await session.abortTransaction();
        session.endSession()
        throw new ApiError(err.message ,err.statusCode)
    }
    
})

exports.login = asyncErrorHandler(async(req,res)=>{
        const {name , password} = req.body;
        if(isNullValue(name) || isNullValue(password))throw new ApiError('invalid input!' ,400)

        let checkUser = await User.findOne({name:name});
        if(!checkUser)throw new ApiError("user not found",404);
        await hashService.compareHash(password ,checkUser.password);
        let link = '';
        if(checkUser.role === 'admin')link = '../admin/index.html'
        res.status(200).json({success:true , token:generateAccessToken(checkUser._id,checkUser.name,checkUser.role) ,link});      
})

function isNullValue(value){
    return value === ""?true :false;
}

function generateAccessToken(_id, name ,role){
    return jwt.sign({_id,name,role},process.env.TOKENKEY);
}