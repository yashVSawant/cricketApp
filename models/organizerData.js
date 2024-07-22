const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const organizerData = sequelize.define('organizerData',{
    email:{
        type:Sequelize.STRING,
        alllowNull:false,
        unique:true
    },
    village:{
        type:Sequelize.STRING,
        allowNull:false
    },
    taluka:{
        type:Sequelize.STRING,
        allowNull:false
    },
})

module.exports = organizerData;