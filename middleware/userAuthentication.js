const jwt = require('jsonwebtoken');
require('dotenv').config();

const user = require('../models/user');

const authenticate = async(req,res,next)=>{
    try{
        const fullToken = req.header('Authorization');
        if(!fullToken) throw new Error('access denied')
        const token = fullToken.split(" ")[1];
        const tokenClient = jwt.verify(token , process.env.TOKENKEY);
        const client = await user.findByPk(tokenClient.id);
        if(!client)res.status(401).json({success:false , message:"unauthorize user!"});
        
        req.user = client;
        next();
    }catch(err){
        res.status(500).json({success:false , message:err.message});
    }
}

module.exports = {authenticate};