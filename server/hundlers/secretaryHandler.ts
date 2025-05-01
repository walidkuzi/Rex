import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Secretary } from '../types';





// get all courses
export const getCourses: RequestHandler = (req, res) : any => {
  const secretary = req.body.secretaryId;

  // check if the secretary is valid
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


