const express = require('express');

require('dotenv').config();
const socketIo = require('socket.io')
const path = require('path');
const cors = require('cors');
const fs = require('fs')

const bodyParser = require("body-parser");

const mongoose = require('mongoose')

const app = express();

const hashService = require('./services/bcrypt');
const userRoutes = require('./routers/user');
const authRoutes = require('./routers/auth');
const tournamentRoutes = require('./routers/tournament');
const organizationRoutes = require('./routers/organization');
const teamRoutes = require('./routers/team');
const matchRoutes = require('./routers/match');
const paymentRoutes = require('./routers/payment');
const liveRoutes = require('./routers/live')

const {authenticate} = require('./middlewares/authentication');
const {errorHandler} = require('./middlewares/errorHandler');

const  User = require('./models/user');

app.use(cors({origin:'*'}));
app.use(express.static('views'));
app.use(bodyParser.json());

app.use('/auth/api',authRoutes);

app.use('/user/api',authenticate,userRoutes);
app.use('/tournament/api',authenticate,tournamentRoutes);
app.use('/team/api',authenticate,teamRoutes);
app.use('/live/api',authenticate,liveRoutes);
app.use('/organization/api',authenticate,organizationRoutes);
app.use('/match/api',authenticate,matchRoutes);
app.use('/payment/api',authenticate,paymentRoutes);

app.use((req,res)=>{
        res.status(404).json({success:false , message:'not found!'})      
})
app.use(errorHandler)

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    const server = app.listen(process.env.PORT || 3000, async() => {
        try{
            const getUser = await User.findOne({name:process.env.ADMIN_USERNAME});
            if(!getUser){
                const hash = await hashService.createHash(process.env.ADMIN_PASSWORD);
                const newUser = new User({
                    name:process.env.ADMIN_USERNAME,
                    password:hash,
                    role:'admin'
                })
                await newUser.save();
                console.log('user saved')
            }
            console.log('running')
        }catch(err){
            console.log(err)
        }
        
    });

    const io = socketIo(server,{cors:{origin:"*"}});

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
