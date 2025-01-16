const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    requestedSlots: [
      {
        day: {
          type: String,
          required: true,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        isAssigned: { type: Boolean, default: false },
      },
    ],
    bookedSlot: [{
      interviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interviewer",
      },
      day: String,
      startTime: Date,
      endTime: Date,
    },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Candidate', candidateSchema);
