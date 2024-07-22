require('dotenv').config();
const user = require('../models/user');
const hashService = require('../services/bcrypt');
const organizerData = require('../models/organizerData');
const sequelize = require('../utils/database');
const ApiError = require('../utils/ApiErrors');

exports.signup = async(req ,res ,next)=>{
    const transaction = await sequelize.transaction();
    try{
        const {name ,email ,village,taluka,password} = req.body;
        if(isNullValue(name)||isNullValue(email)||isNullValue(village)||isNullValue(taluka)||isNullValue(password))throw ApiError('invalid input!',400)
        const isExist = await user.findOne({where:{name:name}});
        if(isExist)throw new ApiError('organization already exist' ,400)
            const hash = await hashService.createHash(password);
            const organizer = await user.create({
                name:name,
                password:hash,
                role:'organization'
            },{transaction})
            await organizerData.create({
                email,
                village,
                taluka,
                userId:organizer.id
            },{transaction}) ;
            await transaction.commit();
            res.status(201).json({success:true});
        
    }catch(err){
        // console.log(err)
        await transaction.rollback();
        next(new ApiError(err.message ,err.statusCode))
    }

}

exports.getOrganization = async(req,res,next)=>{
    try {
        const organizations = await user.findAll({where:{role:'organization'},attributes:['id','name']});
        res.status(200).json({success:true,organizations})
    } catch (err) {
        next(new ApiError(err.message ,err.statusCode))
    }
}

function isNullValue(value){
    return value === ""?true :false;
}