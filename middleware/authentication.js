const jwt = require('jsonwebtoken');
require('dotenv').config();

const user = require('../models/user');

const authenticate = async(req,res,next)=>{
    try{
        const fullToken = req.header('Authorization');
        const token = fullToken.split(" ")[1];
        console.log(token)
        const tokenUser = jwt.verify(token , process.env.TOKENKEY);
        const checkUser = await user.findByPk(tokenUser.id);
        if(!checkUser)throw new Error("Unauthorize user");
        req.user = checkUser;
        next();
    }catch(err){
        // console.log(err)
        res.status(403).json({success:false , message:err.message});
    }
}

module.exports = {authenticate};