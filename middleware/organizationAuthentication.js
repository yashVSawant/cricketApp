const jwt = require('jsonwebtoken');
require('dotenv').config();

const organization = require('../models/organization');

const authenticate = async(req,res,next)=>{
    try{
        const fullToken = req.header('Authorization');
        if(!fullToken) throw new Error('access denied')
        const token = fullToken.split(" ")[1];
        const tokenClient = jwt.verify(token , process.env.TOKENKEY);
        
        if(tokenClient.role === 'organizer'){
            const client = await organization.findByPk(tokenClient.id);
            if(client){
            req.user = client;
            next();
            }else{
                res.status(403).json({success:false , message:"Unauthorize organization"});
            }
        }else{
            res.status(403).json({success:false , message:'invalid token'});
        }
    }catch(err){
        res.status(500).json({success:false , message:err.message});
    }
}

module.exports = {authenticate};