const express=require('express');
const { candidate } = require('../controllers/candidate');
const router=express.Router();

router.post('/candidates',candidate);

module.exports=router;