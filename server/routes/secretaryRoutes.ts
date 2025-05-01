import express from 'express';
import { getCourses } from '../hundlers/secretaryHandler';

const router = express.Router();


// get all courses
router.get('/secretary/courses', getCourses);

export default router;