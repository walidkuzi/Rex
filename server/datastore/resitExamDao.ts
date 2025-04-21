import { Instructor, ResitExam, Student } from '../types';

export interface ResitExamDao {
  createResitExam(resitExam: ResitExam, isntructor: Instructor): void;
  getResitExamById(id: string, instructorID: Instructor): ResitExam | undefined;
  deleteResitExam(id: string, instructorID: Instructor): void;
  updateResitExam(id: string, instructorID: Instructor): void;

  getResitExamsByInstructorId(id: string, instructorId: Instructor): ResitExam[];
  getResitExamsByStudentId(id: string, studentId: Student): ResitExam[];
}
