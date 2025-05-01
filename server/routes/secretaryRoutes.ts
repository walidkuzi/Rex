import express from 'express';
import { getCourses, getResitExams } from '../hundlers/secretaryHandler';

const router = express.Router();


// get all courses
router.get('/secretary/courses', getCourses);

// get all resit exams
router.get('/secretary/resit-exams', getResitExams);

export default router;