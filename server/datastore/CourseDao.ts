import { Course, Instructor, Secretary, Student } from '../types';

export interface CourseDao {
  createCourse(courseId: string, cName: string, department: string  , secretaryId: string): void;

  getCourseById(id: string): Course | undefined;
  getCourseInstructor(id: string): string | undefined;
  listCourseStudents(id: string): string[] | undefined;
  deleteCourse(id: string, secretaryId: string): void;

  updateCourse(id: string, name: string, instructor: string, department: string ,secretaryId: string): void;


}
