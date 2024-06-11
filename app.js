const express = require('express');

const bodyParser = require("body-parser");
const sequelize = require('./utils/database');

const user = require('./models/user');
const userData = require('./models/userData');
const taluka = require('./models/taluka');
const village = require('./models/village');

const app = express();

const userRoutes = require('./routers/user');

app.use(bodyParser.json());

app.use('/user/api',userRoutes);

sequelize
.sync()
// .sync({force:true})
.then(()=>{
    app.listen(3333,()=>{
        console.log("running")
    })
})
.catch((err)=>{console.log(err)});
