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
router.post('/', createAstudent);

// Get a student by ID
router.get('/:id', getAstudent);

// Delete a student by ID
router.delete('/:id', deleteStudent);

// Update student information
router.put('/:id', updateStudentInfo);

// Add a course to a student
router.post('/:studentId/courses/:courseId', addCourseToStudent);

// Add a resit exam to a student
router.post('/:studentId/resit-exams/:resitExamId', addRistExamToStudent);

// Remove a student from a course
router.delete('/:studentId/courses/:courseId', removeStudentFromCourse);

// Remove a student from a resit exam
router.delete('/:studentId/resit-exams/:resitExamId', removeStudentFromResitExam);

// Get student's resit exams by ID
router.get('/:id/resit-exams', getStudentResitExams);

// Get student's courses by ID
router.get('/:id/courses', getStudentCourses);

export default router;
