import { Instructor, ResitExam, ResitExamResponse, Student } from '../types';


export interface ResitExamDao {
  createResitExam(resitExamId: string, courseId: string, name: string, department: string, isntructorId: string, lettersAllowed: string[], examDate: Date, deadline: Date, location: string): void;
  getResitExam(id: string, instructorID: string): ResitExam | undefined;
  deleteResitExam(id: string, instructorID: string, resitExamId: string): void;
  updateResitExam(id: string, name: string, instructorID: string, department: string, Letters: string[], examDate: Date, deadline: Date, location: string, secretaryId: string): void;

  getResitExamsByInstructorId(instructorIDid: string): ResitExam[];
  getStudentResitExams(id: string): ResitExamResponse[];
}
