const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const teamList = sequelize.define('teamList',{
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    teamId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
});

module.exports = teamList;