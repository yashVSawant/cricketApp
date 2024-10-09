const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    name:{type:Schema.Types.String,require:true},
    startDate:{type:Schema.Types.Date,require:true},
    endDate:{type:Schema.Types.Date,require:true},
    address:{village:{type:Schema.Types.String,require:true},taluka:{type:Schema.Types.String,require:true}},
    userId:{ type: Schema.Types.ObjectId, ref: 'user'},
})

module.exports = mongoose.model('tournament',schema);