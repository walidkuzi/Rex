import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Secretary } from '../types';





// get all courses
export const getCourses: RequestHandler = (req, res) : any => {

  // get the courses
  const courses = db.getCourses();
  res.json(courses);
};


// get all resit exams
export const getResitExams: RequestHandler = (req, res) : any => {

  // get the resit exams
  const resitExams = db.getResitExams();
  res.json(resitExams);
};

// get all students
export const getStudents: RequestHandler = (req, res) : any => {

  // get the students
  const students = db.getStudents();
  res.json(students);
};


// get all instructors
export const getInstructors: RequestHandler = (req, res) : any => {

  // get the instructors
  const instructors = db.getInstructors();
  res.json(instructors);
};

// update a resit exam
export const updateResitExamBySecr: RequestHandler = (req, res) : any => {
  const { id } = req.params; // secretary id
  const { 
    courseId,
    lettersAllowed,
    examDate,
    deadline,
    location
  } = req.body;

  // Validate required fields
  if (!courseId || !lettersAllowed || !examDate || !deadline || !location) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        courseId: !courseId,
        lettersAllowed: !lettersAllowed,
        examDate: !examDate,
        deadline: !deadline,
        location: !location,
      }
    });
  }

  try {
    // Validate instructor exists
    const instructor = db.getSecretaryById(id);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found'
      });
    }

    // Get the course to extract resitExamId and other details
    const course = db.getCourseById(courseId);
    if (!course || !course.resitExamId) {
      return res.status(400).json({
        success: false,
        error: 'Course not found or does not have a resit exam ID'
      });
    }

    // get the resit exam id from the course

    const resitExamId = course.resitExamId;

    // Update the resit exam
    db.updateResitExamBySecretary(
      resitExamId,
      examDate,
      deadline,
      location
    );

    // Get the updated resit exam
    const updatedResitExam = db.getResitExam(resitExamId);
    if (!updatedResitExam) {
      throw new Error('Failed to update resit exam');
    }

    return res.status(200).json({
      success: true,
      message: 'Resit exam updated successfully',
      resitExam: {
        id: updatedResitExam.id,
        name: updatedResitExam.name,
        courseId: updatedResitExam.courseId,
        department: updatedResitExam.department,
        examDate: updatedResitExam.examDate,
        deadline: updatedResitExam.deadline,
        location: updatedResitExam.location
      }
    });
  } catch (error) {
    console.error('Error updating resit exam:', error);
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      } else if (error.message.includes('already taken')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }
    }
    return res.status(500).json({
      success: false,
      error: 'Error updating resit exam',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


// create a resit exam
export const createResitExamBySecretary: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params; // secretary id
  const { 
    courseId,
    examDate,
    deadline,
    location
  } = req.body;

  const secr_id = id;

  // Validate required fields
  if (!courseId  || !examDate || !deadline || !location) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        courseId: !courseId,
        examDate: !examDate,
        deadline: !deadline,
        location: !location,
      }
    });
  }

  

  try {
    // Validate instructor exists
    const instructor = db.getInstructorById(id);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found'
      });
    }

    // Validate instructor is assigned to the course
    if (!instructor.courses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        error: 'Instructor not assigned to this course'
      });
    }

    // Get the course to extract resitExamId
    const course = db.getCourseById(courseId);
    if (!course || !course.resitExamId) {
      return res.status(400).json({
        success: false,
        error: 'Course not found or does not have a resit exam ID'
      });
    }

    // get the name and department from the course that the resit exam is for
    const name = course?.name;
    const department = course?.department;


    // get the resitExamId from the course to use it as the id for the resit exam
    //! so every course has a resit exam id we will use it as the id for the resit exam
    const resitExamId = course?.resitExamId;

    // Create the resit exam using the resitExamId from the course
    db.createResitExamBySecretary(
      secr_id,
      resitExamId,
      courseId,
      examDate,
      deadline,
      location
    );

    // Get the created resit exam using the resitExamId from the course
    const createdResitExam = db.getResitExam(course.resitExamId);
    if (!createdResitExam) {
      throw new Error('Failed to create resit exam');
    }

    return res.status(201).json({
      success: true,
      message: 'Resit exam created successfully',
      resitExam: {
        id: createdResitExam.id,
        name: createdResitExam.name,
        courseId: createdResitExam.courseId,
        department: createdResitExam.department,
        examDate: createdResitExam.examDate,
        deadline: createdResitExam.deadline,
        location: createdResitExam.location
      }
    });
  } catch (error) {
    console.error('Error creating resit exam:', error);
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      } else if (error.message.includes('already taken')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }
    }
    return res.status(500).json({
      success: false,
      error: 'Error creating resit exam',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};