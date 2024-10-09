const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    name:{type:Schema.Types.String,require:true,unique:true},
    password:{type:Schema.Types.String,require:true},
    playerType:{type:Schema.Types.String,require:true},
    role:{type:Schema.Types.String,require:true,default:'player'}
})

module.exports = mongoose.model('user',schema);