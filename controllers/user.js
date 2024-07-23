
const user = require('../models/user');
const userData = require('../models/userData');
const batterLiveData = require('../models/batterLiveData');
const bowlerLiveData = require('../models/bowlerLiveData');
const ApiError = require('../utils/ApiErrors');
const {asyncErrorHandler} = require('../utils/asyncErrorHandler');

const s3Services = require('../services/s3Services');

exports.batterLeaderboard = asyncErrorHandler(async(req,res)=>{
        const top5 = await userData.findAll({
            attributes: ['runs'],
            include: [
              {
                model: user,
                attributes: ['name'],
                
              }
            ],
            order: [['runs', 'DESC']],
            limit: 5
          });
        res.status(200).json({succcess:true ,top5});
})
exports.bowlerLeaderboard = asyncErrorHandler(async(req,res)=>{
        const top5 = await userData.findAll({
            attributes: ['wickets'],
            include: [
              {
                model: user,
                attributes: ['name'],
                
              }
            ],
            order: [['wickets', 'DESC']],
            limit: 5
          });
        res.status(200).json({succcess:true ,top5});
})

exports.getUserData = asyncErrorHandler(async(req,res)=>{
        const data = await userData.findOne({
            where:{userId:req.user.id}
        });
        res.status(200).json({succcess:true ,data ,name:req.user.name});
})

exports.updateBattingData = asyncErrorHandler(async(req,res)=>{
        const {id} = req.body;
        if(isNullValue(id))throw new ApiError('invalid input!' ,400)
        const getLiveData = await batterLiveData.findOne({where:{userId:id}});
        if(!getLiveData)throw new ApiError('user is not playing currently!',400)
            const data = await userData.findOne({
                where:{userId:id}
            });
            let highestScore = data.highestScore;
            if((+getLiveData.runs) > data.highestScore)highestScore = +getLiveData.runs
            await data.update({
                runs :data.runs + +getLiveData.runs,
                sixes :data.sixes + +getLiveData.sixes,
                fours:data.fours + +getLiveData.fours,
                balls:data.balls + +getLiveData.balls,
                highestScore:highestScore
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
        const {id} = req.user;
        const getfile = req.file;
        if(isNullValue(id))throw new ApiError('invalid input!' ,400)
        const filename = `profilePhotos/${id}.jpg`;
        const imageUrl = await s3Services.uploadToS3(getfile,filename);
        // console.log(fileUrl);
        await userData.update({imageUrl:imageUrl},{where:{userId:id}});
        res.status(201).json({success:true,imageUrl:imageUrl});
   
})

function isNullValue(value){
    return value === ""?true :false;
}
