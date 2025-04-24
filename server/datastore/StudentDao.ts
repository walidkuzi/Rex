import { Instructor, ResitExam, Secretary, Student } from '../types';

export interface StudentDao {
  createStudent(student: Student): void;
  deleteStudent(id: string, secretaryID: string): void;
  updateStudentInfo(id: string, name: string, email: string, password: string ,secretaryId: string): void;
  addCourseToStudent(studentId: string, courseId: string, secretaryId: string): boolean;
  addRistExamToStudent(studentId: string, resitExamId: string): boolean;
  removeStudentFromCourse(studentId: string, courseId: string, secretaryId: string): void;
  removeStudentFromResitExamFrom(studentId: string, resitExamId: string): void;
  
  // getStudentResitExams(id: string): string[] | undefined;
  getAstudent(id: string): Student  | undefined;
  getStudentCourses(id: string): string[] | undefined;
}
