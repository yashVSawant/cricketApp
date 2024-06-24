const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const organization = sequelize.define('organization',{
    name:{
        type:Sequelize.STRING
    },
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
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }

})

module.exports = organization;