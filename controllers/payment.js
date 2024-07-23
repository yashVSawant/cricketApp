const Razorpay = require('razorpay');
const razorPayOrder = require('../services/razorPay');
const order = require('../models/order')
require('dotenv').config();
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler}= require('../utils/asyncErrorHandler');


exports.purchasePremium = asyncErrorHandler(async(req,res)=>{
        const {Order ,key_id} = await razorPayOrder.order(req.user.id);
        res.status(201).json({Order,key_id})
})
exports.updatePremium = asyncErrorHandler(async(req,res)=>{
        const {order_id,payment_id,status} = req.body;
        if(isNullValue(order_id) || isNullValue(payment_id)||isNullValue(status))throw new ApiError('invalid input!' ,400)
        await order.update({status:status,paymentId:payment_id},{where:{orderId:order_id}})
        res.status(200).json({success:true})
})

function isNullValue(value){
    return value === ""?true :false;
}