const Candidate = require("../models/Candidate");
const Interviewer = require("../models/Interviewer");
const { validateCandidateSlot } = require("../utils/validateCandidateSlot");
const { generateInterviewerSlots } = require("../utils/generateInterviewerSlots");
const { formatTimeWithAmPm } = require("../utils/dateTimeFormate");

const candidateRequestedSlot=async (req,res)=>{
  const { name, requestedSlots } = req.body;
  try {
    //validate slot
    const isValid = validateCandidateSlot(requestedSlots);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid slot duration or alignment. Ensure slots are exactly 1 hour and start at the top of the hour. E.g: 9am - 10am",
      });
    }
      const existingCandidateBooking = await Candidate.findOne({
        name,
      });
      //check from db time
      if (existingCandidateBooking) {
        const day=existingCandidateBooking.requestedSlots[0].day
        const start = new Date(existingCandidateBooking.requestedSlots[0].startTime);
        const end = new Date(existingCandidateBooking.requestedSlots[0].endTime);
        return res.status(400).json({
          success: false,
          message: `You have already booked a slot on ${day} from ${formatTimeWithAmPm(start)} to ${formatTimeWithAmPm(end)}.`,
        });
      }
    const candidate = new Candidate({ name, requestedSlots });
    await candidate.save();

    res.status(201).json({
      success: true,
      message: "Requested slots saved successfully.",
      candidate,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while saving requested slots.',
      error: error.message,
  });
    
  }
}


const getCandidateRequestSlotsList=async (req,res)=>{
  try {
    const candidates = await Candidate.find({ 
      requestedSlots: { $exists: true, $not: { $size: 0 } } // Ensure candidates have requested slots
  });

  if (!candidates || candidates.length === 0) {
      return res.status(404).json({
          success: false,
          message: 'No candidates with requested slots found.',
      });
  }

  res.status(200).json({
      success: true,
      message: 'List of candidates with requested slots retrieved successfully.',
      candidates,
  });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching candidates.',
      error: error.message,
  });
    
  }

}
const candidate = async (req, res) => {
  try {
    const { name, requestedSlots } = req.body;

    //validate slot
    const isValid = validateCandidateSlot(requestedSlots);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid slot duration or alignment. Ensure slots are exactly 1 hour and start at the top of the hour. E.g: 9am - 10am",
      });
    }

    for (let slot of requestedSlots) {
      const { day, startTime, endTime } = slot;
      const start = new Date(startTime);
      const end = new Date(endTime);

      const existingCandidateBooking = await Candidate.findOne({
        name
      });
      //check from db time
      if (existingCandidateBooking) {
        return res.status(400).json({
          success: false,
          message: `You have already booked a slot on ${day} from ${formatTimeWithAmPm(start)} to ${formatTimeWithAmPm(end)}.`,
        });
      }

      const availableInterviewer = await Interviewer.find({
        "availability.day": day,
        "availability.startTime": { $lte: start },
        "availability.endTime": { $gte: end },
      });

      let assignedInterviewer = null;
      for (const interviewer of availableInterviewer) {
        const availableSlots = await generateInterviewerSlots(interviewer._id);
        for (const availableSlot of availableSlots) {
          if (
            availableSlot.day === day &&
            new Date(availableSlot.startTime).getHours() === start.getHours() &&
            new Date(availableSlot.endTime).getHours() === end.getHours()
          ) {
            // Check if the slot is not booked
            const isBooked = interviewer.bookedSlots.some(
              (booked) =>
                new Date(booked.startTime) < end &&
                new Date(booked.endTime) > start
            );
            if (!isBooked) {
              // Assign the slot to the candidate
              assignedInterviewer = interviewer;

              const candidate = new Candidate({
                name,
                requestedSlots,
                bookedSlot: {
                  interviewer: assignedInterviewer._id,
                  day,
                  startTime: start,
                  endTime: end,
                },
              });

              const bookCandidateSlot = await candidate.save();

              interviewer.bookedSlots.push({
                candidate: bookCandidateSlot._id,
                day,
                startTime: start,
                endTime: end,
              });

              await interviewer.save();
              break;
            }
          }
        }
        if (assignedInterviewer) break; // Stop checking other interviewers if slot is found
      }

      if (!assignedInterviewer) {
        return res.status(400).json({
          success: false,
          message: `No available interviewers for the requested slot on ${day} from ${formatTimeWithAmPm(start)} to ${formatTimeWithAmPm(end)}.`,
        });
      }
      return res.status(201).json({
        success: true,
        message: "Slot booked successfully",
        // assignedInterviewer: assignedInterviewer.name,
        bookedSlot: { day, from:formatTimeWithAmPm(start), to:formatTimeWithAmPm(end) },
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { candidate, candidateRequestedSlot, getCandidateRequestSlotsList };
