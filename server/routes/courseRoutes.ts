import express from 'express';
import {
  getCourseStudents,
  getCourseStatistics,
  updateCourse,
  getCourseInstructor,
  createCourse,
  deleteCourse,
  getCourse
} from '../hundlers/courseHandler';

const router = express.Router();

// Course CRUD operations
router.post('/course', createCourse);
router.get('/course/:id', getCourse);
router.put('/course/:id', updateCourse);
router.delete('/course/:id', deleteCourse);

// Course relationships and statistics
router.get('/course/students/:id', getCourseStudents);
router.get('/course/instructor/:id', getCourseInstructor);
router.get('/course/statistics/:id', getCourseStatistics);

export default router; 