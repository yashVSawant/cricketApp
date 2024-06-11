
const jtw = require('jsonwebtoken');
require('dotenv').config();
const sequelize = require('../utils/database');

const user = require('../models/user');
const userData = require('../models/userData');
const hashService = require('../services/bcrypt');

exports.getUserData =async(req,res)=>{
    try{
        const data = await userData.findOne({
            where:{userId:req.user.id}
        });
        res.status(200).json({succcess:true ,data});
    }catch(err){
        res.status(404).json({success:false ,message:err.message})
    }
}

exports.updateUserData =async(req,res)=>{
    try{
        const { runs ,wickets} = req.body;
        const data = await userData.findOne({
            where:{userId:req.user.id}
        });
        const updateData = await data.update({
            matches : data.matches + +1,
            runs :data.runs + +runs,
            wickets :data.wickets + +wickets
        })
        res.status(200).json({succcess:true ,data:updateData});
    }catch(err){
        res.status(404).json({success:false ,message:err.message})
    }
}

exports.signup = async(req,res)=>{
    const transaction = await sequelize.transaction();
    try{
        const {name , email  , password ,playerType} = req.body;
        if(isNullValue(name) || isNullValue(email) || isNullValue(contactNo) || isNullValue(password) ||isNullValue(playerType)){
            throw new Error("invalid input!");
        }

        const hash = await hashService.createHash(password);
        const newUser = await user.create({
                        name,
                        email,
                        password:hash
        },{transaction})
        await userData.create({
                userId:newUser.id,
                playerType:playerType
        },{transaction})
        res.status(201).json({success:true});
        await transaction.commit();
            
    }catch(err){
        // console.log(err);
        await transaction.rollback();
        res.status(403).json({message:err.message});
    }
    
}

exports.login = async(req,res)=>{
    try{
        const {email , password} = req.body;
        if(isNullValue(email) || isNullValue(password)){
            throw new Error("invalid input!");
        }

        let checkUser = await user.findOne({where:{email:email}});
        if(checkUser){
            await hashService.compareHash(password ,checkUser.password);
            res.status(200).json({success:true , token:generateAccessToken(checkUser.id,checkUser.name)});      
        }else{
            res.status(403).json({success:false,message:"user not found"})
        }
    }catch(err){
        res.status(403).json({success:false,message:err.message})
    }
}

function isNullValue(value){
    return value === ""?true :false;
}

function generateAccessToken(id, name ){
    return jtw.sign({id,name},process.env.TOKENKEY);
}