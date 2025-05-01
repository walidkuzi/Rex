import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Secretary } from '../types';





// get all courses
export const getCourses: RequestHandler = (req, res) => {
  const secretaryId = req.body.secretaryId;
  const courses = db.getCourses();
  res.json(courses);
};


