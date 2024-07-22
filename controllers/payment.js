const Razorpay = require('razorpay');
const razorPayOrder = require('../services/razorPay');
const order = require('../models/order')
require('dotenv').config();
const ApiError = require('../utils/ApiErrors');


exports.purchasePremium = async(req,res,next)=>{
    try{
        const {Order ,key_id} = await razorPayOrder.order(req.user.id);
        res.status(201).json({Order,key_id})
        
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}
exports.updatePremium = async(req,res,next)=>{
    try{
        
        const {order_id,payment_id,status} = req.body;
        if(isNullValue(order_id) || isNullValue(payment_id)||isNullValue(status))throw new ApiError('invalid input!' ,400)
        await order.update({status:status,paymentId:payment_id},{where:{orderId:order_id}})
        res.status(200).json({success:true})
    }catch(err){
        next(new ApiError(err.message ,err.statusCode))
    }
}

function isNullValue(value){
    return value === ""?true :false;
}