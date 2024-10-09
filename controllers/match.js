const match = require('../models/match');
const Live = require('../models/live')
const userData = require('../models/userData');
const tournament = require('../models/tournament');
const teamList = require('../models/teamList');
const mongoose = require('mongoose')
require('dotenv').config();
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');
const team = require('../models/team');



exports.postMatch = asyncErrorHandler(async(req,res)=>{
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {team1Id ,team2Id,tournamentId,overs} = req.body;
        if(isNullValue(team1Id)||isNullValue(team2Id)||isNullValue(tournamentId)||isNullValue(overs))throw ApiError('invalid input!',400)
        if(team1Id === team2Id)throw new ApiError('both team should be different',400)
        let day = new Date();
        day.setHours(0,0,0,0);
        let today = new Date(day);
        const getTournament = await tournament.findOne({
                _id:tournamentId,
                startDate: {
                    $lte: new Date()
                },
                endDate: {
                    $gte: today
            },
            
        })
        if(!getTournament)throw new ApiError('tournament has not started yet!',400)
            const team1List = await teamList.find({ teamId:team1Id });
            const team2List = await teamList.find({ teamId:team2Id });
            const team1 = await team.findById(team1Id)
            const team2 = await team.findById(team2Id)
            const userId1 = team1List.map((user) => user.userId);
            const userId2 = team2List.map((user)=>user.userId);
            await userData.updateMany(
                { userId: { $in: userId1 } },  
                { $inc: { matches: 1 } },  
                { session }  
            );
            
            await userData.updateMany(
                { userId: { $in: userId2 } },  
                { $inc: { matches: 1 } },  
                { session }  
            );
            const createMatch = new match({
                team1:{
                    teamId:team1Id ,name:team1.name
                },
                team2:{
                    teamId:team2Id , name:team2.name
                },
                overs,
                tournamentId:tournamentId
            });
            const live = new Live({matchId:createMatch._id})
            await createMatch.save({session})
            await live.save({session})
            await session.commitTransaction()
            session.endSession();
            res.status(201).json({success:true,match:createMatch});
    } catch (err) {
        await session.abortTransaction()
        session.endSession();
        throw new ApiError(err.message ,err.statusCode)
    }
})
exports.updateMatch = asyncErrorHandler(async(req,res)=>{
        const {inning,runs,wickets,overs,balls} = req.body;
        const {id} = req.params;
        if(isNullValue(id)||isNullValue(inning)||isNullValue(runs)||isNullValue(wickets)||isNullValue(overs)||isNullValue(balls))throw ApiError('invalid input!',400)
        const getMatch = await match.findOne({_id:id});
        if(!getMatch)throw new ApiError('match not found!',404);
        if(inning === 1){
            getMatch.team1.runs = runs,
            getMatch.team1.wickets = wickets
            getMatch.team1.balls = balls
            getMatch.markModified('team1')
        }else{
            getMatch.team2.runs = runs,
            getMatch.team2.wickets = wickets
            getMatch.team2.balls = balls
            getMatch.markModified('team2')
        }
        await getMatch.save()
        res.status(201).json({success:true});    
})

exports.getMatch = asyncErrorHandler(async(req ,res )=>{
        const {id } = req.params;
        if(isNullValue(id))throw ApiError('invalid input!',400);
        const getMatch = await match.findOne({
            tournamentId: id,
            isLive: true
        }).sort({ createdAt: -1});
        if(!getMatch)res.status(404).json({success:false ,message:'match not started yet!'});
        else res.status(201).json({success:true,match:getMatch});
})

exports.endMatch = asyncErrorHandler(async(req,res)=>{
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {id} = req.params;
        const {wonTeamId} = req.body;
        if(isNullValue(id))throw ApiError('invalid input!',400)
        const getMatch = await match.findOne({_id:id});
        if(!getMatch)throw new ApiError('match not found!',404)
        if(!getMatch.isLive)throw new ApiError('match already ended!' , 400);   
        getMatch.isLive =false;
        getMatch.wonTeamId = wonTeamId;
        const liveData = Live.findOne({matchId:id});
        const batters = liveData.batters;
        for( let batter of batters){
            const userId = batter.userId;
            const runs = batter.runs;
            const fours = batter.fours;
            const sixes = batter.sixes;
            const balls = batter.balls;
            
            const data = await userData.findOne({ where: { userId: userId } },{session});
            const highestScore = data.highestScore;
        
            const newHighestScore = runs > highestScore ? runs : highestScore ;

            await userData.updateOne(
                { userId: userId },
                {
                    $inc: {
                        runs: runs,
                        fours: fours,
                        sixes: sixes,
                        balls: balls
                    },
                    $set: { highestScore: newHighestScore }
                },
                { session }
            )
        }
        const bowlers = liveData.bowlers;
        for( let bowler of bowlers){
            const userId = bowler.userId;
            const wickets = bowler.wickets;
            const overs = Math.floor(bowler.balls / 6) + (bowler.balls%6 > 0 ? 1 : 0);
            
            const data = await userData.findOne({ userId: userId },{session});
            const highestWickets = data.highestWickets;
            const newHighestWickets = wickets > highestWickets ? wickets:highestWickets;
            
            await userData.updateOne(
                { userId: userId },
                {
                    $inc: {
                        wickets: wickets,
                        overs: overs,
                    },
                    $set: { highestWickets: newHighestWickets }
                },
                { session }
            )
        }
        await session.commitTransaction()
        await session.endSession()
        res.status(201).json({success:true});
        
    } catch (err) {
        await session.abortTransaction()
        await session.endSession()
        throw new ApiError(err.message ,err.statusCode)
    }
})

exports.endInning = asyncErrorHandler(async(req,res)=>{
    const {id} = req.params;
    if(isNullValue(id))throw new ApiError('invalid input!',400);
    const getMatch = await match.findOne({_id:id});
    if(!getMatch)throw new ApiError('match not found!',404)
    if(!getMatch.isLive)throw new ApiError('match already ended!' , 400);   
    getMatch.inning = 2;
    getMatch.save();
    res.status(201).json({success:true})
})

function isNullValue(value){
    return value === "" ?true :false;
}
