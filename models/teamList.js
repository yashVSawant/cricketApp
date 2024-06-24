const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const teamList = sequelize.define('teamList',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    }
});

module.exports = teamList;