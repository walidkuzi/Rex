import { Router } from 'express';
import { 
  createAstudent, 
  getAstudent, 
  deleteStudent, 
  updateStudentInfo, 
  addCourseToStudent, 
  addRistExamToStudent, 
  removeStudentFromCourse, 
  removeStudentFromResitExam, 
  getStudentResitExams, 
  getStudentCourses,
  getStudentCourseDetails 
} from '../hundlers/studentHandler';

const router = Router();



/* IMPORTANT: DO NOT change the order of these routes.

Express matches routes from top to bottom. If a general route like `/student/:id`
comes before a more specific route like `/student/resit-exam-remove/:id`,
it will incorrectly capture those requests, leading to unexpected handler calls. */


// Create a new student
router.post('/student/', createAstudent);

// Remove a student from a resit exam
router.delete('/student/resit-exam-remove/:id', removeStudentFromResitExam);

// Add a resit exam to a student
router.post('/student/resit-exam/:id', addRistExamToStudent);

// Get student's resit exams by ID
router.get('/student/resitexams/:id', getStudentResitExams);

// Get student's courses by ID
router.get('/student/courses/:id', getStudentCourses);

// Get student's courses details with grades 
router.get('/student/details/:id', getStudentCourseDetails);

// Delete a student by ID
router.delete('/student/:id/:secretaryId', deleteStudent);

// Update student information
router.put('/student/:id/:secretaryId', updateStudentInfo);

// Add a course to a student
router.post('/student/:id', addCourseToStudent);

// Get a student by ID
router.get('/student/:id', getAstudent);

// Remove a student from a course
router.delete('/student-course/:id', removeStudentFromCourse);




export default router;
