const errorHandler = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500;
    error.success = error.success || false;
    error.message = error.message || 'something went wrong!';
    res.status(error.statusCode).json({success:error.success , message:error.message });
}

module.exports = {errorHandler};