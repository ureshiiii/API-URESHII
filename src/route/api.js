import express from 'express';
import { process } from '../controller/route-ai.js';
import { getData } from '../controller/mysql-data.js';

const router = express.Router();

router.get('/ai/:engine', process);
router.get('/data', getData); 

export default router;
