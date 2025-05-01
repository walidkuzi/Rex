import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Secretary } from '../types';





// get all courses
export const getCourses: RequestHandler = (req, res) : any => {
  const secretary = req.body.secretaryId;

  // check if the secretary is provided
  if (!secretary) {
    return res.status(400).json({ error: 'Secretary is required' });
  }
  // check if the secretary is authorized
  const authorized = db.getSecretaryById(secretary);
  if (!authorized) {
    return res.status(401).json({ error: 'Unauthorized secretary id' });
  }
  // get the courses
  const courses = db.getCourses();
  res.json(courses);
};


// get all resit exams
export const getResitExams: RequestHandler = (req, res) : any => {
  const secretary = req.body.secretaryId;

  // check if the secretary is provided
  if (!secretary) {
    return res.status(400).json({ error: 'Secretary is required' });
  }
  // check if the secretary is authorized
  const authorized = db.getSecretaryById(secretary);
  if (!authorized) {
    return res.status(401).json({ error: 'Unauthorized secretary id' });
  }
  // get the resit exams
  const resitExams = db.getResitExams();
  res.json(resitExams);
};

// get all students
export const getStudents: RequestHandler = (req, res) : any => {
  const secretary = req.body.secretaryId;

  // check if the secretary is provided
  if (!secretary) {
    return res.status(400).json({ error: 'Secretary is required' });
  }
  // check if the secretary is authorized
  const authorized = db.getSecretaryById(secretary);
  if (!authorized) {
    return res.status(401).json({ error: 'Unauthorized secretary id' });
  }
  // get the students
  const students = db.getStudents();
  res.json(students);
};


// get all instructors
export const getInstructors: RequestHandler = (req, res) : any => {
  const secretary = req.body.secretaryId;

  // check if the secretary is provided
  if (!secretary) {
    return res.status(400).json({ error: 'Secretary is required' });
  }
  // check if the secretary is authorized
  const authorized = db.getSecretaryById(secretary);
  if (!authorized) {
    return res.status(401).json({ error: 'Unauthorized secretary id' });
  }
  // get the instructors
  const instructors = db.getInstructors();
  res.json(instructors);
};

