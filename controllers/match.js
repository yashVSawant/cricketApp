const sequelize = require('../utils/database');
const match = require('../models/match');
const batterLiveData = require('../models/batterLiveData');
const bowlerLiveData = require('../models/bowlerLiveData');
const userData = require('../models/userData');
const tournament = require('../models/tournament');
const teamList = require('../models/teamList');
const order = require('../models/order');
const { Op } = require('sequelize');
require('dotenv').config();
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');


exports.getBowlerUpdate = asyncErrorHandler(async(req,res)=>{
        const {id } = req.params;
        if(isNullValue(id))throw ApiError('invalid input!',400)
        const bowler = await bowlerLiveData.findAll({where:{matchId:id}});
        res.status(200).json({success:true,bowler});
})

exports.updateBowlerUpdate = asyncErrorHandler(async(req,res)=>{
        const {userId ,runs ,overs} = req.body;
        const {id} = req.params;
        if(isNullValue(id) || isNullValue(userId) || isNullValue(runs) || isNullValue(overs))throw ApiError('invalid input!',400)
        const batter = await bowlerLiveData.findOne({where:{userId:userId,matchId:id}});
        batter.update({
            runs ,overs:overs 
        })
        res.status(201).json({success:true});
})
exports.updateBowlerWicket = asyncErrorHandler(async(req,res)=>{
        const {userId ,wickets} = req.body;
        const {id} = req.params;
        if(isNullValue(id)|| isNullValue(userId) || isNullValue(wickets))throw ApiError('invalid input!',400)
        const batter = await bowlerLiveData.findOne({where:{userId:userId,matchId:id}});
        batter.update({
            wickets 
        })
        res.status(201).json({success:true});
})

exports.postBowlerUpdate = asyncErrorHandler(async(req,res)=>{
        const {userId} = req.body;
        const {id}= req.params;  
        if(isNullValue(id)|| isNullValue(userId))throw ApiError('invalid input!',400)  
        await bowlerLiveData.create({
            userId:userId,
            matchId:id
        })
        res.status(201).json({success:true});
})

// hhh
exports.getBatterUpdate = asyncErrorHandler(async(req,res)=>{
        const {id } = req.params;
        if(isNullValue(id))throw ApiError('invalid input!',400)
        const batters = await batterLiveData.findAll({where:{matchId:id}});
        res.status(200).json({success:true,batters});
})

exports.updateBatterUpdate = asyncErrorHandler(async(req,res)=>{
        const {userId ,runs ,fours ,sixes ,balls,state} = req.body;
        const {id}= req.params; 
        if(isNullValue(id)|| isNullValue(userId) || isNullValue(runs)||isNullValue(fours)||isNullValue(sixes)||isNullValue(balls)||isNullValue(state))throw ApiError('invalid input!',400)
        const batter = await batterLiveData.findOne({where:{userId:userId,matchId:id}});
        batter.update({
            state ,runs ,fours ,sixes ,balls
        })
        res.status(201).json({success:true});
})

exports.postBatterUpdate = asyncErrorHandler(async(req,res)=>{
        const {userId} = req.body;
        const {id} = req.params;
        if(isNullValue(id)||isNullValue(userId))throw ApiError('invalid input!',400)
        await batterLiveData.create({
            userId:userId,
            matchId:id
        })
        res.status(201).json({success:true});
})

exports.postMatch = asyncErrorHandler(async(req,res)=>{
    const transaction = await sequelize.transaction();
    try {
        const {team1Id ,team2Id,tournamentId,overs,orderId} = req.body;
        if(isNullValue(team1Id)||isNullValue(team2Id)||isNullValue(tournamentId)||isNullValue(overs)||isNullValue(orderId))throw ApiError('invalid input!',400)
        const getOrder = await order.findOne({where:{orderId:orderId ,isValid:true}});
        if(!getOrder)throw new ApiError('order not valid',400);
        
        let day = new Date();
        day.setHours(0,0,0,0);
        let today = new Date(day);
        const getTournament = await tournament.findOne({
            where: {
                id:tournamentId,
                startDate: {
                [Op.lte]: new Date()
                },
                endDate: {
                    [Op.gte]: today
                }
            },
            
        },{transaction})
        if(!getTournament)throw new ApiError('tournament has not started yet!',400)
            const createMatch = await match.create({
                team1Id,
                team2Id,
                overs,
                tournamentId:tournamentId
            },{transaction});
            const team1 = await teamList.findAll( {where: { teamId:team1Id }},{attributes:['userId']},{transaction});
            const userId1 = team1.map((user)=>user.userId);
            await userData.increment(
                { matches: 1},
                { where: { userId: userId1 } },
                {transaction}
            );
            const team2 = await teamList.findAll( {where: { teamId:team2Id }},{attributes:['userId']},{transaction});
            const userId2 = team2.map((user)=>user.userId);
            await userData.increment(
                { matches: 1 },
                { where: { userId: userId2 } },
                {transaction}
            );
            await transaction.commit();
            res.status(201).json({success:true,match:createMatch});
        
        
    } catch (err) {
        await transaction.rollback();
        throw new ApiError(err.message ,err.statusCode)
    }
})
exports.updateMatch = asyncErrorHandler(async(req,res)=>{
        const {inning,runs,wickets,overs,balls} = req.body;
        const {id} = req.params;
        if(isNullValue(id)||isNullValue(inning)||isNullValue(runs)||isNullValue(wickets)||isNullValue(overs)||isNullValue(balls))throw ApiError('invalid input!',400)
        const getMatch = await match.findByPk(id);
        if(!getMatch)throw new ApiError('match not found!',404);
        if(inning === 1){
            getMatch.update({
                team1Runs:runs ,team1Wickets:wickets ,team1Overs:overs,team1Balls:balls
            });
        }else{
            getMatch.update({
                team2Runs:runs ,team2Wickets:wickets,team2Overs:overs,team2Balls:balls
            });
        }
        res.status(201).json({success:true});    
})

exports.getMatch = asyncErrorHandler(async(req ,res )=>{
        const {id } = req.params;
        if(isNullValue(id))throw ApiError('invalid input!',400)
        const getMatch = await match.findOne({where:{tournamentId:id,isLive:true}});
        res.status(201).json({success:true,match:getMatch});
})

exports.endMatch = asyncErrorHandler(async(req,res)=>{
    const transaction = await sequelize.transaction();
    try {
        const {id} = req.params;
        const {orderId} = req.body;
        if(isNullValue(id)||isNullValue(orderId))throw ApiError('invalid input!',400)
        await order.update({isValid:false},{where:{orderId:orderId}},{transaction});
        await match.update({isLive:false},{where:{id:id}},{transaction});
        const getBattersData = await batterLiveData.findAll({where:{matchId:id}},{transaction});
        for( let batterData of getBattersData){
            const userId = batterData.userId;
            const runs = batterData.runs;
            const fours = batterData.fours;
            const sixes = batterData.sixes;
            const balls = batterData.balls;
            
            const user = await userData.findOne({ where: { userId: userId } },{transaction});
            const highestScore = user.highestScore;
        
            let newHighestScore = highestScore;
            if (runs > highestScore) {
                newHighestScore = runs;
            }
            await userData.update({
                runs: user.runs + runs,
                fours: user.fours + fours,
                sixes: user.sixes + sixes,
                balls: user.balls + balls,
                highestScore: newHighestScore
            }, { where: { userId: userId } },{transaction});
        }
        const getBowlersData = await bowlerLiveData.findAll({where:{matchId:id}},{transaction});
        for( let bowlerData of getBowlersData){
            const userId = bowlerData.userId;
            const overs = bowlerData.overs;
            const wickets = bowlerData.wickets;
            
            const user = await userData.findOne({ where: { userId: userId } },{transaction});
            const highestWickets = user.highestWickets;
        
            let newHighestWickets = highestWickets;
            if (wickets > highestWickets) {
                newHighestWickets = wickets;
            }
            await userData.update({
                wickets: user.wickets + wickets,
                overs: user.overs + overs,
                highestWickets: newHighestWickets
            }, { where: { userId: userId } },{transaction});
        }
        await transaction.commit();
        res.status(201).json({success:true});
        
    } catch (err) {
        await transaction.rollback();
        throw new ApiError(err.message ,err.statusCode)
    }
})

function isNullValue(value){
    return value === ""?true :false;
}
