const Sequelize  = require('sequelize');

const sequelize = require('../utils/database');

const bowlerLiveData = sequelize.define('bowlerLiveData',{
    overs:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    wickets:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    runs:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    }
    
});

module.exports = bowlerLiveData;