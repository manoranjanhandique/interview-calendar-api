const mongoose=require("mongoose");

const interviewerSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    availability:[
        {
            day:{
                type:String,
                enum:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            },
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true },
        }
    ],
    bookedSlots: [
        {
            candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
            day: { type: String },
            startTime: {
                type: Date,
            },
            endTime: {
                type: Date,
            },
        },
    ],
},{
    timestamps:true,
})

module.exports = mongoose.model('Interviewer', interviewerSchema);