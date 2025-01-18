const express=require('express');
const { interviewer, getInterviewerAvailability , assignInterviewerToCandidate, getBookedSlots } = require('../controllers/interviewer');
const router=express.Router();

router.post('/interviewers',interviewer);
router.get('/interviewers/availability/:id?',getInterviewerAvailability );
router.post('/assign-interviewer',assignInterviewerToCandidate);
router.get('/interview/booked-slots/:id?', getBookedSlots)

module.exports=router;