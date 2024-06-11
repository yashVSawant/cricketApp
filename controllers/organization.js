const organization = require('../models/organization');
const hashService = require('../services/bcrypt');

exports.createOrganization = async(req ,res)=>{
    try{
        const {name ,village,taluka,password} = req.body;
        const {id} = req.user;

        const hash = hashService.createHash(password);
        const newOrganization = await organization.create({
            name:name,
            representativeId:id,
            village:village,
            taluka:taluka,
            password:hash
        })
        res.status(201).json({success:true ,organization:newOrganization});
    }catch(err){
        res.status(403).json({success:false , message:err.message});
    }

}