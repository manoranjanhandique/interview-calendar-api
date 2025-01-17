const Interviewer = require("../models/Interviewer");
const { generateHourlySlots } = require("./generateHourlySlots");

const generateInterviewerSlots = async (interviewerId) => {
    const interviewer = await Interviewer.findById(interviewerId);
    
    if (!interviewer) {
        throw new Error('Interviewer not found');
    }

    const allSlots = [];

    for (const availability of interviewer.availability) {
        const { day, startTime, endTime } = availability;

        const hourlySlots = generateHourlySlots(startTime, endTime);
        
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