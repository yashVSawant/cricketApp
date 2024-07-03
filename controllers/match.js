const sequelize = require('../utils/database');
const Razorpay = require('razorpay');
const match = require('../models/match');
const batterLiveData = require('../models/batterLiveData');
const bowlerLiveData = require('../models/bowlerLiveData');
const userData = require('../models/userData');
const team = require('../models/team');
const teamList = require('../models/teamList');
const order = require('../models/order');
require('dotenv').config();


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
        const {team1Id ,team2Id,tournamentId,overs,orderId} = req.body;
        const getOrder = await order.findOne({where:{orderId:orderId ,isValid:true}});
        if(getOrder){
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
        }else{
            res.status(403).json({success:true,message:'order not valid'});
        }
        
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
        // console.log(inning,runs,wickets,overs,balls,id)
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
        const {id } = req.params;
        const getMatch = await match.findOne({where:{tournamentId:id,isLive:true}});
        // console.log(getMatch)
        res.status(201).json({success:true,match:getMatch});
    } catch (err) {
        res.status(500).json({success:false,err:err.message});
    }
}

exports.endMatch = async(req,res)=>{
    const transaction = await sequelize.transaction();
    try {
        const {id} = req.params;
        const {orderId} = req.body;
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
        res.status(500).json({success:false,err:err.message});
    }
}

exports.purchasePremium = async (req,res)=>{
    try{
        var rzp = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 5000;
        rzp.orders.create({amount,currency:'INR'},async(err ,Order)=>{
                if(err){
                    console.log(err)
                    throw new Error(JSON.stringify(err))
                }
                await order.create({orderId:Order.id ,organizationId:req.user.id})
                return res.status(201).json({Order ,key_id : rzp.key_id});
            })      
        
    }catch(err){
        console.log(err)
        res.status(400).json({success:false,message:'something went wrong in purchase!'})
    }
}
exports.updatePremium = async(req,res)=>{
    try{
        
        const {order_id,payment_id,status} = req.body;
        await order.update({status:status,paymentId:payment_id},{where:{orderId:order_id}})
        res.status(200).json({success:true})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false,message:'something went wrong in updatePremium!'})
    }
}