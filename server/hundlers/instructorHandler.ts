import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Instructor } from '../types';



// create an instructor
export const createInstructor: RequestHandler = (req, res) : any => {
  const { id, name, email, password, secretaryId } = req.body;
  
  // Input validation
  if (!id || !name || !email || !password || !secretaryId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      // missingFields: {
      //   id: !id,
      //   name: !name,
      //   email: !email,
      //   password: !password,
      //   secretaryId: !secretaryId
      // }
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
  const secretary = db.getSecretaryById(secretaryId);
  if (!secretary) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Secretary ID'
    });
  }

  // check if the instructor id is already in the database
  const instructor = db.getInstructorById(id);
  if (instructor) {
    return res.status(400).json({
      success: false,
      error: 'Instructor ID already exists',
      // existingInstructor: {
      //   id: instructor.id,
      //   name: instructor.name,
      //   email: instructor.email
      // }
    });
  }

  // create the instructor object in the database
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
    db.createInstructor(newInstructor);

    // Verify the instructor was created by retrieving it
    const createdInstructor = db.getInstructorById(id);
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
export const getInstructor: RequestHandler<{ id: string }> = (req, res) : any => {
  const instructor = db.getInstructorById(req.params.id);
  console.log(instructor);

  if (!instructor) {
    return res.status(404).json({ error: "Instructor not found" });
  }

  res.status(200).json(instructor);
};





// delete an instructor
export const deleteInstructor: RequestHandler<{ id: string}> = (req, res) => {
  const id = req.params.id;
  const secretaryId  = req.body.secretaryId;
  const instructor = db.getInstructorById(id);
  const secretary = db.getSecretaryById(secretaryId);

  // check if the secretary Id is extists and authorized
  if (!secretary) {
    throw new Error("Unauthorized secretary ID");
  }
  // check if the instructor Id is correct
  if (!instructor) {
    throw new Error("Invalid Instructor ID or not found");
  }

  // delete the instructor from the database

  db.deleteInstructor(id);
  res.status(200).json({ message: 'Instructor deleted successfully' });
};

export const updateInstructorInfo: RequestHandler<{ id: string, secretaryId: string }> = (req, res) => {
  const { id, secretaryId } = req.params;
  const { name, email, password } = req.body;

  // check if the secretary Id is extists and authorized
  if (db.getSecretaryById(secretaryId) === undefined) {
    throw new Error("Unauthorized");
  }
  // check if the instructor Id is correct
  if (db.getInstructorById(id) === undefined) {
    throw new Error("Instructor not found");
  }

  if (!name || !email || !password) {
    res.status(400).send('Missing required fields: name, email, password');
    return;
  }
  try {
    db.updateInstructor(id, name, email, password);
    res.status(200).send('Instructor information updated successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      res.status(403).send('Unauthorized to update instructor');
    } else {
      res.status(500).send('Error updating instructor information');
    }
  }

};



// assign instructor to a course
export const assignInstructorToCourse: RequestHandler = (req, res) : any => {
  const { instructorId, courseId, secretaryId } = req.body;

  // Validate required fields early
  if (!instructorId || !courseId || !secretaryId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        instructorId: !instructorId,
        courseId: !courseId,
        secretaryId: !secretaryId
      }
    });
  }

  try {
    // Get all required entities with trimmed IDs
    const instructor = db.getInstructorById(instructorId.trim());
    const secretary = db.getSecretaryById(secretaryId.trim());
    const course = db.getCourseById(courseId.trim());

    // Validate entities exist
    if (!secretary) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized Secretary ID'
      });
    }

    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found',
        instructorId: instructorId
      });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
        courseId: courseId
      });
    }

    // Check if course already has an instructor
    if (course.instructor) {
      const currentInstructor = db.getInstructorById(course.instructor);
      return res.status(400).json({
        success: false,
        error: 'Course already has an assigned instructor',
        courseId: courseId,
        currentInstructor: {
          id: currentInstructor?.id,
          name: currentInstructor?.name
        }
      });
    }

    // Assign instructor to course
    const status = db.assignInstructorToCourse(instructorId, courseId);
    if (status) {
      // Get updated course data
      const updatedCourse = db.getCourseById(courseId);
      
      return res.status(200).json({
        success: true,
        message: 'Instructor assigned to course successfully',
        course: {
          id: updatedCourse?.id,
          name: updatedCourse?.name,
          department: updatedCourse?.department,
          instructor: updatedCourse?.instructor
        },
        instructor: {
          id: instructor.id,
          name: instructor.name
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Failed to assign instructor to course'
      });
    }
  } catch (error) {
    console.error('Error assigning instructor to course:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while assigning instructor to course',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// unassign instructor from course
export const unassignInstructorFromCourse: RequestHandler = (req, res) : any => {
  const { courseId, secretaryId } = req.body;

  // Validate required fields early
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

  try {
    // Get all required entities with trimmed IDs
    const secretary = db.getSecretaryById(secretaryId.trim());
    const course = db.getCourseById(courseId.trim());

    // Validate entities exist
    if (!secretary) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized Secretary ID'
      });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
        courseId: courseId
      });
    }

    // Check if course has an instructor
    if (!course.instructor) {
      return res.status(400).json({
        success: false,
        error: 'Course does not have an assigned instructor',
        courseId: courseId
      });
    }

    // Unassign instructor from course
    const status = db.unassignInstructorFromCourse(courseId);
    if (status) {
      // Get updated course data
      const updatedCourse = db.getCourseById(courseId);
      
      return res.status(200).json({
        success: true,
        message: 'Instructor unassigned from course successfully',
        course: {
          id: updatedCourse?.id,
          name: updatedCourse?.name,
          department: updatedCourse?.department,
          instructor: null
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Failed to unassign instructor from course'
      });
    }
  } catch (error) {
    console.error('Error unassigning instructor from course:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while unassigning instructor from course',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};



// add a resit exam to an instructor
export const addResitExamToInstructor: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params; // instructor id
  const { secretaryId, resitExamId } = req.body;

  if (!secretaryId || !resitExamId || !id) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        id: !id,
        secretaryId: !secretaryId,
        resitExamId: !resitExamId
      }
    });
  }

  try {
    // Get all required entities
    const instructor = db.getInstructorById(id);
    const secretary = db.getSecretaryById(secretaryId);
    const resitExam = db.getResitExam(resitExamId, id);

    // Validate all entities exist
    if (!secretary) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized Secretary ID'
      });
    }

    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found',
        instructorId: id
      });
    }

    if (!resitExam) {
      return res.status(404).json({
        success: false,
        error: 'Resit exam not found',
        resitExamId: resitExamId
      });
    }

    // Check if the resit exam is already in the instructor's resit exams
    if (instructor.resitExams.includes(resitExamId)) {
      return res.status(400).json({
        success: false,
        error: "Resit exam already in instructor's resit exams",
        instructorId: id,
        resitExamId: resitExamId
      });
    }

    // Add the resit exam to the instructor's resit exams
    const status = db.addResitExamToInstructor(id, resitExamId);
    if (status === true) {
      // Get the updated instructor to return the latest data
      const updatedInstructor = db.getInstructorById(id);
      
      return res.status(200).json({
        success: true,
        message: 'Resit exam added to instructor successfully',
        instructor: {
          id: updatedInstructor?.id,
          name: updatedInstructor?.name,
          resitExams: updatedInstructor?.resitExams
        },
        resitExam: {
          id: resitExam.id,
          name: resitExam.name
        }
      });
    } else if (status === false) {
      return res.status(400).json({
        success: false,
        error: 'Resit exam already in instructor\'s resit exams'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Error occurred while adding resit exam'
      });
    }
  } catch (error) {
    console.error('Error adding resit exam to instructor:', error);
    return res.status(500).json({
      success: false,
      error: 'Error adding resit exam to instructor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


// unenroll instructor from course
export const unEnrollInstructorFromCourse: RequestHandler<{ id: string, courseId: string }> = (req, res) : any => {
  
    // Extract route parameters (instructor ID and course ID)
    const { id, courseId } = req.params;
    
    // Extract body parameters (e.g., secretary ID for authorization)
    const secretaryId  = req.body.secretaryId;

    //  Validate required fields early
    if (!secretaryId) {
      return res.status(400).send('Missing required field: secretaryId');
    }
    

    const instructor = db.getInstructorById(id.trim());
    console.log(instructor);
    const secretary = db.getSecretaryById(secretaryId.trim());
    console.log('--------------------------------');
    const course = db.getCourseById(courseId.trim());

    console.log(secretary);
    console.log(course);
    console.log('--------------------------------');
    try {
    //  Ensure instructor exists
    if (!instructor) return res.status(404).send('Instructor not found');

    //  Ensure secretary is authorized
    if (!secretary) return res.status(403).send('Unauthorized Secretary ID');

    //  Ensure course exists
    if (!course) return res.status(404).send('Course not found');

    //  Ensure instructor is actually assigned to the course
    if (!db.getInstructorById(id)?.courses.includes(courseId)) {
      return res.status(400).send("Instructor not assigned to the course");
    }

    // ✅ Perform the core action: Remove the course from the instructor
    db.unEnrollInstructorFromRExam(id, courseId);

    // ✅ Respond with success
    return res.status(200).send('Course removed from instructor successfully');
  } catch (error) {
    // ✅ Catch and handle unexpected errors safely
    console.error(error); // Optional: log for server-side debugging
    return res.status(500).send('Error removing course from instructor');
  }
};



// remove a resit exam from an instructor
export const unEnrollInstructorFromRExam: RequestHandler<{ id: string, resitExamId: string }> = (req, res) : any => {
  const { id, resitExamId } = req.params;
  const { secretaryId } = req.body;

  if (!secretaryId) {
    return res.status(400).send('Missing required field: secretaryId');
  }

  const instructor = db.getInstructorById(id);
  const secretary = db.getSecretaryById(secretaryId);
  const resitExam = db.getResitExam(id, resitExamId);

  try {
    // Check if the instructor exists
    if (!instructor) {
      return res.status(404).send('Instructor not found');
    }

    // Check if the secretary is authorized
    if (!secretary) {
      return res.status(403).send('Unauthorized Secretary ID');
    }

    // Check if the resit exam exists
    if (!resitExam) {
      return res.status(404).send('Resit exam not found');
    }

    // Check if the instructor is enrolled in the resit exam
    if (!instructor.resitExams.includes(resitExamId)) {
      return res.status(400).send("Instructor not enrolled in the resit exam");
    }

    // Remove the resit exam from the instructor's resit exams
    db.unEnrollInstructorFromRExam(id, resitExamId);
    return res.status(200).send('Resit exam removed from instructor successfully');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Resit exam not found') {
        return res.status(404).send('Resit exam not found');
      } else if (error.message === 'Instructor not found') {
        return res.status(404).send('Instructor not found');
      } else {
        return res.status(500).send('Error removing resit exam from instructor');
      }
    } else {
      return res.status(500).send('Error removing resit exam from instructor');
    }
  }
};


// get instructor's courses
export const getInstructorCourses: RequestHandler<{ id: string }> = (req, res) => {
  const { id } = req.params;
  const instructor = db.getInstructorById(id);
  const courses = db.getInsturctorCoursesById(id);

  if (courses) {
    res.status(200).json({ courses });
  } else {
    res.status(404).send('Instructor not found or no courses found');
  }
};


// get instructor's resit exams
export const getInstructorResitExams: RequestHandler<{ id: string }> = (req, res) => {
  const { id } = req.params;
  const instructor = db.getInstructorById(id);
  const resitExams = db.getInstructorResitExamsById(id, id);

  if (resitExams) {
    res.status(200).json({ resitExams });
  } else {
    res.status(404).send('Instructor not found or no resit exams found');
  }
};

