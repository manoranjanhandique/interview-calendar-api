const errorHandler=(err,req,res,next)=>{
    console.log(`Error name : ${err.name} - Error Code ${err.code}`);

    err.message=err.message || "Internel Server Error";
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
}

module.exports=errorHandler