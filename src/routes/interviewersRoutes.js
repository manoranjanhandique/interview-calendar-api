const express=require('express');
const { interviewer, availability } = require('../controllers/interviewer');
const router=express.Router();

router.post('/interviewers',interviewer);
router.get('/interviewers/availability',availability)

module.exports=router;