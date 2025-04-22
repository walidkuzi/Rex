import { Instructor, ResitExam, Secretary, Student } from '../types';

export interface StudentDao {
  createStudent(student: Student): void;
  deleteStudent(id: string, secretaryID: string): void;
  updateStudentInfo(id: string, name: string, email: string, password: string ,secretaryId: string): void;
  addCourseToStudent(studentId: string, courseId: string, secretaryId: string): boolean;
  addRistExamToStudent(studentId: string, resitExamId: string): boolean;
  removeStudentFromCourse(studentId: string, courseId: string, secretaryId: string): void;
  removeStudentFromResitExamFrom(studentId: string, resitExamId: string): void;
  
  getStudent_ResitExamsById(id: string): string[] | undefined;
  getStudentById(id: string): Student  | undefined;
  getStudentCoursesByID(id: string): string[] | undefined;
}
