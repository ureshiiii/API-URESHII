const express = require('express');
const router = express.Router();
const aiController = require('../controller/api-ai'); 
const dataController = require('../controller/mysql-data');

router.get('/ai/:engine', aiController.process);
router.get('/data', dataController.getData); 

module.exports = router;
