
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sequelize = require('../utils/database');

const user = require('../models/user');
const userData = require('../models/userData');
const batterLiveData = require('../models/batterLiveData');
const bowlerLiveData = require('../models/bowlerLiveData');
const hashService = require('../services/bcrypt');

exports.getUserData =async(req,res)=>{
    try{
        const data = await userData.findOne({
            where:{userId:req.user.id}
        });
        res.status(200).json({succcess:true ,data ,name:req.user.name});
    }catch(err){
        res.status(404).json({success:false ,message:err.message})
    }
}

exports.updateBattingData =async(req,res)=>{
    try{
        const {id} = req.body;
        const getLiveData = await batterLiveData.findOne({where:{userId:id}});
        if(getLiveData){
            const data = await userData.findOne({
                where:{userId:id}
            });
            let highestScore = data.highestScore;
            if((+getLiveData.runs) > data.highestScore)highestScore = +getLiveData.runs
            await data.update({
                runs :data.runs + +getLiveData.runs,
                sixes :data.sixes + +getLiveData.sixes,
                fours:data.fours + +getLiveData.fours,
                balls:data.balls + +getLiveData.balls,
                highestScore:highestScore
            })
            res.status(200).json({succcess:true });
        }else{
            throw new Error('user is not playing currently!')
        }
    }catch(err){
        res.status(500).json({success:false ,message:err.message})
    }
}
exports.updateBowlingData =async(req,res)=>{
    try{
        const {id} = req.body;
        const getLiveData = await bowlerLiveData.findOne({where:{userId:id}});
        if(getLiveData){
            const data = await userData.findOne({
                where:{userId:id}
            });
            let highestWickets = data.highestWickets;
            if((+getLiveData.wickets) > data.highestWickets)highestWickets = +getLiveData.wickets
            await data.update({
                wickets :data.wickets + +getLiveData.wickets,
                overs :data.overs + +getLiveData.overs,
                highestWickets: highestWickets
            })
            res.status(200).json({succcess:true });
        }else{
            throw new Error('user is not playing currently!')
        }
    }catch(err){
        res.status(500).json({success:false ,message:err.message})
    }
}

exports.signup = async(req,res)=>{
    const transaction = await sequelize.transaction();
    try{
        const {name , email  , password ,playerType} = req.body;
        if(isNullValue(name) || isNullValue(email) || isNullValue(password) ||isNullValue(playerType)){
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
        console.log(err);
        await transaction.rollback();
        res.status(500).json({message:err.message});
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
            res.status(404).json({success:false,message:"user not found"})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({success:false,message:err.message})
    }
}

function isNullValue(value){
    return value === ""?true :false;
}

function generateAccessToken(id, name ){
    return jwt.sign({id,name,role:'player'},process.env.TOKENKEY);
}