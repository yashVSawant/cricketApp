require('dotenv').config();
const User = require('../models/user');
const mongoose = require('mongoose')
const OrganizerData = require('../models/organizerData');
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

exports.signup = asyncErrorHandler(async(req ,res)=>{
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const {name ,email ,village,taluka} = req.body;
        if(isNullValue(name)||isNullValue(email)||isNullValue(village)||isNullValue(taluka))throw ApiError('invalid input!',400)
        
            const getUser = await User.findOne({name:name});
            if(!getUser)throw ApiError('user not found!',404);
            getUser.role = 'organization';
            const newOrganizerData = new OrganizerData({
                email,
                village,
                taluka,
                userId:getUser._id
            }) ;
            await getUser.save({session})
            await newOrganizerData.save({session})
            await session.commitTransaction();
            session.endSession();
            res.status(201).json({success:true});
        
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        throw new ApiError(err.message ,err.statusCode)
    }

})

exports.getOrganization = asyncErrorHandler(async(req,res)=>{
        const organizations = await User.find({role:'organization'}).select('_id name');
        res.status(200).json({success:true,organizations});
})

function isNullValue(value){
    return value === ""?true :false;
}