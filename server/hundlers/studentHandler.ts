import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Student } from '../types';



// create a student: id, name , email, password - secretaryId
export const createAstudent : RequestHandler= ((req: Request, res: Response) : any=> {
  const { id, name, email, password, secretaryId } = req.body;

  if (!id || !name || !email || !password || !secretaryId) {
    return res.status(400).send('Missing required fields: id, name, email, password, secretaryId');
  }
  
  // check if the student id is already in the database
  const student = db.getStudentById(id);
  if (student) {
    return res.status(400).send('Student id already exists choose another id');
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
  
  // create the student in the database
  db.createStudent(newStudent);

  res.status(201).send('Student created successfully');
});


// get a student by id
export const getAstudent: RequestHandler<{ id: string }> = (req, res) => {
  const id = req.params.id;
  const student = db.getStudentById(id);

  if (student) {
    res.status(200).json(student);
  } else {
     res.status(404).send('Student not found');
  }
};

// delete a student by id and secretaryId
export const deleteStudent: RequestHandler<{ id: string, secretaryId: string }> = (req, res) => {
  const id = req.params.id;
  const secretaryId = req.params.secretaryId; 

  // Check if the secretary Id exists and is authorized
  const secretary = db.getSecretaryById(secretaryId);
  if (!secretary) {
    throw new Error("Unauthorized Secretary");
  }
  // Check if the student Id exists
  const student = db.getStudentById(id);
  if (!student) {
    throw new Error("Student not found");
  }

  const status: Boolean = db.deleteStudent(id, secretaryId);
  if (status) {
    res.status(200).send('Student deleted successfully');
  } else {
    res.status(500).send('Error deleting student');
  }
    
  
};

// update student information
export const updateStudentInfo: RequestHandler<{ id: string, secretaryId: string }> = (req, res) => {
  const id = req.params.id;
  const secretary = req.params.secretaryId;
  const { name, email, password } = req.body;

  if (db.getSecretaryById(secretary) === undefined) {
    throw new Error("Unauthorized Secretary ID");
  }
  if( db.getStudentById(id) === undefined) {
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
  const { id, secId ,courseId, departement  } = req.body;

  if (!id || !secId || !courseId) {
    res.status(400).send('Missing required fields: id, secretaryId, courseId');
    return;
  }
  // const sId = db.getStudentById(studentId);
  const student = db.getStudentById(id);
  const sec = db.getSecretaryById(secId);


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
    const status = db.addCourseToStudent(id, courseId);
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
  const { resitExamId } = req.body;

  const student = db.getStudentById(id);
  // check if the studentId is correct
  if (!student) {
    throw new Error("Invalid Student ID");
  }

  if (!resitExamId) {
    return res.status(400).send('Missing required fields: resitExamId');
    
  }
  //? check if the ResitExam Id is correct | not implemented
  // if (db.getResitExam(studentId, resitExamId) === undefined) {
  //   throw new Error("Resit exam not found");
  // }
  // check if the instructorId is correct | not implemented
  // if (db.getInstructorById(instructorId) === undefined ) {
  //   throw new Error("Instructor not found");
  // }
  
  
  // // check if the examDate is correct
  // const resitExam = db.getResitExam(studentId, resitExamId);
  // if (resitExam && examDate != resitExam.examDate) {
  //   throw new Error("invalid exam date");
  // }
  // check if the deadline is correct
  // if (deadline < new Date()) {
  //   throw new Error("Deadline is in the past");
  // }
  try {
    const status = db.addRistExamToStudent(id, resitExamId);
    if (status === true) {
      return res.status(200).send('Resit exam added to student successfully');
    } else if (status === false) {
      return res.status(400).send('Resit exam already in student\'s resit exams');
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

  const student = db.getStudentById(id);
  const sec = db.getSecretaryById(secretaryId);
  // const course = db.getCourseById(courseId);

  // Check if the secretary Id is extists and authorized
  if (db.getSecretaryById(secretaryId) === undefined) {
    throw new Error("Unauthorized Secretary ID");
  }
  // Check if the course Id is extists | not implemented
  // if (db.getCourseById(courseId) === undefined) {
  //   throw new Error("Invalid Course ID");
  // } 
  // Check if the student Id is extists
  if (!student) {
    throw new Error("Invalid Student ID");
  }
  // Check if the student is enrolled in the course
  if (!db.getStudentById(id)?.courses.includes(courseId)) {
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
export const removeStudentFromResitExam: RequestHandler<{ id: string, resitExamId: string }> = (req, res) : any => {
  const { id, resitExamId } = req.params;
  console.log(id, resitExamId);
  // Check if the ResitExam Id is extists | not implemented
  // if (db.getResitExam(id, resitExamId) === undefined) {
  //   throw new Error("Invalid Resit Exam ID or not found");
  // }
  // Check if the student Id is extists
  if (db.getStudentById(id) === undefined) {
    throw new Error("Invalid Student ID");
  }

  try {
    db.removeStudentFromResitExamFrom(id, resitExamId);
    res.status(200).send('Student removed from resit exam successfully');
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
export const getStudentResitExams: RequestHandler<{ id: string }> = (req, res) => {
  const id = req.params.id;
  const resitExams = db.getStudent_ResitExamsById(id);

  if (resitExams) {
    res.status(200).json(resitExams);
  } else {
    res.status(404).send('Student not found or no resit exams found');
  }
};

// get student's courses by id
export const getStudentCourses: RequestHandler<{ id: string }> = (req, res) => {
  const id = req.params.id;
  const courses = db.getStudentCoursesByID(id);

  if (courses) {
    res.status(200).json(courses);
  } else {
    res.status(404).send('Student not found or no courses found');
  }
};

