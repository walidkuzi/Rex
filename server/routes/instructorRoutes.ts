import express from 'express';
import {
  createInstructor,
  getInstructor,
  deleteInstructor,
  updateInstructorInfo,
  assignInstructorToCourse,
  unassignInstructorFromCourse,
  deleteResitExam,
  getInstructorCourses,
  getInstructorResitExams,
  getInstructorCourseDetails,
  createResitExam,
  updateResitExam,
  // updateStudentResitExamGrades,
  updateAStudentResitExamResults,
  getResitExamAllResults,
  updateAllStudentsResitExamResults
} from '../hundlers/instructorHandler';

const router = express.Router();

/*
  ⚠️ IMPORTANT: DO NOT change the order of these routes.

  Express matches routes in the order they are defined.
  More specific routes (like `/instructor/:id/courses/:courseId`) must come
  BEFORE general ones (like `/instructor/:id`) to avoid incorrect handler calls.  */

// Instructor routes - Secretary
router.post('/instructor', createInstructor);
router.get('/instructor/:id', getInstructor);
router.delete('/instructor/:id', deleteInstructor);
router.put('/instructor/:id', updateInstructorInfo);

// Instructor course management - Secretary
router.post('/instructor/course/:id', assignInstructorToCourse);
router.delete('/instructor/course/:id', unassignInstructorFromCourse);

// Instructor course management - Instructor
router.get('/instructor/courses/:id', getInstructorCourses);
router.get('/instructor/c-details/:id', getInstructorCourseDetails);

// Instructor resit exam management - Instructor
router.post('/instructor/r-exam/:id', createResitExam);
router.put('/instructor/r-exam/:id', updateResitExam);
router.delete('/instructor/r-exam/:id', deleteResitExam);
router.get('/instructor/r-exams/:id', getInstructorResitExams);

// router.put('/instructor/course/:id', updateStudentResitExamGrades); // still not expermenting

// Resit exam results management
//! single student resit exam results
router.put('/instructor/course/:courseId/student/:studentId', updateAStudentResitExamResults);

//! all students resit exam results
router.put('/instructor/resit-results/all/:resitExamId', updateAllStudentsResitExamResults);

// Order matters: more specific routes first


router.get('/instructor/resit-results/exam/:resitExamId', getResitExamAllResults); // still not expermenting

export default router;
