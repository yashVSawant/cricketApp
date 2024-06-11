const Sequelize = require("sequelize");

const sequelize =  new Sequelize('cricketer-data','root','Yash1234',{
    dialect:'mysql',
    host:'localhost'
})
// require('dotenv').config();

// const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
//     dialect:'mysql',
//     host:process.env.DB_HOST
// })

module.exports = sequelize;