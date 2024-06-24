const express = require('express');
const path = require('path');
const cors = require('cors');

const bodyParser = require("body-parser");
const sequelize = require('./utils/database');

const app = express();

const userRoutes = require('./routers/user');
const tournamentRoutes = require('./routers/tournament');
const organizationRoutes = require('./routers/organization');
const teamRoutes = require('./routers/team');

const  user = require('./models/user');
const  userData = require('./models/userData');
const  organization = require('./models/organization');
const  tournament = require('./models/tournament');
const  team = require('./models/team');
const  teamList = require('./models/teamList');

userData.belongsTo(user);
user.hasOne(userData);
tournament.belongsTo(organization);
organization.hasMany(tournament);
team.belongsToMany(user,{ through: teamList });
user.belongsToMany(team,{ through: teamList });



app.use(bodyParser.json());
app.use(express.static('views'));
app.use(cors({origin:'*'}));

app.use('/user/api',userRoutes);
app.use('/tournament/api',tournamentRoutes);
app.use('/organization/api',organizationRoutes);
app.use('/team/api',teamRoutes);

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`views/${req.url}`))
})

app.use((req,res)=>{
    res.send(404);
})

sequelize
.sync()
// .sync({force:true})
.then(()=>{
    app.listen(3333,()=>{
        console.log("running")
    })
})
.catch((err)=>{console.log(err)});
