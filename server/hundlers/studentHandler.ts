import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Student, StudentCourseDetails } from '../types';



// create a student: id, name , email, password - secretaryId
export const createAstudent : RequestHandler= ((req: Request, res: Response) : any=> {
  const { id, name, email, password, secretaryId } = req.body;

  // Input validation
  if (!id || !name || !email || !password || !secretaryId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        id: !id,
        name: !name,
        email: !email,
        password: !password,
        secretaryId: !secretaryId
      }
    });
  }

  // // Email format validation
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!emailRegex.test(email)) {
  //   return res.status(400).json({
  //     success: false,
  //     error: 'Invalid email format'
  //   });
  // }

  // // Password strength validation
  // if (password.length < 8) {
  //   return res.status(400).json({
  //     success: false,
  //     error: 'Password must be at least 8 characters long'
  //   });
  // }

  // check if the secretary id is correct
  const secretary = db.getSecretaryById(secretaryId);
  if (!secretary) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Secretary ID'
    });
  }
  
  // check if the student id is already in the database
  const existingStudent = db.getAstudent(id);
  if (existingStudent) {
    return res.status(400).json({
      success: false,
      error: 'Student ID already exists',
      existingStudent: {
        id: existingStudent.id,
        name: existingStudent.name,
        email: existingStudent.email
      }
    });
  }

  // create a new student object
  const newStudent: Student = {
    id: id,
    name: name,
    email: email,
    password: password,
    courses: [],
    resitExams: [],
    createdBy: secretaryId,
    createdAt: new Date(),
    updatedAt: null
  }
  
  try {
    // create the student in the database
    db.createStudent(newStudent);

    // Verify the student was created by retrieving it
    const createdStudent = db.getAstudent(id);
    if (!createdStudent) {
      throw new Error('Failed to verify student creation');
    }

    // Return success response with created student info
    return res.status(201).json({
      success: true,
      message: `Student ${name} created successfully`,
      student: {
        id: createdStudent.id,
        name: createdStudent.name,
        email: createdStudent.email,
        createdAt: createdStudent.createdAt,
        createdBy: createdStudent.createdBy
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create student',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});


// get a student by id
export const getAstudent: RequestHandler<{ id: string }> = (req, res) => {
  const id = req.params.id;
  const student = db.getAstudent(id);

  if (student) {
    res.status(200).json(student);
  } else {
     res.status(404).send('Student not found');
  }
};

// delete a student by id and secretaryId
export const deleteStudent: RequestHandler<{ id: string}> = (req, res) => {
  const id = req.params.id;
  const secretaryId = req.body.secretaryId; 

  try {
    // Check if the secretary Id exists and is authorized
    const secretary = db.getSecretaryById(secretaryId);
    if (!secretary) {
      res.status(403).json({
        success: false,
        error: 'Unauthorized Secretary ID'
      });
      return;
    }

    // Check if the student Id exists
    const student = db.getAstudent(id);
    if (!student) {
      res.status(404).json({
        success: false,
        error: 'Student not found'
      });
      return;
    }

    // Delete the student and handle related data cleanup
    const status = db.deleteStudent(id, secretaryId);
    if (status) {
      res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
        deletedStudent: {
          id: student.id,
          name: student.name,
          email: student.email
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error deleting student'
      });
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting student',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// update student information
export const updateStudentInfo: RequestHandler<{ id: string }> = (req, res) => {
  const id = req.params.id;
  const secretary = req.body.secretaryId;
  const { name, email, password } = req.body;

  if (db.getSecretaryById(secretary) === undefined) {
    throw new Error("Unauthorized Secretary ID");
  }
  if( db.getAstudent(id) === undefined) {
    throw new Error("Student not found"); 
  }


  if (!name || !email || !password) {
    res.status(400).send('Missing required fields: name, email, password');
    return;
  }

  try {
    db.updateStudentInfo(id, name, email, password, secretary);
    res.status(200).send('Student information updated successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      res.status(403).send('Unauthorized to update student');
    } else {
      res.status(500).send('Error updating student information');
    }
  }
};

// add a course to a student
export const addCourseToStudent: RequestHandler = (req, res): any => {
  const { id } = req.params;
  const {courseId , secretaryId , grade , gradeLetter} = req.body;
  
  // check if the required fields are present
  if (!id || !courseId || !secretaryId) {
    res.status(400).send('Missing required fields: id, secretaryId, courseId, grade, gradeLetter');
    return;
  }
  
  // check if the courseId is correct
  if (db.getCourseById(courseId) === undefined) {
    throw new Error("Invalid Course ID or not found");
  }

  // Check if the secretary is authorized
  if (db.getSecretaryById(secretaryId) === undefined) {
    throw new Error("Unauthorized Secretary ID");
  }
  // Check if the student Id is extists
  if (db.getAstudent(id) === undefined) {
    throw new Error("Student not found");
  }
  // const sId = db.getAstudent(studentId);
  const student = db.getAstudent(id);
  const sec = db.getSecretaryById(secretaryId);


  //? department and course still not finished

  try {


    if (!courseId) {
       res.status(404).send('Course not found');
    }
    if (!student) {
      return res.status(404).send('Student not found');
    }
    if (!sec) {
      return res.status(403).send('Unauthorized Secretary ID');
    }
    //? check if the course is already in the student's courses
    if (student?.courses?.includes(courseId)) {
       res.status(400).send("Course already in student's courses");
    }
    
    // Add the course to the student's courses
    const status = db.addCourseToStudent(id, courseId , grade , gradeLetter);
    if (status) {
      return res.status(200).send('Course added to student successfully');
    } else {
      return res.status(400).send('Course already in student\'s courses');
    }

  } catch (error) {
    return res.status(500).send('Server error while adding course to student');
  }
};


// add a resit exam to a student
export const addRistExamToStudent: RequestHandler<{ id: string}> = (req, res) : any => {
  const { id } = req.params;
  const { courseId } = req.body;

  const student = db.getAstudent(id);
  // check if the studentId is correct
  if (!student) {
    throw new Error("Invalid Student ID");
  }

  if (!courseId) {
    return res.status(400).send('Missing required fields: courseId');
  }


  //! The student must be enrolled in the course for which the resit exam is intended
  //! And the resit exam must be created by the instructor of the course

  // check if the student is enrolled in the course that the resit exam is for
  const course = db.getCourseById(courseId);
  const resitExamId = course?.resitExamId;
  
  const instructor = course?.instructor;
  // instructor is a string (ID), not an object with an id property
  const instructorData = instructor ? db.getInstructorById(instructor) : undefined;
  const isInstCreatedResitExam = instructorData?.resitExams.includes(resitExamId || '');
  
  if (!isInstCreatedResitExam) { // if the resitExamId is not correct
    throw new Error("Invalid Resit Exam Id or instructor did not create the resit exam");
  }
  
  if (!student.courses.includes(courseId)) {
    throw new Error("Student not enrolled in the course");
  }
  // check if the student is already enrolled in the resit exam
  if (!resitExamId) {
    throw new Error("No resit exam found for this course");
  }
  
  if (student.resitExams.includes(resitExamId)) {
    throw new Error("Student already enrolled in the resit exam");
  }
  





  try {
    const status = db.addRistExamToStudent(id, resitExamId);
    if (status === true) {
      return res.status(200).send('Resit exam added to student successfully');
    } else if (status === false) {
      return res.status(400).send('Invalid grade letter - not allowed to take the resit exam');
    } else {
      return res.status(500).send('Error occurred while adding resit exam');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Resit exam not found') {
      res.status(404).send('Resit exam not found');
    } else {
      res.status(500).send('Error adding resit exam to student');
    }
  }
};

// remove a student from a course
export const removeStudentFromCourse: RequestHandler<{ id: string }> = (req, res) : any => {
  const {id} = req.params;
  const { secretaryId, courseId } = req.body;
  
  if (!secretaryId || !courseId) {
    return res.status(400).send('Missing required fields: secretaryId, courseId');
  }

  const student = db.getAstudent(id);
  const sec = db.getSecretaryById(secretaryId);
  const course = db.getCourseById(courseId);

  // Check if the secretary Id is extists and authorized
  if (!sec) {
    throw new Error("Unauthorized Secretary ID");
  }
  // Check if the course Id is extists | not implemented
  if (!course) {
    throw new Error("Invalid Course ID");
  } 
  // Check if the student Id is extists
  if (!student) {
    throw new Error("Invalid Student ID");
  }
  // Check if the student is enrolled in the course
  if (!db.getAstudent(id)?.courses.includes(courseId)) {
    throw new Error("Student not enrolled in the course");
  }

  try {
    db.removeStudentFromCourse(id, courseId);
    res.status(200).send('Student removed from course successfully');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Course not found') {
        res.status(404).send('Course not found');
      } else if (error.message === 'Student not found') {
        res.status(404).send('Student not found');
      } else {
        res.status(500).send('Error removing student from course');
      }
    } else {
      res.status(500).send('Error removing student from course');
    }
  }
};

// remove a student from a resit exam
export const removeStudentFromResitExam: RequestHandler<{ id: string}> = (req, res) : any => {
  const { id } = req.params;
  const { resitExamId } = req.body;
  console.log("------------------------111");
  console.log(id, resitExamId);

  // Check if the ResitExam Id is extists
  if (db.getResitExam(resitExamId) == undefined) {
    throw new Error("Invalid Resit Exam ID or not found");
  }
  // Check if the student Id is extists
  if (db.getAstudent(id) == undefined) {
    throw new Error("Invalid Student ID");
  }
  // Check if the student is enrolled in the resit exam
  if(!db.getAstudent(id)?.resitExams.includes(resitExamId)) {
    throw new Error("Student not enrolled in the resit exam");
  }

  try {
    const status = db.removeStudentFromResitExam(id, resitExamId);
    if (status) {
      res.status(200).send('Student removed from resit exam successfully');
    } else {
      res.status(400).send('Error removing student from resit exam');
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Resit exam not found') {
        res.status(404).send('Resit exam not found');
      } else if (error.message === 'Student not found') {
        res.status(404).send('Student not found');
      } else {
        res.status(500).send('Error removing student from resit exam');
      }
    } else {
      res.status(500).send('Error removing student from resit exam');
    }
  }
};

// get student's resit exams by id
// this from the student's dashboard
// /student/resitexams/
export const getStudentResitExams: RequestHandler<{ id: string }> = (req, res) : any => {
  const id = req.params.id;
  const student = db.getAstudent(id);
  const resitExams = db.getStudentResitExams(id);

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  if (resitExams) {
    res.status(200).json({resitExams});
  } else {
    res.status(404).send('Student not found or no resit exams found');
  }
};

// get student's courses by id
// this from the student's dashboard
// /student/courses/
export const getStudentCourses: RequestHandler<{ id: string }> = (req, res) : any => {
  const id = req.params.id;
  const courses = db.getStudentCourses(id);
  const student = db.getAstudent(id);

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  if (courses) {
    res.status(200).json({courses});
  } else {
    res.status(404).send('Student not found or no courses found');
  }
};

export const getStudentCourseDetails: RequestHandler<{ id: string }> = (req, res) : any => {
  try {
    const { id } = req.params;
    const courseDetails = db.getStudentCourseDetails(id);
    
    if (!courseDetails) {
      return res.status(404).json({ message: 'Student not found or has no courses' });
    }
    
    return res.status(200).json(courseDetails);
  } catch (error) {
    console.error('Error getting student course details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const getStudentResitExamResults =  (req: Request, res: Response) : any => {
  try {
    const { studentId, resitExamId } = req.params;
    
    if (!studentId || !resitExamId) {
      return res.status(400).json({ error: 'Student ID and Resit Exam ID are required' });
    }

    const results = db.getStudentResitExamResults(studentId, resitExamId);
    
    if (results) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ error: 'No results found' });
    }
  } catch (error) {
    console.error('Error in getStudentResitExamResults:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentAllResitExamResults =  (req: Request, res: Response) : any => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const results = db.getStudentAllResitExamResults(studentId);
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error in getStudentAllResitExamResults:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};