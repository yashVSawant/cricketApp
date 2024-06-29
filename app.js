const express = require('express');

const socketIo = require('socket.io')
const path = require('path');
const cors = require('cors');

const bodyParser = require("body-parser");
const sequelize = require('./utils/database');

const app = express();

const userRoutes = require('./routers/user');
const tournamentRoutes = require('./routers/tournament');
const organizationRoutes = require('./routers/organization');
const teamRoutes = require('./routers/team');
const matchRoutes = require('./routers/match');

const  batterLiveData = require('./models/batterLiveData');
const  bowlerLiveData = require('./models/bowlerLiveData');
const  user = require('./models/user');
const  userData = require('./models/userData');
const  organization = require('./models/organization');
const  tournament = require('./models/tournament');
const  match = require('./models/match');
const  team = require('./models/team');
const  teamList = require('./models/teamList');

userData.belongsTo(user);
user.hasOne(userData);
batterLiveData.belongsTo(user);
user.hasOne(batterLiveData);
bowlerLiveData.belongsTo(user);
user.hasOne(bowlerLiveData);
batterLiveData.belongsTo(match);
match.hasOne(batterLiveData);
bowlerLiveData.belongsTo(match);
match.hasOne(bowlerLiveData);
tournament.belongsTo(organization);
organization.hasMany(tournament);
match.belongsTo(tournament);
tournament.hasMany(match);
team.belongsToMany(user,{ through: teamList });
user.belongsToMany(team,{ through: teamList });



app.use(bodyParser.json());
app.use(express.static('views'));
app.use(cors({origin:'*'}));

app.use('/user/api',userRoutes);
app.use('/tournament/api',tournamentRoutes);
app.use('/organization/api',organizationRoutes);
app.use('/team/api',teamRoutes);
app.use('/match/api',matchRoutes);

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
    const server = app.listen(3333, () => {
        console.log('Server running!')
    });

    const io = socketIo(server);
    io.on('connect',(socket)=>{
        socket.on('watch-score',(matchId)=>{
            socket.join(matchId);
            // console.log(matchId)
        })
        socket.on('batter-update',( id ,inning,runs ,sixes ,fours ,balls,matchId)=>{
            socket.to(matchId).emit('batter' , id ,inning,runs ,sixes ,fours ,balls);
        }) 
        socket.on('batter-out',( id ,inning,vaue,type,matchId)=>{
            socket.to(matchId).emit('out' , id ,inning,vaue,type);
        })
        socket.on('bowler-update',( id ,inning,over,runs,matchId)=>{
            socket.to(matchId).emit('bowler' ,id ,inning,over,runs);
        }) 
        socket.on('bowler-wicket',( id,inning,wickets ,matchId)=>{
            socket.to(matchId).emit('wicket' ,id ,inning,wickets);
        })
        socket.on('score',( inning ,value,type,matchId)=>{
            socket.to(matchId).emit('get-score' ,inning ,value,type,overs ,balls);
        })
        socket.on('new-batter',(  id,inning,matchId)=>{
            socket.to(matchId).emit('new-batter-id' ,id,inning);
        })
        socket.on('new-bowler',( id,inning ,matchId)=>{
            socket.to(matchId).emit('new-bowler-id' ,id ,inning);
        })
    })
})
.catch((err)=>{console.log(err)});
