import { Instructor, ResitExam, Secretary } from '../types';

export interface InstructorDao {
  createInstructor(instructor: Instructor): void;
  getInstructorById(id: string): Instructor | undefined;
  
  deleteInstructor(id: string, secretaryID: string): void;
  updateInstructor(id: string, name: string, email: string, password: string , secretaryID: string): void;
  
  getInsturctorCoursesById (id: string): string[] | undefined;
  getInstructorResitExamsById(id: string, resitExamId: string): string[];

}
