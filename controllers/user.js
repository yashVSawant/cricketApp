
const user = require('../models/user');
const Live = require('../models/live');
const userData = require('../models/userData');
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

const s3Services = require('../services/s3Services');

exports.batterLeaderboard = asyncErrorHandler(async(req,res)=>{
        const top5 =  await userData.find({})
        .populate({
            path: 'userId',
            select: 'name' 
        })
        .sort({ runs: -1 }) 
        .limit(5) 
        .select('runs userId') 
        .exec();
        res.status(200).json({succcess:true ,top5});
})
exports.bowlerLeaderboard = asyncErrorHandler(async(req,res)=>{
    const top5 =  await userData.find({})
    .populate({
        path: 'userId',
        select: 'name' 
    })
    .sort({ wickets: -1 }) 
    .limit(5) 
    .select('wickets userId') 
    .exec();
    res.status(200).json({succcess:true ,top5});
})

exports.getUserData = asyncErrorHandler(async(req,res)=>{
        const data = await userData.findOne({userId:req.user.id});
        res.status(200).json({succcess:true ,data ,name:req.user.name ,role:req.user.role});
})

exports.updateBattingData = asyncErrorHandler(async(req,res)=>{
        const {userId} = req.body;
        const {id} = req.param
        if(isNullValue(id))throw new ApiError('invalid input!' ,400)
        const liveData = await Live.findOne({match:id});
        if(!liveData)throw new ApiError('not live!',400)
            const data = await userData.findOne({userId:userId});
            let highestScore = data.highestScore;
            if((+getLiveData.runs) > data.highestScore)highestScore = +getLiveData.runs
            await data.update({
                runs :data.runs + +getLiveData.runs,
                sixes :data.sixes + +getLiveData.sixes,
                fours:data.fours + +getLiveData.fours,
                balls:data.balls + +getLiveData.balls,
            })
            res.status(200).json({succcess:true });
})
exports.updateBowlingData = asyncErrorHandler(async(req,res)=>{
        const {id} = req.body;
        if(isNullValue(id))throw new ApiError('invalid input!' ,400)
        const getLiveData = await bowlerLiveData.findOne({where:{userId:id}});
        if(!getLiveData)throw new ApiError('user is not playing currently!',400)
            const data = await userData.findOne({
                where:{userId:id}
            });
            let highestWickets = data.highestWickets;
            if((+getLiveData.wickets) > data.highestWickets)highestWickets = +getLiveData.wickets
            await data.update({
                wickets :data.wickets + +getLiveData.wickets,
                overs :data.overs + +getLiveData.overs,
                highestWickets: highestWickets
            })
            res.status(200).json({succcess:true });
})
exports.postPhoto = asyncErrorHandler(async(req,res)=>{
        const {_id} = req.user;
        const getfile = req.file;
        if(isNullValue(_id))throw new ApiError('invalid input!' ,400)
        const filename = `profilePhotos/${_id}.jpg`;
        const imageUrl = await s3Services.uploadToS3(getfile,filename);
        // console.log(fileUrl);
        await userData.findOneAndUpdate({userId:_id},{imageUrl:imageUrl},)
        res.status(201).json({success:true,imageUrl:imageUrl});
   
})

function isNullValue(value){
    return value === ""?true :false;
}
