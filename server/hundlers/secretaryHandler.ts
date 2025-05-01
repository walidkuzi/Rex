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

