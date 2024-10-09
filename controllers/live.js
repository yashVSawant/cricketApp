const Live = require('../models/live')
require('dotenv').config();
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

exports.getLiveUpdates = asyncErrorHandler(async(req,res)=>{
    const {id } = req.params;
    if(isNullValue(id))throw ApiError('invalid input!',400)
    const live = await Live.findOne({matchId:id});
    res.status(200).json({success:true,live});
})

exports.updateBowler = asyncErrorHandler(async(req,res)=>{
    const {userId ,runs ,balls} = req.body;
    const {id} = req.params;
    if(isNullValue(id) || isNullValue(userId) || isNullValue(runs) || isNullValue(balls))throw ApiError('invalid input!',400)
    const liveData = await Live.findOne({matchId:id});
    if(!liveData)throw new ApiError('live data not found!',404);
    const bowler = liveData.bowlers.find((b)=>{
        return b.userId.equals(userId);
    })
    if(!bowler)throw new ApiError('bowler not found!',404)
    bowler.runs = runs;
    bowler.balls = balls;
    await liveData.save();
    res.status(201).json({success:true});
})
exports.updateBowlerWicket = asyncErrorHandler(async(req,res)=>{
    const {userId ,wickets} = req.body;
    const {id} = req.params;
    if(isNullValue(id)|| isNullValue(userId) || isNullValue(wickets))throw ApiError('invalid input!',400)
    const liveData = await Live.findOne({matchId:id});
    if(!liveData)throw new ApiError('live data not found!',404);
    const bowler = liveData.bowlers.find((b)=>{
        return b.userId.equals(userId);
    })
    if(!bowler)throw new ApiError('bowler not found!',404)
    bowler.wickets = wickets;
    liveData.markModified('bowlers');
    await liveData.save();
    res.status(201).json({success:true});
})

exports.postBowler = asyncErrorHandler(async(req,res)=>{
    const {userId,inning} = req.body;
    const {id}= req.params;  
    if(isNullValue(id)|| isNullValue(userId))throw ApiError('invalid input!',400)  
    const liveData = await Live.findOne({matchId:id});
    if(!liveData)throw new ApiError('live data not found' ,404);
    liveData.bowlers.push({userId:userId , inning:inning});
    liveData.markModified('bowlers')
    await liveData.save({ validateBeforeSave: false, versionError: false });
    res.status(201).json({success:true});
})

exports.updateBatter = asyncErrorHandler(async(req,res)=>{
    const {userId ,runs ,fours ,sixes ,balls,status} = req.body;
    const {id}= req.params; 
    if(isNullValue(id)|| isNullValue(userId) || isNullValue(runs)||isNullValue(fours)||isNullValue(sixes)||isNullValue(balls)||isNullValue(status))throw ApiError('invalid input!',400)
    const liveData = await Live.findOne({matchId:id});
    if(!liveData)throw new ApiError('live data not found!',404);
    const batter = liveData.batters.find((b)=>{
        return b.userId.equals(userId);
    })
    if(!batter)throw new ApiError('batter not found!',404)
    batter.runs = runs;
    batter.fours = fours;
    batter.sixes = sixes;
    batter.balls = balls;
    batter.status = status;
    await liveData.save();
    res.status(201).json({success:true});
})

exports.postBatter = asyncErrorHandler(async(req,res)=>{
    const {userId , inning ,order} = req.body;
    const {id} = req.params;
    if(isNullValue(id)||isNullValue(userId) || isNullValue(order))throw ApiError('invalid input!',400)
    const liveData = await Live.findOne({matchId:id});
    if(!liveData)throw new ApiError('live data not found' ,404);
    liveData.batters.push({userId:userId , inning:inning ,order:liveData.batters.length});
    liveData.markModified('batters')
    await liveData.save();
    res.status(201).json({success:true});
})

function isNullValue(value){
    return value === "" ?true :false;
}