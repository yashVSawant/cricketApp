const sequelize = require('../utils/database');

const match = require('../models/match');
const batterLiveData = require('../models/batterLiveData');
const bowlerLiveData = require('../models/bowlerLiveData');
const userData = require('../models/userData');
const team = require('../models/team');
const teamList = require('../models/teamList')


exports.getBowlerUpdate = async(req,res)=>{
    try {
        const {id } = req.params;
        const bowler = await bowlerLiveData.findAll({where:{matchId:id}});
        res.status(200).json({success:true,bowler});
    } catch (err) {
        res.status(500).json({success:false,err:err.message});
    }
}

exports.updateBowlerUpdate = async(req,res)=>{
    try {
        const {userId ,runs ,overs} = req.body;
        const {id} = req.params;
        console.log('over',overs)
        const batter = await bowlerLiveData.findOne({where:{userId:userId,matchId:id}});
        batter.update({
            runs ,overs:overs 
        })
        res.status(201).json({success:true});
    } catch (err) {
        res.status(500).json({success:false,err:err.message});
    }
}
exports.updateBowlerWicket = async(req,res)=>{
    try {
        const {userId ,wickets} = req.body;
        const {id} = req.params;
        const batter = await bowlerLiveData.findOne({where:{userId:userId,matchId:id}});
        batter.update({
            wickets 
        })
        res.status(201).json({success:true});
    } catch (err) {
        res.status(500).json({success:false,err:err.message});
    }
}

exports.postBowlerUpdate = async(req,res)=>{
    try {
        const {userId} = req.body;
        const {id}= req.params;    
        await bowlerLiveData.create({
            userId:userId,
            matchId:id
        })
        res.status(201).json({success:true});
    } catch (err) {
        res.status(500).json({success:false,err:err.message});
    }
}

// hhh
exports.getBatterUpdate = async(req,res)=>{
    try {
        const {id } = req.params;
        const batters = await batterLiveData.findAll({where:{matchId:id}});
        res.status(200).json({success:true,batters});
    } catch (err) {
        res.status(500).json({success:false,err:err.message});
    }
}

exports.updateBatterUpdate = async(req,res)=>{
    try {
        const {userId ,runs ,fours ,sixes ,balls,state} = req.body;
        const {id}= req.params; 
        const batter = await batterLiveData.findOne({where:{userId:userId,matchId:id}});
        batter.update({
            state ,runs ,fours ,sixes ,balls
        })
        res.status(201).json({success:true});
    } catch (err) {
        res.status(500).json({success:false,err:err.message});
    }
}

exports.postBatterUpdate = async(req,res)=>{
    try {
        const {userId} = req.body;
        const {id} = req.params;
        await batterLiveData.create({
            userId:userId,
            matchId:id
        })
        res.status(201).json({success:true});
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false,err:err.message});
    }
}

exports.postMatch = async(req,res)=>{
    const transaction = await sequelize.transaction();
    try {
        const {team1Id ,team2Id,tournamentId,overs} = req.body;
        const createMatch = await match.create({
            team1Id,
            team2Id,
            overs,
            tournamentId:tournamentId
        },{transaction});
        // const getTeam1 = await team.findByPk(team1Id,{transaction});
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
        console.log(err)
        res.status(500).json({success:false,err:err.message});
    }
}
exports.updateMatch = async(req,res)=>{
    try {
        const {inning,runs,wickets,overs,balls} = req.body;
        const {id} = req.params;
        console.log(inning,runs,wickets,overs,balls,id)
        const getMatch = await match.findByPk(id);
        if(getMatch){
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
        }else{
            res.status(404).json({success:false,message:'match not found!'});
        }
        
        
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false,message:err.message});
    }
}

exports.getMatch = async(req ,res)=>{
    try {
        const {id} = req.params;
        const getMatch = await match.findOne({where:{tournamentId:id,isLive:true}});
        // console.log(getMatch)
        res.status(201).json({success:true,match:getMatch});
    } catch (err) {
        res.status(500).json({success:false,err:err.message});
    }
}

exports.endMatch = async(req,res)=>{
    try {
        const {id} = req.params;
        await match.update({isLive:false},{where:{id:id}});
        const getBattersData = await batterLiveData.findAll({where:{matchId:id}});
        for( let batterData of getBattersData){
            const userId = batterData.userId;
            const runs = batterData.runs;
            const fours = batterData.fours;
            const sixes = batterData.sixes;
            const balls = batterData.balls;
            
            await userData.increment({
                runs:runs,
                fours:fours,
                sixes:sixes,
                balls:balls

            },{where:{userId:userId}})
        }
        const getBowlersData = await bowlerLiveData.findAll({where:{matchId:id}});
        for( let bowlerData of getBowlersData){
            const userId = bowlerData.userId;
            const overs = bowlerData.overs;
            const wickets = bowlerData.wickets;
            
            await userData.increment({
                overs:overs,
                wickets:wickets
            },{where:{userId:userId}})
        }
        res.status(201).json({success:true});
    } catch (err) {
        res.status(500).json({success:false,err:err.message});
    }
}