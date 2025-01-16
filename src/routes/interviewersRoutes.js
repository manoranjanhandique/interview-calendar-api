const express=require('express');
const { interviewer, availability, assignInterviewerToCandidate } = require('../controllers/interviewer');
const router=express.Router();

router.post('/interviewers',interviewer);
router.get('/interviewers/availability',availability)
router.post('/assign-interviewer',assignInterviewerToCandidate);

module.exports=router;