const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const match = sequelize.define('match',{
    isLive:{
        type:Sequelize.BOOLEAN,
        defaultValue:true,
    },
    overs:{
        type:Sequelize.INTEGER,
        alllowNull:false
    },
    team1Id:{
        type:Sequelize.INTEGER,
        alllowNull:false
    },
    team2Id:{
        type:Sequelize.INTEGER,
        alllowNull:false
    },
    team1Runs:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    team2Runs:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    team1Wickets:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    team2Wickets:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    team1Overs:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    team2Overs:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    team1Balls:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    team2Balls:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    }
});

module.exports = match;