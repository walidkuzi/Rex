import { Instructor, ResitExam, Secretary, InstructorCourseDetails } from '../../types';

export interface InstructorDao {
  createInstructor(instructor: Instructor): Promise<void>;
  getInstructorById(id: string): Promise<Instructor | undefined>;
  
  deleteInstructor(id: string, secretaryID: string): Promise<void>;
  updateInstructor(id: string, name: string, email: string, password: string , secretaryID: string): Promise<void>;
  
  getInsturctorCourses(id: string): Promise<string[] | undefined>;
  getInstructorCourseDetails(id: string): Promise<InstructorCourseDetails[] | undefined>;
  getInstructorResitExams(id: string): Promise<ResitExam[] | undefined>;
}
