const tournament = require('../models/tournament');
const user = require('../models/user');
const match = require('../models/match');
const { Op } = require('sequelize');
const hashService = require('../services/bcrypt');
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

exports.ongoingTournaments = asyncErrorHandler(async(req,res)=>{
        let day = new Date();
        day.setHours(0,0,0,0);
        let today = new Date(day);
        const info = await tournament.findAll({
            where: {
                startDate: {
                    [Op.lte]: new Date()
                },
                endDate: {
                    [Op.gte]: today
                }
            },
            include: [{
                model: user,
                attributes: ['name']
            }]
        })
        res.status(200).json({success:true , info});
})

exports.postTournament = asyncErrorHandler(async(req,res)=>{
        const {name , startDate , endDate ,address,password }  = req.body;
        if(isNullValue(name) || isNullValue(startDate)||isNullValue(endDate)||isNullValue(address)||isNullValue(password))throw new ApiError('invalid input!' ,400)
        if((new Date(startDate)<new Date() || new Date(startDate) > new Date(endDate)))throw new ApiError('invalid dates!',400)
            await hashService.compareHash(password,req.user.password);
            const post = await tournament.create({
                    name,
                    startDate,
                    endDate,
                    address,
                    userId:req.user.id
            })
            res.status(201).json({success:true ,tournament:post});
})
exports.getTournaments = asyncErrorHandler(async(req,res)=>{
        let day = new Date();
        day.setHours(0,0,0,0);
        let today = new Date(day);
        const tournaments = await tournament.findAll({
            where: {
                userId:req.user.id,
                endDate: {
                    [Op.gte]: today
                }
            },
            
        })
        res.status(200).json({success:true , tournaments});
})

function isNullValue(value){
    return value === ""?true :false;
}
