import express from 'express';
import {
  createInstructor,
  getInstructor,
  deleteInstructor,
  updateInstructorInfo,
  assignInstructorToCourse,
  unassignInstructorFromCourse,
  addResitExamToInstructor,
  unEnrollInstructorFromRExam,
  getInstructorCourses,
  getInstructorResitExams
} from '../hundlers/instructorHandler';

const router = express.Router();

// Instructor routes
router.post('/instructor', createInstructor);
router.get('/instructor/:id', getInstructor);
router.delete('/instructor/:id', deleteInstructor);
router.put('/instructor/:id', updateInstructorInfo);

// Instructor course management
router.post('/instructor/:id/courses/:courseId', assignInstructorToCourse);
router.delete('/instructor/:id/courses/:courseId', unassignInstructorFromCourse);
router.get('/instructor/:id/courses', getInstructorCourses);

// Instructor resit exam management
router.post('/instructor/:id/resit-exams/:resitExamId', addResitExamToInstructor);
router.delete('/instructor/:id/resit-exams/:resitExamId', unEnrollInstructorFromRExam);
router.get('/instructor/:id/resit-exams', getInstructorResitExams);

export default router; 