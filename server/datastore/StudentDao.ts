import { Instructor, ResitExam, Secretary, Student } from '../types';

export interface StudentDao {
  createStudent(id: string, secretaryId: string, stdname: string, stdEmail: string, stdPasswerd: string): void;
  deleteStudent(id: string, secretaryID: string): void;
  updateStudentInfo(id: string, name: string, email: string, password: string ,secretaryId: string): void;
  addCourseToStudent(studentId: string, reExamId: string): void;
  addRistExamToStudent(studentId: string, resitExamId: string): void;
  removeStudentFromCourse(studentId: string, courseId: string): void;
  removeStudentFromResitExamFrom(studentId: string, resitExamId: string): void;
  
  getStudent_ResitExamsById(id: string): string[] | undefined;
  getStudentById(id: string): Student  | undefined;
  getStudentCoursesByID(id: string): string[] | undefined;
}
