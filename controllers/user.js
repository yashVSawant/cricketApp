
const { Op } = require('sequelize');

const user = require('../models/user');
const userData = require('../models/userData');
const batterLiveData = require('../models/batterLiveData');
const bowlerLiveData = require('../models/bowlerLiveData');
const ApiError = require('../utils/ApiErrors');

const s3Services = require('../services/s3Services');

exports.batterLeaderboard = async(req,res,next)=>{
    try {
        const top5 = await userData.findAll({
            attributes: ['runs'],
            include: [
              {
                model: user,
                attributes: ['name'],
                
              }
            ],
            order: [['runs', 'DESC']],
            limit: 5
          });
        res.status(200).json({succcess:true ,top5});
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}
exports.bowlerLeaderboard = async(req,res,next)=>{
    try {
        const top5 = await userData.findAll({
            attributes: ['wickets'],
            include: [
              {
                model: user,
                attributes: ['name'],
                
              }
            ],
            order: [['wickets', 'DESC']],
            limit: 5
          });
        res.status(200).json({succcess:true ,top5});
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}

exports.getUserData =async(req,res,next)=>{
    try{
        const data = await userData.findOne({
            where:{userId:req.user.id}
        });
        res.status(200).json({succcess:true ,data ,name:req.user.name});
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}

exports.updateBattingData =async(req,res,next)=>{
    try{
        const {id} = req.body;
        if(isNullValue(id))throw new ApiError('invalid input!' ,400)
        const getLiveData = await batterLiveData.findOne({where:{userId:id}});
        if(!getLiveData)throw new ApiError('user is not playing currently!',400)
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
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}
exports.updateBowlingData =async(req,res,next)=>{
    try{
        const {id} = req.body;
        if(isNullValue(id))throw new ApiError('invalid input!' ,400)
        const getLiveData = await bowlerLiveData.findOne({where:{userId:id}});
        if(!getLiveData)throw new ApiError('user is not playing currently!',400)
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
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}
exports.postPhoto = async(req,res,next)=>{
    try{
        const {id} = req.user;
        const getfile = req.file;
        if(isNullValue(id))throw new ApiError('invalid input!' ,400)
        const filename = `profilePhotos/${id}.jpg`;
        const imageUrl = await s3Services.uploadToS3(getfile,filename);
        // console.log(fileUrl);
        await userData.update({imageUrl:imageUrl},{where:{userId:id}});
        res.status(201).json({success:true,imageUrl:imageUrl});
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
   
}

function isNullValue(value){
    return value === ""?true :false;
}
