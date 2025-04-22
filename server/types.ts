import { RequestHandler } from "express";



export interface User {
  id: string;
  name: string;
  email: string;
  password: string;

}


export interface Secretary extends User {
  especialId: string;

  // examId: string;
  // courseId: string;
  // studentId: string;
  // instructorId: string;
}

export interface Instructor extends User {
  courses: string[];
  resitExams: string[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
}

export interface Student extends User {
  courses: string[];
  resitExams: string[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
}



export interface Course {
  id: string;
  name: string;
  department: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  instructor: string;
}

export interface ResitExam {
  id: string;
  name: string;
  department: string;
  instructor: string;
  lettersAllowed: string[];
  examDate: Date;
  deadline: Date;
  location: string;
  students: string[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
}


export type MyExpressHandler<Req, Res> = RequestHandler<string, Partial<Res>, Partial<Req>, any>;

