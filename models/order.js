const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const order = sequelize.define('order',{
    orderId:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    paymentId:{
        type:Sequelize.STRING,
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:'pending'
    },
    isValid:{
        type:Sequelize.BOOLEAN,
        defaultValue:true
    }
})

module.exports  = order;