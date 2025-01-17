const express=require('express');
const { candidateRequestedSlot, getCandidateRequestSlotsList } = require('../controllers/candidate');
const router=express.Router();

router.post('/candidates/requested-slot',candidateRequestedSlot);
router.get('/candidates/available-requests',getCandidateRequestSlotsList);

module.exports=router;