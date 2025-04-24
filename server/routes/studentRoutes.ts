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
  getStudentCourses 
} from '../hundlers/studentHandler';

const router = Router();

// Create a new student
router.post('/student/', createAstudent);

// Get a student by ID
router.get('/student/:id', getAstudent);

// Delete a student by ID
router.delete('/student/:id', deleteStudent);

// Update student information
router.put('/student/:id', updateStudentInfo);

// Add a course to a student
router.post('/student/:studentId/courses/:courseId', addCourseToStudent);

// Add a resit exam to a student
router.post('/student/:studentId/resit-exams/:resitExamId', addRistExamToStudent);

// Remove a student from a course
router.delete('/student/:studentId/courses/:courseId', removeStudentFromCourse);

// Remove a student from a resit exam
router.delete('/student/:studentId/resit-exams/:resitExamId', removeStudentFromResitExam);

// Get student's resit exams by ID
router.get('/student/:id/resit-exams', getStudentResitExams);

// Get student's courses by ID
router.get('/student/:id/courses', getStudentCourses);


// Student routes

// Student course management

// Student resit exam management

export default router;
