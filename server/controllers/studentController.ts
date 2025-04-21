// import { Request, Response, RequestHandler } from 'express';
// import { db } from '../datastore';



// // Create Student Handler
// export const createStudent: RequestHandler = (req, res, next) => {
//   try {
//     res.setHeader('Content-Type', 'application/json');

//     const { userId, secretaryId, stdname, stdemail, stdpassword } = req.body;

//   if (!userId || !secretaryId || !stdname || !stdemail || !stdpassword) {
//     return res.status(400).json({ error: 'Missing required parameters' });
//   }

//   const userExists = db.getStudentById(userId);
//   const secretaryExists = db.getSecretaryById(secretaryId);

//   if (!userExists || !secretaryExists) {
//     return res.status(404).json({ error: 'User or Secretary not found' });
//   }

//   const student = db.createStudent(userId, secretaryId, stdname, stdemail, stdpassword);

//   return res.status(201).json({
//     message: 'Student created successfully',
//     student,
//   });
// };
// // Get Student By ID Handler
// export const getStudentByIdHandler: RequestHandler = (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const student = db.getStudentById(id);

//     if (student) {
//     return res.status(200).json(student);
//   } else {
//     return res.status(404).json({ error: 'Student not found' });
//   }
// };
