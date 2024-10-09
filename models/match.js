const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    isLive:{type:Schema.Types.Boolean,default:true},
    overs:{type:Schema.Types.Number,require:true},
    inning:{type:Schema.Types.Number,require:true,default:1},
    team1:{
        teamId:{ type: Schema.Types.ObjectId, ref: 'team' },
        name:{type:Schema.Types.String,require:true},
        runs:{type:Schema.Types.Number,require:true,default:0},
        wickets:{type:Schema.Types.Number,require:true,default:0},
        balls:{type:Schema.Types.Number,require:true,default:0},
    },
    team2:{
        teamId:{ type: Schema.Types.ObjectId, ref: 'team' },
        name:{type:Schema.Types.String,require:true},
        runs:{type:Schema.Types.Number,require:true,default:0},
        wickets:{type:Schema.Types.Number,require:true,default:0},
        balls:{type:Schema.Types.Number,require:true,default:0},
    },
    createdAt: { type: Date, default: Date.now },
    tournamentId :{ type: Schema.Types.ObjectId, ref: 'tournament' },
    wonTeamId:{ type: Schema.Types.ObjectId, ref: 'team' }
})

module.exports = mongoose.model('match',schema);
