const jwt = require('jsonwebtoken');
require('dotenv').config();

const organization = require('../models/organization');

const authenticate = async(req,res,next)=>{
    try{
        const fullToken = req.header('Authorization');
        if(!fullToken) throw new Error('access denied')
        const token = fullToken.split(" ")[1];
        const tokenClient = jwt.verify(token , process.env.TOKENKEY);
        const client = await organization.findByPk(tokenClient.id);
        if(!client)throw new Error("Unauthorize user");
        req.user = client;
        next();
    }catch(err){
        res.status(403).json({success:false , message:err.message});
    }
}

module.exports = {authenticate};