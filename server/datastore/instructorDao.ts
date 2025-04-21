import { Instructor, ResitExam, Secretary } from '../types';

export interface InstructorDao {
  createInstructor(instructor: Instructor, secretary: Secretary): void;
  getInstructorById(id: string): Instructor | undefined;
  getInstructorsByCourseId(courseId: string): Instructor[];
  deleteInstructor(id: string, secretary: Secretary): void;
  updateInstructor(id: string, secretary: Secretary): void;

  getInstructorsByResitExamId(resitExamId: ResitExam): Instructor[];

  // getInstructorsByStudentId(studentId: Student): Instructor[];
}
