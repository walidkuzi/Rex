import express, { Request, Response, RequestHandler } from 'express';
import path from 'path';
import { addCourseToStudent, addRistExamToStudent, createAstudent, deleteStudent, getAstudent, getStudentCourses, getStudentResitExams, removeStudentFromCourse, removeStudentFromResitExam, updateStudentInfo } from './hundlers/studentHandler';
// import studentRoutes from './routes/student';

const app = express();
app.use(express.json()); // Enable JSON parsing

// Middleware for logging requests in console
const RequestMiddleware: RequestHandler = (req, res, next) => {
  console.log('New request:', req.method, req.path, '- body:', req.body);
  next();
};

app.use(RequestMiddleware);



// GET student by ID
app.get('/student/:id', getAstudent);

// create a student: id, name , email, password
app.post('/student', createAstudent );

// delete a student by id
app.delete('/student/:id/:secretaryId', deleteStudent);

// update student information
app.put('/student/:id/:secretaryId', updateStudentInfo);

// add a course to a student
app.put('/student', addCourseToStudent);

// add a resit exam to a student
app.post('/student/:id', addRistExamToStudent);

// remove a student from a course
app.delete('/student/:id', removeStudentFromCourse);

// remove a student from a resit exam
app.delete('/student/:id/resitExam/:resitExamId', removeStudentFromResitExam);

// get student's resit exams by id
app.get('/student/:id/resitExams', getStudentResitExams);

// get student's courses by id
app.get('/student/:id/courses', getStudentCourses);



// app.get('/home', (req, res) => {
//   res.sendFile(path.join(__dirname, '../web','resitexam.html'));  
// });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
