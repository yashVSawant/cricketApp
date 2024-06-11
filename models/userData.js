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
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique:true
    }
})

module.exports = userData;