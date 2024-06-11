const tournament = require('../models/tournament');

exports.ongoingTournaments = async(res,req)=>{
    try {
        let today = new Date();
        const info = await tournament.findAll({
            where: {
                startDate: {
                    [Op.lte]: today
                },
                endDate: {
                    [Op.gte]: today
                }
            }
        })

        res.stats(200).json({success:ture , info})
    } catch (err) {
        res.stats(401).json({success:false , message:err.message})
    }
}