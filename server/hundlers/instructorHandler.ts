import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Instructor } from '../types';



// create an instructor
export const createInstructor: RequestHandler = async (req, res): Promise<any> => {
  const { id, name, email, password, secretaryId } = req.body;
  
  // Input validation
  if (!id || !name || !email || !password || !secretaryId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        id: !id,
        name: !name,
        email: !email,
        password: !password,
        secretaryId: !secretaryId
      }
    });
  }

  // Email format validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'Invalid email format'
    //   });
    // }

  // Password strength validation
    // if (password.length < 8) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'Password must be at least 8 characters long'
    //   });
    // }

  // check if the secretary id is correct
  const secretary = await db.getSecretaryById(secretaryId);
  if (!secretary) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Secretary ID'
    });
  }

  // check if the instructor id is already in the database
  const instructor = await db.getInstructorById(id);
  if (instructor) {
    return res.status(400).json({
      success: false,
      error: 'Instructor ID already exists',
      existingInstructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email
      }
    });
  }

  // Creating the instructor object to be added to the database
  const newInstructor: Instructor = {
    id: id,
    name: name,
    email: email,
    password: password,
    courses: [],
    resitExams: [],
    createdAt: new Date(),
    createdBy: secretaryId,
    updatedAt: null
  }

  try {
    // create the instructor in the database
    await db.createInstructor(newInstructor);


    // Verify the instructor was created by retrieving it
    const createdInstructor = await db.getInstructorById(id);
    if (!createdInstructor) {
      throw new Error('Failed to verify instructor creation');
    }

    // Return success response with created instructor info
    return res.status(201).json({
      success: true,
      message: `Instructor: ${name} created successfully`,
      // instructor: {
      //   id: createdInstructor.id,
      //   name: createdInstructor.name,
      //   email: createdInstructor.email,
      //   createdAt: createdInstructor.createdAt,
      //   createdBy: createdInstructor.createdBy
      // }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create instructor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


// get an instructor by id
export const getInstructor: RequestHandler<{ id: string }> = async (req, res): Promise<any> => {
  const { id } = req.params;
  const instructor = await db.getInstructorById(id);

  if (!instructor) {
    return res.status(404).json({ error: "Instructor not found" });
  }

  res.status(200).json(instructor);
};


// delete an instructor
export const deleteInstructor: RequestHandler<{ id: string}> = async (req, res): Promise<any> => {
  const { id } = req.params;
  const secretaryId  = req.body.secretaryId;
  const instructor = await db.getInstructorById(id);
  const secretary = await db.getSecretaryById(secretaryId);

  // check if the secretary Id is extists and authorized
  if (!secretary) {
    throw new Error("Unauthorized secretary ID");
  }
  // check if the instructor Id is correct
  if (!instructor) {
    throw new Error("Invalid Instructor ID or not found");
  }

  // delete the instructor from the database

  await db.deleteInstructor(id);
  res.status(200).json({ message: 'Instructor deleted successfully' });
};

// update instructor information
export const updateInstructorInfo: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, secretaryId } = req.body;

  try {
    // check if the secretary Id is extists and authorized
    const secretary = await db.getSecretaryById(secretaryId);
    if (!secretary) {
      throw new Error("Unauthorized Secretary ID");
    }
    // check if the instructor Id is correct
    const instructor = await db.getInstructorById(id);
    if (!instructor) {
      throw new Error("Instructor not found");
    }

    if (!name || !email || !password) {
      res.status(400).send('Missing required fields: name, email, password');
      return;
    }

    await db.updateInstructor(id, name, email, password);
    res.status(200).send('Instructor information updated successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      res.status(403).send('Unauthorized to update instructor');
    } else {
      res.status(500).send('Error updating instructor information');
    }
  }
};


// assigning instructor to a course
export const assignInstructorToCourse: RequestHandler <{id: string}> = async (req, res): Promise<any> => {
  const { id } = req.params;
  const {courseId, secretaryId } = req.body;

  try {
    // Get all required entities 
    const instructor = await db.getInstructorById(id);
    const secretary = await db.getSecretaryById(secretaryId);
    const course = await db.getCourseById(courseId);

    // Validate entities exist
    if (!instructor || !secretary || !course) {
      return res.status(404).json({
        success: false,
        error: 'One or more entities not found, not found = true',
        missingFields: {
          instructor: !instructor,
          secretary: !secretary,
          course: !course
        }
      });
    }

    // Check if course already has an instructor
    if (course.instructor) {
      const currentInstructor = await db.getInstructorById(course.instructor);
      return res.status(400).json({
        success: false,
        error: 'Course already has an instructor',
        currentInstructor: {
          id: currentInstructor?.id,
          name: currentInstructor?.name
        }
      });
    }

    // Assign instructor to course
    const status = await db.assignInstructorToCourse(id, courseId);
    if (status) {
      // Get updated course data
      const updatedCourse = await db.getCourseById(courseId);
      
      return res.status(200).json({
        success: true,
        message: 'Instructor assigned to course successfully',
        course: updatedCourse
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Failed to assign instructor to course'
    });
  } catch (error) {
    console.error('Error assigning instructor to course:', error);
    return res.status(500).json({
      success: false,
      error: 'Error assigning instructor to course',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// unassigning instructor from course
export const unassignInstructorFromCourse: RequestHandler<{id: string}> = async (req, res): Promise<any> => {
  const { id } = req.params;
  const { courseId, secretaryId } = req.body;

  try {
    // Validate required fields
    if (!courseId || !secretaryId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields: {
          courseId: !courseId,
          secretaryId: !secretaryId
        }
      });
    }

    // Get all required entities with trimmed IDs
    const instructor = await db.getInstructorById(id.trim());
    const secretary = await db.getSecretaryById(secretaryId.trim());
    const course = await db.getCourseById(courseId.trim());

    // Validate all entities exist
    if (!instructor || !secretary || !course) {
      return res.status(404).json({
        success: false,
        error: 'One or more entities not found',
        missingFields: {
          instructor: !instructor,
          secretary: !secretary,
          course: !course
        }
      });
    }

    // Check if course has an instructor
    if (!course.instructor) {
      return res.status(400).json({
        success: false,
        error: 'Course does not have an instructor assigned'
      });
    }

    // Check if the course has this specific instructor
    if (course.instructor !== id) {
      return res.status(400).json({
        success: false,
        error: 'Course is assigned to a different instructor',
        currentInstructor: course.instructor
      });
    }

    // Unassign instructor from course
    const status = await db.unassignInstructorFromCourse(id, courseId);
    if (status) {
      // Get updated course data
      const updatedCourse = await db.getCourseById(courseId);
      
      return res.status(200).json({
        success: true,
        message: 'Instructor unassigned from course successfully',
        course: updatedCourse
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Failed to unassign instructor from course'
    });
  } catch (error) {
    console.error('Error unassigning instructor from course:', error);
    return res.status(500).json({
      success: false,
      error: 'Error unassigning instructor from course',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


// create a resit exam
export const createResitExam: RequestHandler<{ id: string }> = async (req, res): Promise<any> => {
  const { id } = req.params; // instructor id
  const { 
    courseId,
    lettersAllowed,
  } = req.body;

  // Validate required fields
  if (!courseId || !lettersAllowed ) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        courseId: !courseId,
        lettersAllowed: !lettersAllowed,
      }
    });
  }

  try {
    // Validate instructor exists
    const instructor = await db.getInstructorById(id);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found'
      });
    }

    // Validate instructor is assigned to the course
    if (!instructor.courses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        error: 'Instructor not assigned to this course'
      });
    }

    // Get the course to extract resitExamId
    const course = await db.getCourseById(courseId);
    if (!course || !course.resitExamId) {
      return res.status(400).json({
        success: false,
        error: 'Course not found or does not have a resit exam ID'
      });
    }

    // get the name and department from the course that the resit exam is for
    const name = course?.name;
    const department = course?.department;

    // get the resitExamId from the course to use it as the id for the resit exam
    //! so every course has a resit exam id we will use it as the id for the resit exam
    const resitExamId = course?.resitExamId;

    // Create the resit exam using the resitExamId from the course
    await db.createResitExamByInstuctor(
      resitExamId,
      courseId,
      name,
      department,
      id, // instructorId
      lettersAllowed,
    );

    // Get the created resit exam using the resitExamId from the course
    const createdResitExam = await db.getResitExam(course.resitExamId);
    if (!createdResitExam) {
      throw new Error('Failed to create resit exam');
    }

    return res.status(201).json({
      success: true,
      message: 'Resit exam created successfully',
      resitExam: createdResitExam
    });
  } catch (error) {
    console.error('Error creating resit exam:', error);
    return res.status(500).json({
      success: false,
      error: 'Error creating resit exam',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// unenroll instructor from course
export const unEnrollInstructorFromCourse: RequestHandler<{ id: string, courseId: string }> = async (req, res): Promise<any> => {
  // Extract route parameters (instructor ID and course ID)
  const { id, courseId } = req.params;
  
  // Extract body parameters (e.g., secretary ID for authorization)
  const secretaryId = req.body.secretaryId;

  //  Validate required fields early
  if (!secretaryId) {
    return res.status(400).send('Missing required field: secretaryId');
  }

  try {
    const instructor = await db.getInstructorById(id.trim());
    const secretary = await db.getSecretaryById(secretaryId.trim());
    const course = await db.getCourseById(courseId.trim());

    //  Ensure instructor exists
    if (!instructor) return res.status(404).send('Instructor not found');

    //  Ensure secretary is authorized
    if (!secretary) return res.status(403).send('Unauthorized Secretary ID');

    //  Ensure course exists
    if (!course) return res.status(404).send('Course not found');

    //  Ensure instructor is actually assigned to the course
    if (!instructor.courses.includes(courseId)) {
      return res.status(400).send("Instructor not assigned to the course");
    }

    // Perform the core action: Remove the course from the instructor's courses
    await db.unassignInstructorFromCourse(id, courseId);

    //  Respond with success
    return res.status(200).send('Course removed from instructor successfully');
  } catch (error) {
    //  Catch and handle unexpected errors safely
    console.error(error); // Optional: log for server-side debugging
    return res.status(500).send('Error removing course from instructor');
  }
};


// Delete a resit exam
export const deleteResitExam: RequestHandler<{ id: string }> = async (req, res): Promise<any> => {
  const { id } = req.params; // instructor id
  const { resitExamId } = req.body;

  try {
    // Validate instructor exists
    const instructor = await db.getInstructorById(id);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found'
      });
    }

    // Check if the instructor is enrolled in the resit exam
    if (!instructor.resitExams.includes(resitExamId)) {
      return res.status(400).json({
        success: false,
        error: 'Instructor not enrolled in the resit exam'
      });
    }

    // Remove the resit exam from the instructor's resit exams
    await db.deleteResitExam(id, instructor.id, resitExamId);
    return res.status(200).json({
      success: true,
      message: 'Resit exam removed from instructor successfully'
    });
  } catch (error) {
    console.error('Error removing resit exam from instructor:', error);
    return res.status(500).json({
      success: false,
      error: 'Error removing resit exam from instructor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


// get instructor's course or courses
export const getInstructorCourses: RequestHandler<{ id: string }> = async (req, res): Promise<any> => {
  const { id } = req.params;
  try {
    const courseIds = await db.getInsturctorCourses(id);
    if (!courseIds) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found'
      });
    }

    const courses = await Promise.all(
      courseIds.map(async (courseId) => {
        const course = await db.getCourseById(courseId);
        if (!course) return null;
        return {
          id: course.id,
          name: course.name,
          department: course.department
        };
      })
    );

    return res.status(200).json({
      success: true,
      courses: courses.filter((course): course is { id: string; name: string; department: string } => course !== null)
    });
  } catch (error) {
    console.error('Error getting instructor courses:', error);
    return res.status(500).json({
      success: false,
      error: 'Error getting instructor courses',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


// get instructor's resit exams
export const getInstructorResitExams: RequestHandler<{ id: string }> = async (req, res): Promise<any> => {
  const { id } = req.params;
  const instructor = await db.getInstructorById(id);
  const resitExams = await db.getInstructorResitExams(id);
  
  if (!instructor) {
    return res.status(404).json({
      success: false,
      error: 'Instructor not found'
    });
  }

  return res.status(200).json({
    success: true,
    resitExams
  });
};

export const getInstructorCourseDetails: RequestHandler<{ id: string }> = async (req, res): Promise<any> => {
  try {
    const { id } = req.params;
    const courseDetails = await db.getInstructorCourseDetails(id);
    
    if (!courseDetails) {
      return res.status(404).json({ message: 'Instructor not found or has no courses' });
    }
    
    return res.status(200).json(courseDetails);
  } catch (error) {
    console.error('Error getting instructor course details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// update a resit exam
export const updateResitExam: RequestHandler<{ id: string }> = async (req, res): Promise<any> => {
  const { id } = req.params; // instructor id
  const { 
    courseId,
    lettersAllowed,
    examDate,
    deadline,
    location
  } = req.body;

  try {
    // Validate instructor exists
    const instructor = await db.getInstructorById(id);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found, check the instructor id'
      });
    }

    // Get the course to extract resitExamId
    const course = await db.getCourseById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        error: 'Course not found, check the course id'
      });
    }

    // Check if the resit exam exists and has letters allowed
    const resitExam = await db.getResitExam(course.resitExamId);
    const hasLettersAllowed = resitExam?.lettersAllowed && resitExam.lettersAllowed.length > 0;
    
    if (!resitExam || !hasLettersAllowed) {
      return res.status(400).json({
        success: false,
        error: 'Resit exam not created or has no allowed letters',
        details: {
          resitExamExists: !!resitExam,
          hasLettersAllowed
        }
      });
    }

    const resitExamId = course.resitExamId;
    
    // Update the resit exam
    await db.updateResitExamByInstructor(
      resitExamId,
      course.name,
      id,
      course.department,
      lettersAllowed
    );

    return res.status(200).json({
      success: true,
      message: 'Resit exam updated successfully'
    });
  } catch (error) {
    console.error('Error updating resit exam:', error);
    return res.status(500).json({
      success: false,
      error: 'Error updating resit exam',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};




/*

export const updateStudentResitExamGrades: RequestHandler<{ id: string }> = (req, res) : any => {
  try {
    const { id } = req.params; // course id 
    const { grades } = req.body;
    
    if (!Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ error: 'Invalid grades data' });
    }

    // Validate each grade entry
    for (const grade of grades) {
      if (!grade.studentId || !grade.courseId || grade.grade === undefined || !grade.gradeLetter) {
        return res.status(400).json({ error: 'Invalid grade entry format' });
      }
    }

    const success = db.updateStudentResitExamGrades(grades);
    
    if (success) {
      return res.status(200).json({ message: 'Grades updated successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to update grades' });
    }
  } catch (error) {
    console.error('Error in updateStudentResitExamGrades:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; */


//? update a single student's resit exam results
export const updateAStudentResitExamResults: RequestHandler<{ courseId: string; studentId: string }> = async (req, res): Promise<any> => {
  try {
    const { grade, gradeLetter } = req.body;
    const { courseId, studentId } = req.params;
 
    const course = await db.getCourseById(courseId);
    if (!course || !course.resitExamId) {
      return res.status(400).json({ error: 'Course not found or does not have a resit exam ID' });
    }
    
    const resitExamId = course.resitExamId;
    
    if (!studentId || !resitExamId) {
      return res.status(400).json({ error: 'Student ID and course exam ID are required' });
    }
    
    if (grade === undefined || gradeLetter === undefined) {
      return res.status(400).json({ error: 'Grade and grade letter are required' });
    }

    // update the results
    const success = await db.updateStudentResitExamResults(studentId, resitExamId, grade, gradeLetter);
    
    if (success) {
      return res.status(200).json({ message: 'Resit exam results updated successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to update resit exam results' });
    }
  } catch (error) {
    console.error('Error in updateStudentResitExamResults:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

//? update all students' resit exam results
//! All students in the restit Exam must be in the results array
export const updateAllStudentsResitExamResults: RequestHandler<{ resitExamId: string }> = async (req, res): Promise<any> => {
  try {
    const { resitExamId } = req.params;
    const { results } = req.body;

    if (!results || !Array.isArray(results)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid results format'
      });
    }

    // validate students are enrolled in the resit exam
    const resitExam = await db.getResitExam(resitExamId);
    if (!resitExam) {
      return res.status(404).json({
        success: false,
        error: 'Resit exam not found'
      });
    }

    const success = await db.updateAllStudentsResitExamResults(resitExamId, results);
    if (success) {
      return res.status(200).json({
        success: true,
        message: 'All resit exam results updated successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to update resit exam results'
      });
    }
  } catch (error) {
    console.error('Error updating all resit exam results:', error);
    return res.status(500).json({
      success: false,
      error: 'Error updating resit exam results',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 



export const getResitExamAllResults: RequestHandler<{ resitExamId: string }> = async (req, res): Promise<any> => {
  try {
    const { resitExamId } = req.params;
    const results = await db.getResitExamAllResults(resitExamId);
    
    return res.status(200).json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error getting resit exam results:', error);
    return res.status(500).json({
      success: false,
      error: 'Error getting resit exam results',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 

