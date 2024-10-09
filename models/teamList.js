const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
        name:{type:Schema.Types.String,require:true},
        userId:{ type: Schema.Types.ObjectId, ref: 'user' },
        teamId:{ type: Schema.Types.ObjectId, ref: 'team' },
})

module.exports = mongoose.model('teamList',schema);