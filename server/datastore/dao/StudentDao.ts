import { Instructor, ResitExam, Secretary, Student, StudentCourseDetails } from '../../types';

export interface StudentDao {
  createStudent(student: Student): Promise<void>;
  deleteStudent(id: string, secretaryID: string): Promise<void>;
  updateStudentInfo(id: string, name: string, email: string, password: string ,secretaryId: string): Promise<void>;
  addCourseToStudent(studentId: string, courseId: string, grade: number, gradeLetter: string): Promise<boolean>;
  addRistExamToStudent(studentId: string, resitExamId: string): Promise<boolean>;
  removeStudentFromCourse(studentId: string, courseId: string, secretaryId: string): Promise<void>;
  removeStudentFromResitExam(studentId: string, resitExamId: string): Promise<void>;
  
  // getStudentResitExams(id: string): string[] | undefined;
  getAstudent(id: string): Promise<Student | undefined>;
  getStudentCourses(id: string): Promise<string[] | undefined>;
  getStudentCourseDetails(id: string): Promise<StudentCourseDetails[] | undefined>;
}
