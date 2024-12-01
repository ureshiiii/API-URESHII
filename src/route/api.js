const express = require('express');
const router = express.Router();
const geminiController = require('../controller/gemini');
const dataController = require('../controller/mysql-data');

router.get('/gemini', geminiController.gemini);
router.get('/data', dataController.getData); 

module.exports = router;