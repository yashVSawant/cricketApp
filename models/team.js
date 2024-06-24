const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const team = sequelize.define('team',{
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports  = team;