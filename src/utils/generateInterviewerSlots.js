const Interviewer = require("../models/Interviewer");
const { generateHourlySlots } = require("./generateHourlySlots");

const generateInterviewerSlots = async (interviewerId) => {
    // Fetch the interviewer by ID (you may want to include a check here)
    const interviewer = await Interviewer.findById(interviewerId);
    
    if (!interviewer) {
        throw new Error('Interviewer not found');
    }

    const allSlots = [];

    // Iterate through the availability array for the interviewer
    for (const availability of interviewer.availability) {
        const { day, startTime, endTime } = availability;

        // Generate 1-hour slots for each available period
        const hourlySlots = generateHourlySlots(startTime, endTime);
        
        // Attach the day to the slots and push to the allSlots array
        hourlySlots.forEach(slot => {
            allSlots.push({
                day,
                startTime: slot.startTime,
                endTime: slot.endTime,
                interviewerId: interviewer._id,
            });
        });
    }

    return allSlots;
};
module.exports={generateInterviewerSlots}