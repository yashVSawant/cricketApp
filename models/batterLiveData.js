const Sequelize  = require('sequelize');

const sequelize = require('../utils/database');

const batterLiveData = sequelize.define('batterLiveData',{
    state:{
        type:Sequelize.STRING,
        alllowNull:false,
        defaultValue:'not out'
    },
    runs:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    sixes:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    fours:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    },
    balls:{
        type:Sequelize.INTEGER,
        alllowNull:false,
        defaultValue:0
    }
});

module.exports = batterLiveData;