const express=require('express');
const { candidateRequestedSlot, getCandidateRequestSlotsList, getPendingSlots } = require('../controllers/candidate');
const router=express.Router();


router.post('/candidates/requested-slot',candidateRequestedSlot);
router.get('/candidates/available-requests',getCandidateRequestSlotsList);
router.get("/candidate/pending-slots/:id?", getPendingSlots);

module.exports=router;