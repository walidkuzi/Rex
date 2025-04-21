export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Course {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
}

export interface ResitExam {
  id: string;
  letter: string;
  examDate: Date;
  deadline: Date;
  location: string;
  createdAt: Date;
  createdBy: string;
  instructorId: string;
  studentId: string;
  addedAt: Date;
}

export interface Instructor {
  id: string;
  courses: string[];
  resitExams: string[];
}

export interface Student {
  id: string;
  courses: string[];
  resitExams: string[];
}

export interface Secretary {
  id: string;
  examId: string;
  courseId: string;
  studentId: string;
  instructorId: string;
}
