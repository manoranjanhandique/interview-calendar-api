const Candidate = require("../models/Candidate");
const Interviewer = require("../models/Interviewer");
const { validateCandidateSlot } = require("../utils/validateCandidateSlot");
const { generateInterviewerSlots } = require("../utils/generateInterviewerSlots");
const { formatTimeWithAmPm } = require("../utils/dateTimeFormate");
const { validateCandidateRequest } = require("../utils/validateCandidateRequest");

const candidateRequestedSlot=async (req,res)=>{
  
  const validationResult = validateCandidateRequest(req.body);

  if (!validationResult.isValid) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
    });
  }
  try {
    //validate slot
    const { name, requestedSlots } = req.body;
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

const getPendingSlots= async (req,res)=>{
  const { id } = req.params;

  try {
    let candidates;
    if (id) {
      // Fetch specific candidate by ID
      candidates = await Candidate.findById(id).populate('bookedSlot.interviewer', 'name');
      if (!candidates) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found.",
        });
      }
      candidates = [candidates]; // Wrap in an array for consistent processing
    } else {
      // Fetch all candidates
      candidates = await Candidate.find({});
    }

    // Fetch all interviewers
    const interviewers = await Interviewer.find({});

    const response = candidates
      .map((candidate) => {
        const pendingSlots = candidate.requestedSlots
          .filter((slot) => !slot.isAssigned) // Only unassigned slots
          .map((slot) => {
            const { day, startTime, endTime } = slot;

            // Find available interviewers for this slot
            const availableInterviewerNames = interviewers
              .filter((interviewer) => {
                // Check if interviewer has availability on the requested day and time
                const isAvailable = interviewer.availability.some((availableSlot) => {
                  return (
                    availableSlot.day === day &&
                    new Date(availableSlot.startTime).getHours() <= new Date(startTime).getHours() &&
                    new Date(availableSlot.endTime).getHours() >= new Date(endTime).getHours()
                  );
                });

                // Check if the interviewer is not booked during the requested slot
                const isNotBooked = interviewer.bookedSlots.every((booked) => {
                  return (
                    new Date(booked.endTime) <= new Date(startTime) ||
                    new Date(booked.startTime) >= new Date(endTime)
                  );
                });

                return isAvailable && isNotBooked;
              })
              .map((interviewer) => interviewer.name);

            return {
              day,
              startTime: new Date(startTime).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }),
              endTime: new Date(endTime).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }),
              availableInterviewer: availableInterviewerNames,
            };
          });

        return {
          candidate: candidate.name,
          pendingSlots,
        };
      })
      .filter((entry) => entry.pendingSlots.length > 0); // Skip candidates with no pending slots

    res.status(200).json({
      success: true,
      data: response,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching pending slots.",
      error: error.message,
    });
  }

}

module.exports = { candidateRequestedSlot, getCandidateRequestSlotsList, getPendingSlots };
