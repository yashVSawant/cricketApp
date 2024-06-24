const team = require('../models/team');
const user = require('../models/user');
const teamList = require('../models/teamList');
const hash = require('../services/bcrypt');

exports.getTeam = async(req,res)=>{
    try{
        const {email ,password} = req.body;
        console.log(email ,password);
        const getTeam = await team.findOne({where:{email:email}});
        await hash.compareHash(password, getTeam.password);
        const getplayersInTeam = await getTeam.getUsers();
        console.log(getplayersInTeam);
        res.status(200).json({success:true ,players:getplayersInTeam ,team:getTeam});
    }catch(err){
        console.log(err)
        res.status(500).json({success:false ,message:err.message});
    }
}

exports.postTeam = async(req,res)=>{
    try{
        const {name ,email ,password} = req.body;
        if(!password)throw new Error('please enter password')
        const hashPassword = await hash.createHash(password);
        const post = await team.create({name ,email ,password :hashPassword});
        res.status(200).json({success:true,team:post});
    }catch(err){
        console.log(err)
        res.status(500).json({success:false});
    }
}

exports.addPlayerInTeam = async(req,res)=>{
    try {
        const {email ,password ,teamId} = req.body;
        const getUser = await user.findOne({where:{email:email}});
        await hash.compareHash(password , getUser.password);
        await teamList.create({
            userId:getUser.id,
            teamId:teamId
        });
        res.status(201).json({success:true,player:getUser});
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false ,message:err.message})
    }
}