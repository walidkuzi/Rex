import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';



// create a student: id, name , email, password
export const createAstudent : RequestHandler= ((req: Request, res: Response) : any=> {
  const { id, name, email, password } = req.body;

  if (!id || !name || !email || !password) {
    return res.status(400).send('Missing required fields: id, name, email, password');
  }

  // You can pass hardcoded values for createdBy and secretaryId for now
  const secretaryId = "sec-001"; // example
  db.createStudent(id, secretaryId, name, email, password);

  res.status(201).send('Student created');
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

// delete a student by id
export const deleteStudent: RequestHandler<{ id: string, secretaryId: string }> = (req, res) => {
  const id = req.params.id;
  const secretaryId = req.params.secretaryId; 

  try {
    db.deleteStudent(id, secretaryId);
    res.status(200).send('Student deleted successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      res.status(403).send('Unauthorized to delete student');
    } else {
      res.status(500).send('Error deleting student');
    }
  }
};

// update student information
export const updateStudentInfo: RequestHandler<{ id: string, secretaryId: string }> = (req, res) => {
  const id = req.params.id;
  const secretary = req.params.secretaryId;
  const { name, email, password } = req.body;

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
export const addCourseToStudent: RequestHandler<{ studentId: string, courseId: string, secretaryId: string }> = (req, res) => {
  const { studentId, courseId } = req.params;
  const secretaryId = req.params.secretaryId;

  try {
    db.addCourseToStudent(studentId, courseId, secretaryId);
    res.status(200).send('Course added to student successfully');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Course not found') {
        res.status(404).send('Course not found');
      } else if (error.message === 'Student not found') {
        res.status(404).send('Student not found');
      } else {
        res.status(500).send('Error adding course to student');
      }
    } else {
      res.status(500).send('Error adding course to student');
    }
  }
};

// add a resit exam to a student
export const addRistExamToStudent: RequestHandler<{ studentId: string, resitExamId: string }> = (req, res) => {
  const { studentId, resitExamId } = req.params;

  try {
    db.addRistExamToStudent(studentId, resitExamId);
    res.status(200).send('Resit exam added to student successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Resit exam not found') {
      res.status(404).send('Resit exam not found');
    } else {
      res.status(500).send('Error adding resit exam to student');
    }
  }
};

// remove a student from a course
export const removeStudentFromCourse: RequestHandler<{ studentId: string, courseId: string, secretaryId: string }> = (req, res) => {
  const { studentId, courseId } = req.params;
  const secretaryId = req.params.secretaryId;

  try {
    db.removeStudentFromCourse(studentId, courseId, secretaryId);
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
export const removeStudentFromResitExam: RequestHandler<{ studentId: string, resitExamId: string }> = (req, res) => {
  const { studentId, resitExamId } = req.params;

  try {
    db.removeStudentFromResitExamFrom(studentId, resitExamId);
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

