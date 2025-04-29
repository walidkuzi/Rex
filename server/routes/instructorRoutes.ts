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
  getInstructorResitExams,
  getInstructorCourseDetails
} from '../hundlers/instructorHandler';

const router = express.Router();

/*
  ⚠️ IMPORTANT: DO NOT change the order of these routes.

  Express matches routes in the order they are defined.
  More specific routes (like `/instructor/:id/courses/:courseId`) must come
  BEFORE general ones (like `/instructor/:id`) to avoid incorrect handler calls.  */

// Instructor routes
router.post('/instructor', createInstructor);
router.put('/instructor/:id', updateInstructorInfo);
router.delete('/instructor/:id', deleteInstructor);
router.get('/instructor/:id', getInstructor);

// Instructor course management
router.post('/instructor/course/:id', assignInstructorToCourse);
router.delete('/instructor/course/:id', unassignInstructorFromCourse);
router.get('/instructor/courses/:id', getInstructorCourses);
router.get('/instructor/course-details/:id', getInstructorCourseDetails);

// Instructor resit exam management
router.post('/instructor/:id/resit-exams/:resitExamId', addResitExamToInstructor);
router.delete('/instructor/:id/resit-exams/:resitExamId', unEnrollInstructorFromRExam);
router.get('/instructor/resitexams/:id', getInstructorResitExams);

export default router;
