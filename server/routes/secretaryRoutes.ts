import express from 'express';
import { getCourses, getInstructors, getResitExams, getStudents } from '../hundlers/secretaryHandler';

const router = express.Router();


// get all courses
router.get('/secretary/courses', getCourses);

// get all resit exams
router.get('/secretary/resit-exams', getResitExams);

// get all students
router.get('/secretary/students', getStudents);

// get all instructors
router.get('/secretary/instructors', getInstructors);

export default router;