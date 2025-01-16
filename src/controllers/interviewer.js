const Interviewer = require("../models/Interviewer");
const { generateInterviewerSlots } = require("../utils/generateInterviewerSlots");

const interviewer=async (req,res)=>{
    const { name, availability } = req.body;
   try {
    const newInterviewer = new Interviewer({
        name,
        availability
      });
  
      // Save the interviewer to the database
      await newInterviewer.save();
  
      res.status(201).json({
        message: 'Interviewer added successfully',
        interviewer: newInterviewer
      });
    
   } catch (error) {
        res.status(500).json({ error: error.message });
   }

}
const availability=async (req,res)=>{
  try {
    const availableInterviewer = await Interviewer.find();
    for (let interviewer of availableInterviewer) {
      const availableSlots = await generateInterviewerSlots(interviewer._id)
      // const hourlySlots = generateHourlySlots(
      //   interviewer.startTime,
      //   interviewer.endTime
      // );
      res.json(availableSlots);
      // console.log(name)
    }
    res.json('availableInterviewer');
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports={interviewer,availability}