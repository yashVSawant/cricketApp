const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const team = sequelize.define('team',{
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    captainId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

module.exports  = team;