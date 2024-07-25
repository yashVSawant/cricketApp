require('dotenv').config();
const Sequelize = require("sequelize");//MYSQL_ADDON_URI

const sequelize =  new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
    dialect:'mysql',
    host:process.env.DB_HOST
})

// const sequelize = new Sequelize(process.env.MYSQL_ADDON_URI, {
//     dialect: 'mysql',
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false
//       }
//     }
//   });

module.exports = sequelize;