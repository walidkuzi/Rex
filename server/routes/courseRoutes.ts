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
router.get('/course/:id/students', getCourseStudents);
router.get('/course/:id/instructor', getCourseInstructor);
router.get('/course/:id/statistics', getCourseStatistics);

export default router; 