const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const tournament = sequelize.define('tournament',{
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    startDate:{
        type:Sequelize.DATE,
        allowNull:false
    },
    endDate:{
        type:Sequelize.DATE,
        allowNull:false
    },
    address:{
        type:Sequelize.STRING,
        allowNull:false
    }

})

module.exports = tournament;