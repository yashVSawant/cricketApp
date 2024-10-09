const team = require('../models/team');
const teamList = require('../models/teamList')
const user = require('../models/user');
const hash = require('../services/bcrypt');
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler}= require('../utils/asyncErrorHandler');

exports.getPlayersAndTeam = asyncErrorHandler(async(req,res)=>{
        const {name ,password} = req.body;
        if(isNullValue(name) || isNullValue(password))throw new ApiError('invalid input!' ,400)
        const getPassword = await team.findOne({captainName:name}).select('password')
        if(!getPassword)throw new ApiError('team not found !',404)
        await hash.compareHash(password, getPassword.password);
        const getTeam = await team.findOne({captainName:name}).select('_id name');
        const getPlayers = await teamList.find({teamId :getTeam._id }).select('userId name')
        res.status(200).json({success:true,team:getTeam ,players:getPlayers});
})
exports.getPlayers = asyncErrorHandler(async(req,res)=>{
        const {id} = req.params;
        if(isNullValue(id))throw new ApiError('invalid input!' ,400)
        const getPlayers = await teamList.find({teamId:id}).select('userId name');
        const getTeam = await team.findOne({_id:id}).select('captainName')
        const isCaptain = getTeam.captainName === req.user.name?true:false;
        res.status(200).json({success:true ,team:getPlayers ,isCaptain});
})

exports.getTeam = asyncErrorHandler(async(req,res)=>{
        const teamLists = await teamList.find({userId:req.user._id})
        const teamIds = teamLists.map(item => item.teamId);
        const teams = await team.find({ _id: { $in: teamIds } }).lean();
        res.status(200).json({success:true ,teams:teams});
})

exports.postTeam = asyncErrorHandler(async(req,res)=>{
        const {name ,password} = req.body;
        if(isNullValue(name) || isNullValue(password))throw new ApiError('invalid input!' ,400)
        const hashPassword = await hash.createHash(password);
        const getTeam = await team.findOne({captainName:req.user.name});
        console.log(getTeam)
        if(getTeam)throw new ApiError('you are already a captain!', 400)
        const newTeam = new team({name ,captainName:req.user.name ,password :hashPassword });
        const newTeamList = new teamList({
                name:req.user.name,
                userId:req.user._id,
                teamId:newTeam._id
        });
        await newTeamList.save();
        await newTeam.save();
        res.status(200).json({success:true,team:newTeam});
})
exports.deleteTeam = asyncErrorHandler(async(req,res)=>{
        const {id} = req.params;
        if(isNullValue(id))throw new ApiError('invalid input!' ,400)
        const getTeam = await team.findById(id);
        if(!getTeam) throw new ApiError('team not found!',404)
        if(getTeam.captainName !== req.user.name)throw new ApiError('your are not captain!',403)
        await team.findByIdAndDelete(id);
        await teamList.deleteMany({teamId:id});
        res.status(200).json({success:true});
})

exports.addPlayer = asyncErrorHandler(async(req,res)=>{
        let {name ,password ,teamId} = req.body;
        if(isNullValue(name) || isNullValue(password)||isNullValue(teamId))throw new ApiError('invalid input!' ,400)
        const getTeamCount = await teamList.countDocuments({teamId:teamId});
        if(getTeamCount >= 11)throw new ApiError('team is full!',400);
        const getTeam = await team.findById(teamId);
        if(!getTeam)throw new ApiError('team not found ',404)
        if(getTeam.captainName != req.user.name)throw new ApiError('You are not a captain!',400)
        name = name.trim();
        password = password.trim();
        const getUser = await user.findOne({name:name});
        if(!getUser)throw new ApiError('user not found!',404)
        await hash.compareHash(password , getUser.password);
        const newPlayer = new teamList({
                        userId:getUser._id,
                        teamId:teamId,
                        name:getUser.name
                    });
        await newPlayer.save()
        res.status(201).json({success:true,player:newPlayer});
})

exports.removePlayer = asyncErrorHandler(async(req ,res)=>{
        const {id,teamId} = req.params;
        if(isNullValue(id) || isNullValue(teamId))throw new ApiError('invalid input!' ,400)
        const getUser = await user.findById(id);
        if(getUser.name === req.user.name)throw new ApiError('captain cannot be removed!',400)
        const getTeam = await team.findById(teamId);
        if(getTeam.captainName != req.user.name)throw new ApiError('You are not captain!',400)   
        await teamList.findOneAndDelete({
                userId:id,
                teamId:teamId
        });
        res.status(201).json({success:true});           
})

function isNullValue(value){
    return value === ""?true :false;
}