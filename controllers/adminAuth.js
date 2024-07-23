const jwt = require('jsonwebtoken');
require('dotenv').config();
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

exports.login = asyncErrorHandler(async(req,res)=>{
        const {name , password} = req.body;
        if(isNullValue(name) || isNullValue(password)){
            throw new ApiError("invalid input!",400);
        }
        if(name === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD){
            res.status(200).json({success:true , token:generateAccessToken(process.env.ADMIN_USERNAME,process.env.ADMIN_USERNAME,'admin')});      
        }else{
            throw new ApiError("admin not found",404);
        }
})

function isNullValue(value){
    return value === ""?true :false;
}

function generateAccessToken(id, name ,role){
    return jwt.sign({id,name,role},process.env.TOKENKEY);
}