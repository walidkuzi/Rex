import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Instructor, InstructorCourseDetails } from '../types';



// create an instructor
export const createInstructor: RequestHandler = (req, res) : any => {
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

// update instructor information
export const updateInstructorInfo: RequestHandler<{ id: string }> = (req, res) => {
  const { id } = req.params;
  const { name, email, password, secretaryId } = req.body;

  // check if the secretary Id is extists and authorized
  if (db.getSecretaryById(secretaryId) === undefined) {
    throw new Error("Unauthorized Secretary ID");
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


// assigning instructor to a course
export const assignInstructorToCourse: RequestHandler = (req, res) : any => {
  const { id } = req.params;
  const { courseId, secretaryId } = req.body;

  console.log(id);
  // Validate required fields early
  if (!id || !courseId || !secretaryId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        id: !id,
        courseId: !courseId,
        secretaryId: !secretaryId
      }
    });
  }

  try {
    // Get all required entities with trimmed IDs
    const instructor = db.getInstructorById(id.trim());
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
        id: id
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
    const status = db.assignInstructorToCourse(id, courseId);
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

// unassigning instructor from course
export const unassignInstructorFromCourse: RequestHandler = (req, res) : any => {
  const { id } = req.params;
  const { courseId, secretaryId } = req.body;

  // Validate required fields early
  if (!courseId || !secretaryId || !id) {
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
    const instructor = db.getInstructorById(id.trim());
    const secretary = db.getSecretaryById(secretaryId.trim());
    const course = db.getCourseById(courseId.trim());

    // checking the instructor id 
    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found',
        id: id
      });
    }

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
    const status = db.unassignInstructorFromCourse(courseId, id);
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


// create a resit exam
export const createResitExam: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params; // instructor id
  const { 
    courseId,
    lettersAllowed,
    examDate,
    deadline,
    location
  } = req.body;

  // Validate required fields
  if (!courseId || !lettersAllowed || !examDate || !deadline || !location) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        courseId: !courseId,
        lettersAllowed: !lettersAllowed,
        examDate: !examDate,
        deadline: !deadline,
        location: !location,
      }
    });
  }

  

  try {
    // Validate instructor exists
    const instructor = db.getInstructorById(id);
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
    const course = db.getCourseById(courseId);
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
    db.createResitExam(
      resitExamId,
      courseId,
      name,
      department,
      id, // instructorId
      lettersAllowed,
      new Date(examDate),
      new Date(deadline),
      location
    );

    // Get the created resit exam using the resitExamId from the course
    const createdResitExam = db.getResitExam(course.resitExamId);
    if (!createdResitExam) {
      throw new Error('Failed to create resit exam');
    }

    return res.status(201).json({
      success: true,
      message: 'Resit exam created successfully',
      resitExam: {
        id: createdResitExam.id,
        name: createdResitExam.name,
        courseId: createdResitExam.courseId,
        department: createdResitExam.department,
        examDate: createdResitExam.examDate,
        deadline: createdResitExam.deadline,
        location: createdResitExam.location
      }
    });
  } catch (error) {
    console.error('Error creating resit exam:', error);
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      } else if (error.message.includes('already taken')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }
    }
    return res.status(500).json({
      success: false,
      error: 'Error creating resit exam',
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

    // Perform the core action: Remove the course from the instructor's courses
    db.unassignInstructorFromCourse(id, courseId);

    //  Respond with success
    return res.status(200).send('Course removed from instructor successfully');
  } catch (error) {
    //  Catch and handle unexpected errors safely
    console.error(error); // Optional: log for server-side debugging
    return res.status(500).send('Error removing course from instructor');
  }
};


// Delete a resit exam
export const deleteResitExam: RequestHandler<{ id: string}> = (req, res) : any => {
  const { id} = req.params;
  const { courseId } = req.body;

    // Get the course to extract resitExamId
    const course = db.getCourseById(courseId);
    if (!course || !course.resitExamId) {
      return res.status(400).json({
        success: false,
        error: 'Course not found or does not have a resit exam ID'
      });
    }


  const instructor = db.getInstructorById(id);
  const resitExamId = course?.resitExamId;

  try {
    // Check if the instructor exists
    if (!instructor) {
      return res.status(404).send('Instructor not found');
    }


    // Check if the resit exam exists
    if (!resitExamId) {
      return res.status(404).send('Resit exam not found');
    }

    // Check if the instructor is enrolled in the resit exam
    if (!instructor.resitExams.includes(resitExamId)) {
      return res.status(400).send("Instructor not enrolled in the resit exam");
    }

    // Remove the resit exam from the instructor's resit exams
    db.deleteResitExam(id, instructor.id, resitExamId);
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


// get instructor's course or courses
// this from the instructor's dashboard
// /instructor/courses/:id
export const getInstructorCourses: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params;
  const instructor = db.getInstructorById(id);
  const courses = db.getInsturctorCourses(id);

  if (!instructor) {
    return res.status(404).json({ error: "Instructor not found" });
  }

  if (courses) {
    res.status(200).json({ courses });
  } else {
    res.status(404).send('Instructor not found or no courses found');
  }
};


// get instructor's resit exams
export const getInstructorResitExams: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params;
  const instructor = db.getInstructorById(id);
  const resitExams = db.getInstructorResitExams(id);
  
  if (!instructor) {
    return res.status(404).json({ error: "Instructor not found" });
  }

  if (resitExams) {
    res.status(200).json({ resitExams });
  } else {
    res.status(404).send('Instructor not found or no resit exams found');
  }
};

export const getInstructorCourseDetails = (req: Request, res: Response) : any => {
  
  try {
    const { id } = req.params;
    const courseDetails = db.getInstructorCourseDetails(id);
    
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
export const updateResitExam: RequestHandler<{ id: string }> = (req, res) : any => {
  const { id } = req.params; // instructor id
  const { 
    courseId,
    lettersAllowed,
    examDate,
    deadline,
    location
  } = req.body;

  // Validate required fields
  if (!courseId || !lettersAllowed || !examDate || !deadline || !location) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        courseId: !courseId,
        lettersAllowed: !lettersAllowed,
        examDate: !examDate,
        deadline: !deadline,
        location: !location,
      }
    });
  }

  try {
    // Validate instructor exists
    const instructor = db.getInstructorById(id);
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

    // Get the course to extract resitExamId and other details
    const course = db.getCourseById(courseId);
    if (!course || !course.resitExamId) {
      return res.status(400).json({
        success: false,
        error: 'Course not found or does not have a resit exam ID'
      });
    }

    // get the name and department from the course
    const name = course.name;
    const department = course.department;
    const resitExamId = course.resitExamId;

    // Update the resit exam
    db.updateResitExam(
      resitExamId,
      name,
      id,
      department,
      lettersAllowed,
      new Date(examDate),
      new Date(deadline),
      location
    );

    // Get the updated resit exam
    const updatedResitExam = db.getResitExam(resitExamId);
    if (!updatedResitExam) {
      throw new Error('Failed to update resit exam');
    }

    return res.status(200).json({
      success: true,
      message: 'Resit exam updated successfully',
      resitExam: {
        id: updatedResitExam.id,
        name: updatedResitExam.name,
        courseId: updatedResitExam.courseId,
        department: updatedResitExam.department,
        examDate: updatedResitExam.examDate,
        deadline: updatedResitExam.deadline,
        location: updatedResitExam.location
      }
    });
  } catch (error) {
    console.error('Error updating resit exam:', error);
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      } else if (error.message.includes('already taken')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }
    }
    return res.status(500).json({
      success: false,
      error: 'Error updating resit exam',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};