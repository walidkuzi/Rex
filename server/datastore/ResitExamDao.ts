import { Instructor, ResitExam, Student } from '../types';

export interface ResitExamDao {
  createResitExam(id: string, name: string, department: string, isntructorId: string, lettersAllowed: string[], examDate: Date, deadline: Date, location: string, secretaryId: string): void;
  getResitExam(id: string, instructorID: string): ResitExam | undefined;
  deleteResitExam(id: string, instructorID: string, secretaryId: string): void;
  updateResitExam(id: string, name: string, instructorID: string, department: string, Letters: string[], examDate: Date, deadline: Date, location: string, secretaryId: string): void;

  getResitExamsByInstructorId(instructorIDid: string): ResitExam[];
  getStudentResitExams(studentId: string): ResitExam[];
}
