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

export interface InstructorCourseDetails {
  courseId: string;
  courseName: string;
  department: string;
  students: string[];
}

export interface Instructor extends User {
  courses: string[]; // must be added not created | added from Course students
  resitExams: string[]; // must be added not created | added from ResitExam students
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
}

export interface Student extends User {
  courses: string[]; // must be added not created | added from Course students
  resitExams: string[]; // must be added not created | added from ResitExam students
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
}



export interface Course {
  id: string;
  name: string;
  department: string;
  students: string[];  // Array of student IDs
  instructor: string | undefined; // only one instructor
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;

}

export interface ResitExam {
  id: string;
  name: string;
  department: string;
  instructors: string[];  // Changed from instructor: string to instructors: string[]
  lettersAllowed: string[];
  examDate: Date;
  deadline: Date;
  location: string;
  students: string[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
}




export interface StudentCourseGrade {
  studentId: string;
  courseId: string;
  grade: number;
  gradeLetter: string;
}

export interface StudentCourseDetails {
  courseId: string;
  courseName: string;
  grade?: number;
  gradeLetter?: string;
}

export type MyExpressHandler<Req, Res> = RequestHandler<string, Partial<Res>, Partial<Req>, any>;

