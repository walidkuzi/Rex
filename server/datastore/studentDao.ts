import { Instructor, ResitExam, Secretary, Student } from '../types';

export interface StudentDao {
  createStudent(student: Student, secretary: Secretary): void;
  getStudentById(id: string): Student | undefined;
  getStudentsByCourseId(id: string, courseId: string): Student[];
  deleteStudent(id: string, secretary: Secretary): void;
  updateStudent(id: string, secretary: Secretary): void;

  getStudentsByInstructorId(id: string, instructorId: Instructor): Student[];
  getStudentsByResitExamId(resitExamId: ResitExam): Student[];
}
