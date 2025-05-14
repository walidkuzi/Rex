import { Course, Instructor, Secretary, Student } from '../../types';

export interface CourseDao {
  createCourse(course: Course): Promise<void>;

  getCourseById(id: string): Promise<Course | undefined>;
  getCourseInstructor(id: string): Promise<string | undefined>;
  listCourseStudents(id: string): Promise<string[] | undefined>;
  deleteCourse(id: string, secretaryId: string): Promise<void>;

  updateCourse(id: string, name: string, instructor: string, department: string, secretaryId: string): Promise<void>;
}

