const Tournament = require('../models/tournament');
const user = require('../models/user');
const { Op } = require('sequelize');
const hashService = require('../services/bcrypt');
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');
const organizerData = require('../models/organizerData');

exports.ongoingTournaments = asyncErrorHandler(async(req,res)=>{
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const tournaments = await Tournament.find({
            startDate: { $lte: new Date() },
            endDate: { $gte: today }
        })
        .exec();
        res.status(200).json({success:true , tournaments});
})

exports.postTournament = asyncErrorHandler(async(req,res)=>{
        const {name , startDate , endDate ,password }  = req.body;
        if(isNullValue(name) || isNullValue(startDate)||isNullValue(endDate)||isNullValue(password))throw new ApiError('invalid input!' ,400)
        if((new Date(startDate)<new Date() || new Date(startDate) > new Date(endDate)))throw new ApiError('invalid dates!',400)
        await hashService.compareHash(password,req.user.password);
        const getOrganizerData = await organizerData.findOne({userId:req.user._id});
        if(!getOrganizerData)throw new ApiError('organization not found!' , 404);
        const newTournament = new Tournament({
                    name,
                    startDate,
                    endDate,
                    address:{village:getOrganizerData.village , taluka:getOrganizerData.taluka},
                    userId:req.user._id
            })
        await newTournament.save()
        res.status(201).json({success:true ,tournament:newTournament});
})
exports.getTournaments = asyncErrorHandler(async(req,res)=>{
        let day = new Date();
        day.setHours(0,0,0,0);
        let today = new Date(day);
        const tournaments = await Tournament.find({
                userId:req.user.id,
                endDate: {$gte: today}
        })
        res.status(200).json({success:true , tournaments});
})

function isNullValue(value){
    return value === ""?true :false;
}
