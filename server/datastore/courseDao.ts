import { Course, Instructor, Secretary, Student } from '../types';

export interface CourseDao {
  createCourse(course: Course, secretary: Secretary): void;
  getCourseById(id: string): Course | undefined;
  deleteCourse(id: string, secretary: Secretary): void;
  updateCourse(id: string, secretary: Secretary): void;

  // getCoursesByInstructorId(instructorId: Instructor): Course[];
  // getCoursesByStudentId(studentId: Student): Course[];
}
