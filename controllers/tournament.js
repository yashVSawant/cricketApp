const tournament = require('../models/tournament');
const organization = require('../models/organization');
const { Op } = require('sequelize');
const hashService = require('../services/bcrypt');

exports.ongoingTournaments = async(req,res)=>{
    try {
        let today = new Date();
        const info = await tournament.findAll({
            where: {
                startDate: {
                    [Op.lte]: today
                },
                endDate: {
                    [Op.gte]: today
                }
            },
            // include: [{
            //     model: organization,
            //     attributes: ['name']
            // }]
        })
        res.status(200).json({success:true , info});
    }catch (err) {
        console.log(err)
        res.status(500).json({success:false,message: err.message});
    }
}

exports.postTournament = async(req,res)=>{
    try {
        const {name , startDate , endDate ,address,password }  = req.body;
        await hashService.compareHash(password,req.user.password);
        const post = await tournament.create({
                name,
                startDate,
                endDate,
                address,
                organizationId:req.user.id
        })
        res.status(201).json({success:true ,tournament:post});
        
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false,message: "Internal Server Error"});
    }
    
}
exports.getTournaments = async(req,res)=>{
    try {
        const tournaments = await tournament.findAll({
            where: {organizationId:req.user.id},
        })
        res.status(200).json({success:true , tournaments});
    }catch (err) {
        console.log(err)
        res.status(500).json({success:false,message: err.message});
    }
}