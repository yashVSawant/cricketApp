const jwt = require('jsonwebtoken');
require('dotenv').config();

const user = require('../models/user');

const authenticate = async(req,res,next)=>{
    try{
        const fullToken = req.header('Authorization');
        // console.log(fullToken)
        if(!fullToken) throw new Error('access denied');
        const token = fullToken.split(" ")[1];
        const tokenClient = jwt.verify(token , process.env.TOKENKEY);
        if(tokenClient.role === 'player'){
            const client = await user.findByPk(tokenClient.id);
            if(client){
            req.user = client;
            next();
            }else{
                res.status(401).json({success:false , message:"unauthorize user!"});
            }
        }else{
            res.status(403).json({success:false , message:"invalid token"});
        }
        
    }catch(err){
        res.status(500).json({success:false , message:err.message});
    }
}

module.exports = {authenticate};