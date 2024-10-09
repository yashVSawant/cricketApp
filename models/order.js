const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    orderId:{type:Schema.Types.String,require:true,unique:true},
    paymentId:{type:Schema.Types.String,require:true},
    status:{type:Schema.Types.String,require:true},
    isValid:{type:Schema.Types.Boolean,require:true,default:true},
})

module.exports = mongoose.model('order',schema);