// Importing necessary types from '../types'
import { Instructor, ResitExam, ResitExamResponse, Student } from '../types';

/**
 * Interface for Resit Exam Data Access Object (DAO)
 * This interface defines methods for interacting with resit exams, including CRUD operations and result management.
 */
export interface ResitExamDao {

  /**
   * Creates a new resit exam.
   * 
   * @param resitExamId - Unique identifier for the resit exam.
   * @param courseId - Identifier for the course.
   * @param name - Name of the resit exam.
   * @param department - Department offering the exam.
   * @param instructorId - Identifier for the instructor.
   * @param lettersAllowed - Array of allowed letters (likely for grading).
   * @param examDate - The date of the exam.
   * @param deadline - The deadline for submission.
   * @param location - The location where the exam will take place.
   */
  createResitExamBySecretary(
    secr_id: string,
    resitExamId: string, 
    courseId: string, 
    examDate: Date, 
    deadline: Date, 
    location: string
  ): void;

  /**
   * Retrieves a specific resit exam by its ID and instructor ID.
   * 
   * @param id - The resit exam ID.
   * @param instructorID - The ID of the instructor.
   * @returns The ResitExam object or undefined if not found.
   */
  getResitExam(id: string, instructorID: string): ResitExam;

  /**
   * Deletes a resit exam by its ID and instructor ID.
   * 
   * @param id - The resit exam ID.
   * @param instructorID - The ID of the instructor.
   * @param resitExamId - The ID of the resit exam to be deleted.
   */
  deleteResitExam(id: string, instructorID: string, resitExamId: string): void;

  /**
   * Updates the details of a resit exam by a secretary.
   * 
   * @param id - The resit exam ID.
   * @param name - The updated name of the resit exam.
   * @param instructorID - The ID of the instructor.
   * @param department - The department offering the exam.
   * @param letters - The updated allowed letters for grading.
   * @param examDate - The updated date for the exam.
   * @param deadline - The updated deadline for submission.
   * @param location - The updated location of the exam.
   * @param secretaryId - The ID of the secretary making the update.
   */
  updateResitExamBySecretary(
    resitExamId: string,

    examDate: Date, 
    deadline: Date, 
    location: string, 
    secretaryId: string
  ): void;

  /**
   * Updates the details of a resit exam by an instructor.
   * 
   * @param id - The resit exam ID.
   * @param name - The updated name of the resit exam.
   * @param instructorID - The ID of the instructor.
   * @param department - The department offering the exam.
   * @param letters - The updated allowed letters for grading.
   */
  updateResitExamByInstructor(
    id: string, 
    name: string, 
    instructorID: string, 
    department: string, 
    letters: string[]
  ): void;

  /**
   * Retrieves all resit exams for a specific instructor.
   * 
   * @param instructorID - The ID of the instructor.
   * @returns An array of ResitExam objects.
   */
  getResitExamsByInstructorId(instructorID: string): ResitExam[];

  /**
   * Retrieves all resit exams associated with a specific student.
   * 
   * @param id - The ID of the student.
   * @returns An array of ResitExamResponse objects.
   */
  getStudentResitExams(id: string): ResitExamResponse[];

  /**
   * Retrieves all resit exam results for a specific student.
   * 
   * @param studentId - The ID of the student.
   * @returns An array of results, each including resitExamId, grade, gradeLetter, and submission time.
   */
  getStudentAllResitExamResults(studentId: string): { 
    resitExamId: string; 
    grade: number; 
    gradeLetter: string; 
    submittedAt: Date 
  }[];

  /**
   * Retrieves all results for a specific resit exam.
   * 
   * @param resitExamId - The ID of the resit exam.
   * @returns An array of results, each including studentId, grade, gradeLetter, and submission time.
   */
  getResitExamAllResults(resitExamId: string): { 
    studentId: string; 
    grade: number; 
    gradeLetter: string; 
    submittedAt: Date 
  }[];

  /**
   * Retrieves the result for a specific student in a specific resit exam.
   * 
   * @param studentId - The ID of the student.
   * @param resitExamId - The ID of the resit exam.
   * @returns The result, including grade, gradeLetter, and submission time, or undefined if not found.
   */
  getStudentResitExamResults(
    studentId: string, 
    resitExamId: string
  ): { grade: number; gradeLetter: string; submittedAt: Date } | undefined;

  /**
   * Updates the result of a specific student for a specific resit exam.
   * 
   * @param studentId - The ID of the student.
   * @param resitExamId - The ID of the resit exam.
   * @param grade - The updated grade.
   * @param gradeLetter - The updated letter grade.
   * @returns True if the update was successful, false otherwise.
   */
  updateStudentResitExamResults(
    studentId: string, 
    resitExamId: string, 
    grade: number, 
    gradeLetter: string
  ): boolean;

  /**
   * Updates the results for all students in a specific resit exam.
   * 
   * @param resitExamId - The ID of the resit exam.
   * @param results - An array of results for each student, including studentId, grade, and gradeLetter.
   * @returns True if the update was successful for all students, false otherwise.
   */
  updateAllStudentsResitExamResults(
    resitExamId: string, 
    results: { studentId: string; grade: number; gradeLetter: string }[]
  ): boolean;
}
