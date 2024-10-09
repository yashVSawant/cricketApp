const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    email:{type:Schema.Types.String,require:true,unique:true},
    village:{type:Schema.Types.String,require:true},
    taluka:{type:Schema.Types.String,require:true},
    userId :{ type: Schema.Types.ObjectId, ref: 'user' }
})

module.exports = mongoose.model('organizerData',schema);