const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    isLive:{type:Schema.Types.Boolean,require:true,defaultValue:true},
    batters:[{
        userId:{ type: Schema.Types.ObjectId, ref: 'user' },
        runs:{type:Schema.Types.Number,require:true,default:0},
        fours:{type:Schema.Types.Number,require:true,default:0},
        sixes:{type:Schema.Types.Number,require:true,default:0},
        balls:{type:Schema.Types.Number,require:true,default:0},
        inning:{type:Schema.Types.Number,require:true,default:1},
        order:{type:Schema.Types.Number,require:true}
    }],
    bowlers:[{
        userId:{ type: Schema.Types.ObjectId, ref: 'user' },
        balls:{type:Schema.Types.Number,require:true,default:0},
        runs:{type:Schema.Types.Number,require:true,default:0},
        wickets:{type:Schema.Types.Number,require:true,default:0},
        inning:{type:Schema.Types.Number,require:true,default:1},
        order:{type:Schema.Types.Number,require:true}
    }],
    matchId :{ type: Schema.Types.ObjectId, ref: 'match' }
})

module.exports = mongoose.model('live',schema);