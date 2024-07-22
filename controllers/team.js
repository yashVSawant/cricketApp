const team = require('../models/team');
const user = require('../models/user');
const teamList = require('../models/teamList');
const hash = require('../services/bcrypt');
const ApiError = require('../utils/ApiErrors');

exports.getPlayersAndTeam = async(req,res,next)=>{
    try{
        const {name ,password} = req.body;
        if(isNullValue(name) || isNullValue(password))throw new ApiError('invalid input!' ,400)
        const getTeam = await team.findOne({where:{name:name},attributes:['id','name','password']});
        if(getTeam){
            await hash.compareHash(password, getTeam.password);
            const getplayersInTeam = await getTeam.getUsers({attributes:['id','name']});
            const teamName = await team.findOne({where:{name:name},attributes:['id','name']});
            res.status(200).json({success:true ,players:getplayersInTeam ,team:teamName});
        }else{
            res.status(404).json({success:false ,message:'team not found'});
        }
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}
exports.getPlayers = async(req,res,next)=>{
    try{
        const {id} = req.params;
        if(isNullValue(id))throw new ApiError('invalid input!' ,400)
        const getTeam = await team.findOne({where:{id:id},attributes:['id','name','captainName']});
        const getplayersInTeam = await getTeam.getUsers({attributes:['id','name']});
        const isCaptain = getTeam.captainName === req.user.name?true:false;
        res.status(200).json({success:true ,players:getplayersInTeam ,team:getTeam ,isCaptain});
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}

exports.getTeam = async(req,res,next)=>{
    try {
        const getUser = req.user;
        const playersInTeam = await getUser.getTeams({attributes:['id','name']})
        res.status(200).json({success:true ,team:playersInTeam});
    } catch (err) {
        next(new ApiError(err.message ,err.statusCode))
    }
}

exports.postTeam = async(req,res,next)=>{
    try{
        const {name ,password} = req.body;
        if(isNullValue(name) || isNullValue(password))throw new ApiError('invalid input!' ,400)
        const hashPassword = await hash.createHash(password);
        const post = await team.create({name ,captainName:req.user.name ,password :hashPassword});
        await teamList.create({
            userId:req.user.id,
            teamId:post.id
        });
        res.status(200).json({success:true,team:post});
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}
exports.deleteTeam = async(req,res,next)=>{
    try{
        const {id} = req.params;
        if(isNullValue(id))throw new ApiError('invalid input!' ,400)
        const getTeam = await team.findByPk(id);
        if(getTeam.email === req.user.email){
            await team.destroy({where:{id:id}});
            res.status(200).json({success:true});
        }else{
            res.status(403).json({success:true});
        }
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}

exports.addPlayer = async(req,res,next)=>{
    try {
        let {name ,password ,teamId} = req.body;
        if(isNullValue(name) || isNullValue(password)||isNullValue(teamId))throw new ApiError('invalid input!' ,400)
        const getTeamCount = await teamList.count({where:{teamId:teamId}});
        const getTeam = await team.findByPk(teamId);
        name = name.trim();
        password = password.trim();
        if(getTeam.captainName != req.user.name)throw new ApiError('You are not a captain!',400)
            if(getTeamCount > 11)throw new ApiError('team is full!',400)
                const getUser = await user.findOne({where:{name:name}});
                if(!getUser)throw new ApiError('user not found!',404)
                    await hash.compareHash(password , getUser.password);
                    await teamList.create({
                        userId:getUser.id,
                        teamId:teamId
                    });
                    res.status(201).json({success:true,player:getUser});
                
    } catch (err) {
        next(new ApiError(err.message ,err.statusCode))
        
    }
}

exports.removePlayer = async(req ,res,next)=>{
    try {
        const {id,teamId} = req.params;
        if(isNullValue(id) || isNullValue(teamId))throw new ApiError('invalid input!' ,400)
        const getTeam = await team.findByPk(teamId);
        const getUser = await user.findByPk(id);
        if(getUser.name === req.user.name)throw new ApiError('captain cannot be removed!',400)
        if(getTeam.captainName != req.user.name)throw new ApiError('You are not captain!',400)     
        await teamList.destroy({where:{
                userId:id,
                teamId:teamId
        }});
        res.status(201).json({success:true});           
    } catch (err) {
        next(new ApiError(err.message ,err.statusCode))
    }
}

function isNullValue(value){
    return value === ""?true :false;
}