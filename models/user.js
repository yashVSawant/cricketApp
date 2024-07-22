const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const user = sequelize.define('user',{
    name :{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isPlaying:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    role:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:'player'
    }
})

module.exports = user;