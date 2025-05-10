import { RequestHandler } from 'express';
import { db } from '../datastore';

// Get all students in the course
export const getCourseStudents: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params; // course id

  try {
    const students = db.getStudentsInCourse(id);
    if (!students) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    return res.status(200).json({
      success: true,
      students: students.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email
      }))
    });
  } catch (error) {
    console.error('Error getting course students:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while getting course students',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get course statistics
export const getCourseStatistics: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params; // course id

  try {
    const stats = db.getCourseStats(id);
    if (!stats) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    return res.status(200).json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    console.error('Error getting course statistics:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while getting course statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update course details
export const updateCourse: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params; // course id
  const { name, department, instructor, secretaryId } = req.body;

  if (!secretaryId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: secretaryId'
    });
  }

  try {
    const success = db.updateCourseDetails(id, { name, department, instructor }, secretaryId);
    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update course. Check if course exists and secretary is authorized.'
      });
    }

    const updatedCourse = db.getCourseById(id);
    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while updating course',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get course instructor details
export const getCourseInstructor: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params; // course id

  try {
    const instructor = db.getCourseInstructorDetails(id);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or no instructor assigned'
      });
    }

    return res.status(200).json({
      success: true,
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email
      }
    });
  } catch (error) {
    console.error('Error getting course instructor:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while getting course instructor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create a new course
export const createCourse: RequestHandler = (req, res) : any => {
  const { courseId, resitExamId, name, department, secretaryId } = req.body;

  if (!courseId || !resitExamId || !name || !department || !secretaryId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        courseId: !courseId,
        resitExamId: !resitExamId,
        name: !name,
        department: !department,
        secretaryId: !secretaryId
      }
    });
  }




  try {
    // Verify secretary authorization
    const secretary = db.getSecretaryById(secretaryId);
    if (!secretary) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized Secretary ID'
      });
    }

    // check if the Course Id not taken
    const cId = db.getCourseById(courseId);
    if (cId) { // if returned Ok then the course id is taken
      return res.status(403).json({
        success: false,
        error: 'this Course Id is taken, choose another one'
      });
    }
    
    // check if the resit exam id is taken
    const rId = db.getResitExam(resitExamId);
    if (rId) { // if returned Ok then the resit exam id is taken
      return res.status(403).json({
        success: false,
        error: 'this Resit Exam Id is taken, choose another one'
      });
    }

    // Create the course
    db.createCourse(courseId, resitExamId, name, department, secretaryId);
    
    // Get the created course
    const course = db.getCourseById(courseId);
    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: course
    });
  } catch (error) {
    console.error('Error: creating course:', error); 
    return res.status(500).json({
      success: false,
      error: 'Server error while creating course',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get a course by ID
export const getCourse: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params;

  try {
    const course = db.getCourseById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    return res.status(200).json({
      success: true,
      course: course
    });
  } catch (error) {
    console.error('Error getting course:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while getting course',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete a course
export const deleteCourse: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params;
  const { secretaryId } = req.body;

  if (!secretaryId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: secretaryId'
    });
  }

  try {
    // Verify secretary authorization
    const secretary = db.getSecretaryById(secretaryId);
    if (!secretary) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized Secretary ID'
      });
    }

    // Check if course exists
    const course = db.getCourseById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Delete the course
    db.deleteCourse(id, secretaryId);
    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while deleting course',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 