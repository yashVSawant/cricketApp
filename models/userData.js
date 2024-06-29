const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const userData = sequelize.define('userData',{
    playerType:{
        type:Sequelize.STRING,
        allowNull:false
    },
    matches:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    },
    runs:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    },
    wickets:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    },
    sixes:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    },
    fours:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    },
    balls:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    },
    highestScore:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    },
    highestWickets:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    },
    overs:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    }
})

module.exports = userData;