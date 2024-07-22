const Razorpay = require('razorpay');
const order = require('../models/order');
require('dotenv').config();

exports.order = (id) =>{
    return new Promise((res,rej)=>{
        var rzp = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 5000;
        return rzp.orders.create({amount,currency:'INR'},async(err ,Order)=>{
                if(err){
                    console.log(err)
                    return rej('something went wrong in purchase!')
                }
                await order.create({orderId:Order.id ,userId:id})
                return res({Order ,key_id : rzp.key_id})
            })
    })
    
}