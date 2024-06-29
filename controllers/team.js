const team = require('../models/team');
const user = require('../models/user');
const teamList = require('../models/teamList');
const hash = require('../services/bcrypt');

exports.getPlayersAndTeam = async(req,res)=>{
    try{
        const {email ,password} = req.body;
        const getTeam = await team.findOne({where:{email:email},attributes:['id','name','password']});
        if(getTeam){
            console.log(email,password,getTeam.password)
            await hash.compareHash(password, getTeam.password);
            console.log(email,password)
            const getplayersInTeam = await getTeam.getUsers({attributes:['id','name','email']});
            const teamName = await team.findOne({where:{email:email},attributes:['id','name']});
            res.status(200).json({success:true ,players:getplayersInTeam ,team:teamName});
        }else{
            res.status(404).json({success:false ,message:'team not found'});
        }
    }catch(err){
        console.log(err)
        res.status(500).json({success:false ,message:err.message});
    }
}
exports.getPlayers = async(req,res)=>{
    try{
        const {id} = req.params;
        const getTeam = await team.findOne({where:{id:id},attributes:['id','name']});
        const getplayersInTeam = await getTeam.getUsers({attributes:['id','name','email']});
        
        res.status(200).json({success:true ,players:getplayersInTeam ,team:getTeam});
    }catch(err){
        console.log(err)
        res.status(500).json({success:false ,message:err.message});
    }
}

exports.getTeam = async(req,res)=>{
    try {
        const getUser = req.user;
        const team = await getUser.getTeams({attributes:['id','name']})
        res.status(200).json({success:true ,team});
    } catch (err) {
        res.status(500).json({success:false ,message:err.message});
    }
}

exports.postTeam = async(req,res)=>{
    try{
        const {name ,password} = req.body;
        if(!password)throw new Error('please enter password')
        const hashPassword = await hash.createHash(password);
        const post = await team.create({name ,email:req.user.email ,password :hashPassword});
        await teamList.create({
            userId:req.user.id,
            teamId:post.id
        });
        res.status(200).json({success:true,team:post});
    }catch(err){
        console.log(err)
        res.status(500).json({success:false});
    }
}

exports.addPlayer = async(req,res)=>{
    try {
        const {email ,password ,teamId} = req.body;
        const getTeamCount = await teamList.count({where:{teamId:teamId}});
        const getTeam = await team.findByPk(teamId);
        console.log(getTeam.email , req.user.email);
        if(getTeam.email === req.user.email){
            if(getTeamCount < 11){
                const getUser = await user.findOne({where:{email:email}});
                if(getUser){
                    await hash.compareHash(password , getUser.password);
                    await teamList.create({
                        userId:getUser.id,
                        teamId:teamId
                    });
                    res.status(201).json({success:true,player:getUser});
                }else{
                    res.status(404).json({success:false,message:'user not found!'});
                }
            }else{
                res.status(403).json({success:false,message:'team is full!'});
            }
        }else{
            res.status(403).json({success:false,message:'you are not captain!'});
        }  
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false ,message:err.message})
    }
}

exports.removePlayer = async(req ,res)=>{
    try {
        const {id,teamId} = req.params;
        const getTeam = await team.findByPk(teamId);
        const getUser = await user.findByPk(id);
        if(getUser.email != req.user.email){
            if(getTeam.email === req.user.email){
                    
                await teamList.destroy({where:{
                    userId:id,
                    teamId:teamId
                }});
                res.status(201).json({success:true});
                    
            }else{
                res.status(403).json({success:false,message:'you are not captain!'});
            }  
        }else{
            res.status(403).json({success:false,message:'captain cannot be removed'});
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false ,message:err.message})
    }
}

