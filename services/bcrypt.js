const bcrypt = require('bcrypt');
let salt = 10;
exports.createHash = (password)=>{
    return new Promise((res,rej) =>{
        bcrypt.hash(password ,salt ,async(err , hash)=>{
        if(!err){  
            res(hash);
        }else{
            rej('something went wrong');
        }
    })})
}

exports.compareHash = (password ,hash)=>{
    return new Promise((res,rej)=>{
        bcrypt.compare(password ,checkUser.password ,(err ,result)=>{
            if(err){
                rej(err.message);
            }
            if(result){
                res('success');
            }else{
                rej("incorrect password !");
            }
        })
        
    })
}