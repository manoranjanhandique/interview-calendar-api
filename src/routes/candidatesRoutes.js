const express=require('express');
const { candidate, candidateRequestedSlot, getCandidateRequestSlotsList } = require('../controllers/candidate');
const router=express.Router();

router.post('/candidates',candidate);
router.post('/candidates/requested-slot',candidateRequestedSlot);
router.get('/candidates/available-requests',getCandidateRequestSlotsList);

module.exports=router;