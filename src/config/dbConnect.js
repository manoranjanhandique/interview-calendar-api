const mongoose=require("mongoose");
const MONGODB_URL=process.env.MONGODB_URI;

const connectDB=async()=>{
    await mongoose.connect(MONGODB_URL)
}

module.exports=connectDB;