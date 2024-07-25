const express = require('express');

const socketIo = require('socket.io')
const path = require('path');
const cors = require('cors');
const fs = require('fs')

const bodyParser = require("body-parser");
const sequelize = require('./utils/database');

const app = express();

const userRoutes = require('./routers/user');
const authRoutes = require('./routers/auth');
const tournamentRoutes = require('./routers/tournament');
const organizationRoutes = require('./routers/organization');
const teamRoutes = require('./routers/team');
const matchRoutes = require('./routers/match');
const paymentRoutes = require('./routers/payment');

const {authenticate} = require('./middlewares/authentication');
const {errorHandler} = require('./middlewares/errorHandler');

const  batterLiveData = require('./models/batterLiveData');
const  bowlerLiveData = require('./models/bowlerLiveData');
const  user = require('./models/user');
const  userData = require('./models/userData');
const  organizerData = require('./models/organizerData');
const  tournament = require('./models/tournament');
const  match = require('./models/match');
const  team = require('./models/team');
const  teamList = require('./models/teamList');
const order = require('./models/order');

userData.belongsTo(user);
user.hasOne(userData);
organizerData.belongsTo(user);
user.hasOne(organizerData);
batterLiveData.belongsTo(user);
user.hasOne(batterLiveData);
bowlerLiveData.belongsTo(user);
user.hasOne(bowlerLiveData);
batterLiveData.belongsTo(match);
match.hasOne(batterLiveData);
bowlerLiveData.belongsTo(match);
match.hasOne(bowlerLiveData);
tournament.belongsTo(user);
user.hasMany(tournament);
match.belongsTo(tournament);
tournament.hasMany(match);
order.belongsTo(user);
user.hasMany(order);
team.belongsToMany(user,{ through: teamList });
user.belongsToMany(team,{ through: teamList });


app.use(express.static('views'));
app.use(bodyParser.json());
app.use(cors({origin:'*'}));

app.use('/auth/api',authRoutes);
app.use(authenticate);
app.use('/user/api',userRoutes);
app.use('/tournament/api',tournamentRoutes);
app.use('/organization/api',organizationRoutes);
app.use('/team/api',teamRoutes);
app.use('/match/api',matchRoutes);
app.use('/payment/api',paymentRoutes);

app.use((req,res)=>{
        if(fs.existsSync(path.join(__dirname,'views',`${req.url}`))){
            res.sendFile(path.join(__dirname,'views',`${req.url}`))  
        }else{
            res.redirect('/error/index.html') 
        }
        
})
app.use(errorHandler)

sequelize
.sync()
// .sync({force:true})
.then(()=>{
    const server = app.listen(3000, () => {
        console.log('Server running!')
    });

    const io = socketIo(server);
    io.on('connect',(socket)=>{
        socket.on('watch-score',(matchId)=>{
            socket.join(matchId);
            console.log('joind >>',matchId)
        })
        socket.on('batter-update',( id ,inning,runs ,sixes ,fours ,balls,matchId)=>{
            console.log(">",matchId)
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
        socket.on('score',( inning ,value,type,overs,balls,matchId)=>{
            console.log(inning ,value,type,overs,balls,matchId)
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
