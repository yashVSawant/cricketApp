const bcrypt = require('bcrypt');
const salt = 10;
const ApiError = require('../utils/ApiErrors')
exports.createHash = (password)=>{
    return new Promise((res,rej) =>{
        bcrypt.hash(password ,salt ,async(err , hash)=>{
        if(!err){  
            res(hash);
        }else{
            rej();
        }
    })})
}

exports.compareHash = (password ,hash)=>{
    return new Promise((res,rej)=>{
        bcrypt.compare(password ,hash ,(err ,result)=>{
            if(err){
                rej(err.message);
            }
            if(result){
                res('success');
            }else{
                rej(new ApiError('incorrect password!',401));
            }
        })
        
    })
}