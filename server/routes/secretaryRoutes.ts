import express from 'express';
import { createResitExamBySecretary, getCourses, getInstructors, getResitExams, getStudents, updateResitExamBySecr } from '../hundlers/secretaryHandler';

const router = express.Router();


// get all courses
router.get('/secretary/courses', getCourses);

// get all resit exams
router.get('/secretary/resit-exams', getResitExams);

// get all students
router.get('/secretary/students', getStudents);

// get all instructors
router.get('/secretary/instructors', getInstructors);

// update a resit exam
router.put('/secretary/resit-exams/:id', updateResitExamBySecr);

// create a resit exam
router.post('/secretary/resit-exams', createResitExamBySecretary);


export default router;