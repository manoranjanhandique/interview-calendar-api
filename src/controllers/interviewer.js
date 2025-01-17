const Candidate = require("../models/Candidate");
const Interviewer = require("../models/Interviewer");
const {
  generateInterviewerSlots,
} = require("../utils/generateInterviewerSlots");
const { formatTimeWithAmPm } = require("../utils/dateTimeFormate");

const interviewer = async (req, res) => {
  const { name, availability } = req.body;
  try {
    const newInterviewer = new Interviewer({
      name,
      availability,
    });

    // Save the interviewer to the database
    await newInterviewer.save();

    res.status(201).json({
      message: "Interviewer added successfully",
      interviewer: newInterviewer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getInterviewerAvailability  = async (req, res) => {
  const { id } = req.params;
  try {
    const query = id ? { _id: id } : {}; // If ID is provided, query specific interviewer
    const interviewers = await Interviewer.find(query);

    if (id && interviewers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found.",
      });
    }

    const response = interviewers.map((interviewer) => {
      const slot = interviewer.availability.map((availableSlot) => {
        const { day, startTime, endTime } = availableSlot;

        // Generate free slots (1-hour intervals)
        const freeSlots = [];
        let currentTime = new Date(startTime);
        const endTimeLimit = new Date(endTime);

        // Collect booked slots for the day
        const bookedSlots = interviewer.bookedSlots
          .filter((bookedSlot) => bookedSlot.day === day)
          .map((bookedSlot) => {
            return {
              start: new Date(bookedSlot.startTime),
              end: new Date(bookedSlot.endTime),
            };
          });

        // Check each hour against booked slots and add only available hours to freeSlots
        while (currentTime < endTimeLimit) {
          const nextHour = new Date(currentTime);
          nextHour.setHours(currentTime.getHours() + 1);

          const isBooked = bookedSlots.some(
            (booked) =>
              booked.start < nextHour && booked.end > currentTime // Check for overlap
          );

          if (!isBooked) {
            freeSlots.push(
              `${currentTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} - ${nextHour.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
            );
          }

          currentTime = nextHour;
        }

        // Format booked slots as readable strings
        const bookedSlotsFormatted = bookedSlots.map((booked) => {
          return `${booked.start.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })} - ${booked.end.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}`;
        });

        return {
          day,
          freeSlots,
          bookedSlots: bookedSlotsFormatted,
        };
      });

      return {
        interviewer: interviewer.name,
        slot,
      };
    });

    res.status(200).json({
      success: true,
      data: response,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching interviewer availability.",
      error: error.message,
    });
  }
};

const assignInterviewerToCandidate = async (req, res) => {
  const { candidateId, interviewerId } = req.body;
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }
    // Ensure the candidate has at least one requested slot
    if (!candidate.requestedSlots || candidate.requestedSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Candidate has no requested slots to assign.",
      });
    }

    const requestedSlot = candidate.requestedSlots.find(
      (slot) => !slot.isAssigned
    );
    if (!requestedSlot) {
      return res.status(400).json({
        success: false,
        message: "No unassigned requested slots available for the candidate.",
      });
    }

    const { day, startTime, endTime } = requestedSlot;

    // Validate that the interviewer exists
    const interviewer = await Interviewer.findById(interviewerId);
    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found.",
      });
    }

    const availableSlots = await generateInterviewerSlots(interviewer._id);
    const isAvailable = availableSlots.some(
      (slot) =>
        slot.day === day &&
        new Date(slot.startTime).getHours() <= new Date(startTime).getHours() &&
        new Date(slot.endTime).getHours() >= new Date(endTime).getHours()
    );
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: `Interviewer ${interviewer.name} is not available for the requested slot.`,
      });
    }
    // Check if the slot is not booked
    const isBooked = interviewer.bookedSlots.some(
      (booked) =>
        new Date(booked.startTime) < new Date(endTime) &&
        new Date(booked.endTime) > new Date(startTime)
    );

    if (isBooked) {
      return res.status(400).json({
        success: false,
        message: `${
          interviewer.name
        } is not available for the requested slot on ${day} from ${formatTimeWithAmPm(
          startTime
        )} to ${formatTimeWithAmPm(endTime)}..`,
      });
    }
    requestedSlot.isAssigned = true;
    // Add the booked slot to the candidate's bookedSlots
    candidate.bookedSlot.push({
      interviewer: interviewerId,
      day,
      startTime,
      endTime,
    });

    interviewer.bookedSlots.push({
      candidate: candidateId,
      day,
      startTime,
      endTime,
    });

    await candidate.save();
    await interviewer.save();

    res.status(200).json({
      success: true,
      message: "Interviewer assigned to the candidate successfully.",
      data: {
        candidate: candidate.name,
        interviewer: interviewer.name,
        bookedSlot: {
          day,
          startTime,
          endTime,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while assigning the interviewer.",
      error: error.message,
    });
  }
};

const getBookedSlots=async (req,res)=>{
  const { id } = req.params;
  try {
    let interviewers;
    if (id) {
      // Find a specific interviewer by ID
      interviewers = await Interviewer.findById(id).populate('bookedSlots.candidate', 'name');
      if (!interviewers) {
        return res.status(404).json({
          success: false,
          message: "Interviewer not found.",
        });
      }
      interviewers = [interviewers]; // Wrap in an array for consistent processing
    } else {
      // Fetch all interviewers and populate candidate names
      interviewers = await Interviewer.find({}).populate('bookedSlots.candidate', 'name');
    }

    const response = interviewers.map((interviewer) => ({
      interviewer: interviewer.name,
      bookedSlots: interviewer.bookedSlots.map((slot) => ({
        candidate: slot.candidate ? slot.candidate.name : "Unknown",
        day: slot.day,
        startTime: new Date(slot.startTime).toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }),
        endTime: new Date(slot.endTime).toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }),
      })),
    }));

    return res.status(200).json({
      success: true,
      data: response,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching booked slots.",
      error: error.message,
    });
    
  }
}

module.exports = { interviewer, getInterviewerAvailability , assignInterviewerToCandidate, getBookedSlots };
