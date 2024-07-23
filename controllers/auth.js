const jwt = require('jsonwebtoken');
require('dotenv').config();
const sequelize = require('../utils/database');
const ApiError = require('../utils/ApiErrors');

const user = require('../models/user');
const userData = require('../models/userData');

const hashService = require('../services/bcrypt');

exports.signup = async(req,res,next)=>{
    const transaction = await sequelize.transaction();
    try{
        let {name , password ,playerType} = req.body;
        name = name.trim();
        password = password.trim();
        if(isNullValue(name) || isNullValue(password) ||isNullValue(playerType)){
            throw new ApiError("invalid input!",400);
        }
        const isExist = await user.findOne({where:{name:name}})
        if(isExist)throw new ApiError('username already exists!' ,400)
        const hash = await hashService.createHash(password);
        const newUser = await user.create({
                    name,
                    password:hash,
                    role:'player'
        },{transaction})
        await userData.create({
                    userId:newUser.id,
                    playerType:playerType
        },{transaction})
        await transaction.commit();
        res.status(201).json({success:true});      
    }catch(err){
        await transaction.rollback();
        next(new ApiError(err.message ,err.statusCode))
    }
    
}

exports.login = async(req,res,next)=>{
    try{
        const {name , password} = req.body;
        if(isNullValue(name) || isNullValue(password))throw new ApiError('invalid input!' ,400)

        let checkUser = await user.findOne({where:{name:name}});
        if(!checkUser)throw new ApiError("user not found",404);

        await hashService.compareHash(password ,checkUser.password);
        let link = '../home/index.html';
        if(checkUser.role === 'organization')link = '../organization-home/index.html'
        res.status(200).json({success:true , token:generateAccessToken(checkUser.id,checkUser.name,checkUser.role) ,link});      
        
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}

function isNullValue(value){
    return value === ""?true :false;
}

function generateAccessToken(id, name ,role){
    return jwt.sign({id,name,role},process.env.TOKENKEY);
}