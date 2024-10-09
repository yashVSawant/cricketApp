const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    playerType:{type:Schema.Types.String,require:true,},
    imageUrl:{type:Schema.Types.String},
    matches:{type:Schema.Types.Number,require:true,default:0},
    runs:{type:Schema.Types.Number,require:true,default:0},
    wickets:{type:Schema.Types.Number,require:true,default:0},
    sixes:{type:Schema.Types.Number,require:true,default:0},
    fours:{type:Schema.Types.Number,require:true,default:0},
    balls:{type:Schema.Types.Number,require:true,default:0},
    highestScore:{type:Schema.Types.Number,require:true,default:0},
    highestWickets:{type:Schema.Types.Number,require:true,default:0},
    overs:{type:Schema.Types.Number,require:true,default:0},
    userId :{ type: Schema.Types.ObjectId, ref: 'user' }
})

module.exports = mongoose.model('userData',schema);