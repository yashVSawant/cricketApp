
const jwt = require('jsonwebtoken');
require('dotenv').config();
const organization = require('../models/organization');
const hashService = require('../services/bcrypt');

exports.signup = async(req ,res)=>{
    try{
        const {name ,email ,village,taluka,password} = req.body;

        const hash = await hashService.createHash(password);
        const newOrganization = await organization.create({
            name:name,
            email:email,
            village:village,
            taluka:taluka,
            password:hash
        })
        res.status(201).json({success:true ,organization:newOrganization});
    }catch(err){
        console.log(err)
        res.status(403).json({success:false , message:err.message});
    }

}

exports.login = async(req,res)=>{
    try {
        const {email , password} = req.body;
        const organizer = await organization.findOne({where:{email:email}});
        if(organizer){
            const isCorrect = await hashService.compareHash(password ,organizer.password);
            res.status(200).json({success:true , token:generateAccessToken(organizer.id,organizer.name)}); 
        }else{
            res.status(403).json({success:false,message:"organization not found"})
        }
    } catch (err) {
        res.status(500).json({success:false,message:"something went wrong!"})
    } 
}

function generateAccessToken(id,name){
    return jwt.sign({id,name,role:'organizer'},process.env.TOKENKEY)
}