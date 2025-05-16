import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Course } from '../types';

// Get all students in the course
export const getCourseStudents: RequestHandler = async (req, res): Promise<any> => {
  const { id } = req.params; // course id

  try {
    const studentIds = await db.listCourseStudents(id);
    if (!studentIds) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    const students = await Promise.all(
      studentIds.map(async (studentId) => {
        const student = await db.getAstudent(studentId);
        if (!student) return null;
        return {
          id: student.id,
          name: student.name,
          email: student.email
        };
      })
    );

    return res.status(200).json({
      success: true,
      students: students.filter((student): student is { id: string; name: string; email: string } => student !== null)
    });
  } catch (error) {
    console.error('Error getting course students:', error);
    return res.status(500).json({
      success: false,
      error: 'Error getting course students',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get course statistics
export const getCourseStatistics: RequestHandler<{ id: string }> = async (req, res): Promise<any> => {
  const { id } = req.params; // course id

  try {
    const stats = await db.getCourseById(id);
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
export const updateCourse: RequestHandler = async (req, res): Promise<any> => {
  const { id } = req.params;
  const { 
    name,
    instructor,
    department,
    secretaryId
  } = req.body;

  // Validate required fields
  if (!name || !instructor || !department || !secretaryId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        name: !name,
        instructor: !instructor,
        department: !department,
        secretaryId: !secretaryId
      }
    });
  }

  try {
    // Validate secretary exists
    const secretary = await db.getSecretaryById(secretaryId);
    if (!secretary) {
      return res.status(404).json({
        success: false,
        error: 'Secretary not found'
      });
    }

    // Update the course
    await db.updateCourse(
      id,
      name,
      instructor,
      department,
      secretaryId
    );

    // Get the updated course
    const updatedCourse = await db.getCourseById(id);
    if (!updatedCourse) {
      throw new Error('Failed to update course');
    }

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Error updating course:', error);
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      }
    }
    return res.status(500).json({
      success: false,
      error: 'Error updating course',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get course instructor details
export const getCourseInstructor: RequestHandler = async (req, res): Promise<any> => {
  const { id } = req.params;
  try {
    const instructorId = await db.getCourseInstructor(id);
    if (!instructorId) {
      return res.status(404).json({
        success: false,
        error: 'Course instructor not found'
      });
    }

    const instructor = await db.getInstructorById(instructorId);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found'
      });
    }

    // Create a new object without the password field
    const { password, ...instructorWithoutPassword } = instructor;

    return res.status(200).json({
      success: true,
      instructor: instructorWithoutPassword
    });
  } catch (error) {
    console.error('Error getting course instructor:', error);
    return res.status(500).json({
      success: false,
      error: 'Error getting course instructor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create a new course
export const createCourse: RequestHandler = async (req, res): Promise<any> => {
const { 
  courseId,
  resitExamId,
  name,
  department,
  secretaryId
} = req.body;

// Validate required fields
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
  // Validate secretary exists
  const secretary = await db.getSecretaryById(secretaryId);
  if (!secretary) {
    return res.status(404).json({
      success: false,
      error: 'Secretary not found'
    });
  }

  // Create the course object
  const newCourse: Course = {
    id: courseId,
    name: name,
    resitExamId: resitExamId,
    department: department,
    createdBy: secretaryId,
    students: [],
    instructor: "",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Create the course
  await db.createCourse(newCourse);

  // Get the created course
  const createdCourse = await db.getCourseById(courseId);
  if (!createdCourse) {
    throw new Error('Failed to create course');
  }

  return res.status(201).json({
    success: true,
    message: 'Course created successfully',
    course: createdCourse
  });
} catch (error) {
  console.error('Error creating course:', error);
  if (error instanceof Error) {
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }
  }
  return res.status(500).json({
    success: false,
    error: 'Error creating course',
    details: error instanceof Error ? error.message : 'Unknown error'
  });
}
};

// Get a course by ID
export const getCourse: RequestHandler<{ id: string }> = async (req, res): Promise<any> => {
  const { id } = req.params;

  try {
    const course = await db.getCourseById(id);
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
export const deleteCourse: RequestHandler = async (req, res): Promise<any> => {
  const { id } = req.params;
  const { secretaryId } = req.body;

  // Validate required fields
  if (!secretaryId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        secretaryId: !secretaryId
      }
    });
  }

  try {
    // Validate secretary exists
    const secretary = await db.getSecretaryById(secretaryId);
    if (!secretary) {
      return res.status(404).json({
        success: false,
        error: 'Secretary not found'
      });
    }

    // Delete the course
    await db.deleteCourse(id, secretaryId);

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      }
    }
    return res.status(500).json({
      success: false,
      error: 'Error deleting course',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 