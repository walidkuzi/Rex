import { Instructor, ResitExam, Secretary, InstructorCourseDetails } from '../types';

export interface InstructorDao {
  createInstructor(instructor: Instructor): void;
  getInstructorById(id: string): Instructor | undefined;
  
  deleteInstructor(id: string, secretaryID: string): void;
  updateInstructor(id: string, name: string, email: string, password: string , secretaryID: string): void;
  
  getInsturctorCourses(id: string): string[] | undefined;
  getInstructorResitExams(id: string): string[] | undefined;
  getInstructorCourseDetails(id: string): InstructorCourseDetails[] | undefined;
}
