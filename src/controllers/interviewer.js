const Candidate = require("../models/Candidate");
const Interviewer = require("../models/Interviewer");
const {generateInterviewerSlots} = require("../utils/generateInterviewerSlots");
const { formatTimeWithAmPm } = require("../utils/dateTimeFormate");
const { validateInterviewerAvailability } = require("../utils/validateCandidateRequest");

const interviewer = async (req, res) => {
  const validationResult = validateInterviewerAvailability(req.body);

  if (!validationResult.isValid) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
    });
  }
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

const availability = async (req, res) => {
  try {
    const availableInterviewer = await Interviewer.find();
    for (let interviewer of availableInterviewer) {
      const availableSlots = await generateInterviewerSlots(interviewer._id);
      // const hourlySlots = generateHourlySlots(
      //   interviewer.startTime,
      //   interviewer.endTime
      // );
      res.json(availableSlots);
      // console.log(name)
    }
    res.json("availableInterviewer");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignInterviewerToCandidate = async (req, res) => {
  const { candidateId, interviewerId } = req.body;
  if(!candidateId || !interviewerId){
    return res.status(404).json({
      success: false,
      message: "Please provide candidateId or interviewerId!",
    });
  }
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

module.exports = { interviewer, availability, assignInterviewerToCandidate };
