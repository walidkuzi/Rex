import { datastore } from "..";
import { Course, Secretary, ResitExam, Instructor, Student } from "../../types";

export class inMemoryDatastore implements datastore {

  // tmp secretary employees
  private secretary: Secretary[] = [
    {
      id: "sec-001",
      name: "Fatima Ibrahim",
      especialId: "ESP001",
      email: "fatima.ibrahim@example.com",
      password: "secret123"
    },
    {
      id: "sec-002",
      name: "Mohamed Yusuf",
      especialId: "ESP002",
      email: "mohamed.yusuf@example.com",
      password: "secret456"
    }
  ];
  
// tmp students 
  private student: Student[] = [  {
    id: "001",
    name: "Yusuf A",
    email: "Yusuf@example.com",
    password: "password123",
    courses: ["course-101", "course-102"],
    resitExams: ["resit-001"],
    createdAt: new Date(),
    createdBy: "admin123",
    updatedAt: new Date()
  },
  {
    id: "002",
    name: "Ali Muhmmad",
    email: "ali@example.com",
    password: "pass123",
    courses: ["course-201", "course-102"],
    resitExams: ["resit-001"],
    createdAt: new Date(),
    createdBy: "admin14",
    updatedAt: new Date()

  }
];

  // tmp instructors
  private instructor: Instructor[] = [
    {
      id: "inst-001",
      name: "Mohamed Saleh",
      email: "mohamed.saleh@example.com",
      password: "password123",
      courses: ["course-101", "course-102"],
      resitExams: ["resit-001"],
      createdAt: new Date(),
      createdBy: "sec-001",
      updatedAt: null
    }
  ];

  // tmp resit exams
  private resitExams: ResitExam[] = [{
    id: "resit-001",
    name: "Resit Exam 1",
    department: "Software Engineering",
    instructor: "inst-001",
    lettersAllowed: ["A", "B", "C"],
    examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days in ms after today
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days in ms after today
    location: "Altenizde Main Kampus A Blcok A Nirmen Tahran",
    students: [],
    createdAt: new Date(),
    createdBy: "sec-001",
    updatedAt: null
  }];
  private courses: Course[] = [{
    id: "course-101",
    name: "Introduction to Software Engineering",
    department: "Software Engineering",
    students: ["001", "002"], // must be added not created | added from Course students
    instructor: "inst-001",
    createdBy: "sec-001",
    createdAt: new Date(),
    updatedAt: null,
  }];



  //? Secretary DAO implementation - only get not create
  getSecretaryById(id: string): Secretary | undefined {
    return this.secretary.find(secretary => secretary.id === id);
  }

  getSecretaryByEspecialId(id: string): Secretary | undefined {
    return this.secretary.find(secretary => secretary.especialId === id);
  }

  getSecretaryByEmail(email: string): Secretary | undefined {
    return this.secretary.find(secretary => secretary.email === email);
  }




  //? Student DAO implementation
  createStudent(student: Student): void {
    this.student.push(student);
  }


  deleteStudent(id: string, secretary: string): boolean {


    const index = this.student.findIndex(student => student.id === id);
    if (index !== -1) {
      this.student.splice(index, 1);
      return true;
    }
    return false;
  }


  updateStudentInfo(id: string, name: string, email: string, password: string, secretaryId: string): void {

    
    const index = this.student.findIndex(student => student.id === id);
    if (index !== -1) {
      this.student[index] = {
        ...this.student[index],
        name: name,
        email: email,
        password: password,
        updatedAt: new Date()
      };
    }
  }


  addCourseToStudent(studentId: string, courseId: string): boolean  {
    // determine which student to add the course to
   const student = this.getStudentById(studentId);
    if (student) {
      student.courses.push(courseId);
      const status = student.courses.includes(courseId);
      if (status) {
        return true;
      }
    }
    return false;
  }


  addRistExamToStudent(studentId: string, resitExamId: string): boolean {  


    const student = this.getStudentById(studentId);
    if (student) {    
      student.resitExams.push(resitExamId);
      return true;
    }
    return false;
  }

  
  removeStudentFromCourse(studentId: string, courseId: string): boolean {
    const courseIndex = this.courses.findIndex(c => c.id === courseId);
    const student = this.getStudentById(studentId);
    
    if (courseIndex === -1 || !student) return false;

    // Remove student from course's student list
    const studentIndex = this.courses[courseIndex].students.indexOf(studentId);
    if (studentIndex !== -1) {
      this.courses[courseIndex].students.splice(studentIndex, 1);
      
      // Remove course from student's course list
      const studentCourseIndex = student.courses.indexOf(courseId);
      if (studentCourseIndex !== -1) {
        student.courses.splice(studentCourseIndex, 1);
      }
      
      return true;
    }
    return false;
  }


  removeStudentFromResitExamFrom(studentId: string, resitExamId: string): void {
    const student = this.getStudentById(studentId); // 🔍 fetch student
    if (student) {
      const index = student.resitExams.indexOf(resitExamId); // 🔍 find resitExam
      if (index !== -1) {
        student.resitExams.splice(index, 1); // 🧹 remove exam
      }
    }
  }
  


  getAstudent(id: string): Student | undefined {
    const student = this.student.find(student => student.id === id);
    if (student) {
      return student;
    }
    return undefined;

  }

  getStudentById(id: string): Student | undefined {
    return this.student.find(student => student.id === id);
  }


  getStudentCourses(id: string): string[] | undefined {
    const student = this.student.find(student => student.id === id);
    if (student) {
      return student.courses;
    }
    return undefined;
  }



 




  //? Instructor DAO implementation
  createInstructor(instructor: Instructor): void {
    this.instructor.push(instructor);
  }

  getInstructorById(id: string): Instructor | undefined {
    return this.instructor.find(i => i.id === id);
  }


  deleteInstructor(id: string): void {

    const index = this.instructor.findIndex(instructor => instructor.id === id);
    if (index !== -1) {
      this.instructor.splice(index, 1);
    }
  }


  updateInstructor(id: string, name: string, email: string, password: string): void {  

    
    const index = this.instructor.findIndex(instructor => instructor.id === id);
    if (index !== -1) {
      this.instructor[index] = { 
        ...this.instructor[index], 
        name, 
        email, 
        password,
        updatedAt: new Date() 
      };
    }
  }


  getInsturctorCoursesById(courseId: string): string[] {
    // check if the Instructor Id is extists
    if (this.getInstructorById(courseId) === undefined) {
      throw new Error("Instructor not found");
    }
    return this.instructor.filter(instructor => instructor.courses.includes(courseId)).map(instructor => instructor.id);
  }


  getInstructorResitExamsById(id: string, resitExamId: string): string[] {
    // check if the Instructor Id is extists
    if (this.getInstructorById(id) === undefined) {
      throw new Error("Instructor not found");
    }
    // check if the ResitExam Id is extists
    if (this.getResitExam(id, resitExamId) === undefined) {
      throw new Error("Resit exam not found");
    }
    return this.instructor.filter(instructor => 
      instructor.resitExams.some(exam => exam === resitExamId)
    ).map(instructor => instructor.id);
  }


  addCourseToInstructor(id: string, courseId: string): boolean {
    // determine which instructor to add the course to
    const instructor = this.getInstructorById(id);
    if (instructor) {
      instructor.courses.push(courseId);
      const status = instructor.courses.includes(courseId);
      if (status) {
        return true;
      }
    }
    return false;
  }



  addResitExamToInstructor(id: string, resitExamId: string): boolean {
    const instructor = this.getInstructorById(id);
    if (instructor) {
      instructor.resitExams.push(resitExamId);
      const status = instructor.resitExams.includes(resitExamId);
      if (status) {
        return true;
      }
    }
    return false;
  } 


  // removeCourseFromInstructor(id: string, courseId: string): void {
  //   // determine which instructor to remove the course from
  //   const instructor = this.getInstructorById(id);
  //   if (instructor) {  
  //     const index = instructor.courses.indexOf(courseId);
  //     if (index !== -1) {
  //       instructor.courses.splice(index, 1);
  //     }
  //   }
  // }


  unEnrollInstructorFromRExam(id: string, courseId: string): void {
  //  Trim input to avoid issues caused by leading/trailing whitespace
  const cleanId = id.trim();
  const cleanCourseId = courseId.trim();

  // Retrieve instructor by ID
  const instructor = this.getInstructorById(cleanId);

  // Proceed only if instructor exists and their courses property is a valid array
  if (instructor && Array.isArray(instructor.courses)) {

    //  Find the index of the course to be removed from the courses list
    const index = instructor.courses.indexOf(cleanCourseId);

    // Only remove if the course exists in the array
    if (index !== -1) {
      instructor.courses.splice(index, 1); // Removes the course at the found index
    }
  }

}



  // removeResitExamFromInstructor(id: string, resitExamId: string): boolean {
  //   const instructor = this.getInstructorById(id);
  //   if (instructor) {
  //     instructor.resitExams.splice(instructor.resitExams.indexOf(resitExamId), 1);
  //     return true;
  //   }
  //   return false;
  // }


//? Course DAO implementation
  createCourse(courseId: string, cName: string, department: string  , secretaryId: string): void {

    
    // Create a new course object with the provided parameters
    const newCourse: Course = {
      id: courseId,
      name: cName,
      department: department,
      createdBy: secretaryId,
      students: [],              // must be added not created | added from Course students
      instructor: "",            // must be added not created | added from Course instructor
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.courses.push(newCourse);
  }

  
  // all course properties
  getCourseById(id: string): Course | undefined {

    // return the course object with the matching ID 
    return this.courses.find(course => course.id === id);
  }


  // only instructor id
  getCourseInstructor(id: string): string | undefined {
    // check if the Course Id is extists
    if (this.getCourseById(id) === undefined) {
      throw new Error("Course not found");
    }
    return this.courses.find(course => course.id === id)?.instructor;
  }


  listCourseStudents(id: string): string[] | undefined {
    // check if the Course Id is extists
    if (this.getCourseById(id) === undefined) {
      throw new Error("Course not found");
    }
    //! need to be checked again
    return this.student.filter(student => student.courses.includes(id)).map(student => student.id);
  }


  deleteCourse(id: string, secretaryId: string): void {
    // check if the secretary Id is extists and authorized
    if (this.getSecretaryById(secretaryId) === undefined) {
      throw new Error("Unauthorized");
    }

    // check if the Course Id is extists
    if (this.getCourseById(id) === undefined) {
      throw new Error("Course not found");
    }

    const index = this.courses.findIndex(course => course.id === id);
    if (index !== -1) {
      this.courses.splice(index, 1);
    }
  }


  updateCourse(id: string, name: string, instructor: string, department: string ,secretaryId: string): void {  
    // check if the secretary Id is extists and authorized
    if (this.getSecretaryById(secretaryId) === undefined) {
      throw new Error("Unauthorized");
    }
    // check if the Course Id is extists
    if (this.getCourseById(id) === undefined) {
      throw new Error("Course not found");
    }
    const index = this.courses.findIndex(course => course.id === id);
    if (index !== -1) {
      this.courses[index] = { 
        ...this.courses[index], 
        name, 
        instructor, 
        department 
      };
    }
  }



  //? ResitExam DAO implementation
  createResitExam(id: string, name: string, department: string, isntructorId: string, lettersAllowed: string[], examDate: Date, deadline: Date, location: string, secretaryId: string): void{
    // check if the secretary Id is extists and authorized
    if (this.getSecretaryById(secretaryId) === undefined) {
      throw new Error("Unauthorized Secretary ID");
    }
    // check if the instructor Id is extists
    if (this.getInstructorById(isntructorId) === undefined) {
      throw new Error("Instructor ID not found");
    }
    // check if the ResitExam Id is already taken
    if (this.resitExams.some(resitExam => resitExam.id === id)) {
      throw new Error("ResitExam Id already taken");
    }
    // check if the ResitExam Date not taken
    if (this.resitExams.some(resitExam => resitExam.examDate.getTime() === examDate.getTime())) {
      throw new Error("ResitExam Date already taken");
    }
    // check if the location is avilable and not empty
    if (this.resitExams.some(resitExam => resitExam.location === location)) {
      throw new Error("ResitExam location already taken");
    }
    // check if the ResitExam lettersAllowed is not empty
    if (lettersAllowed.length === 0) {
      throw new Error("ResitExam lettersAllowed is empty");
    }
    // check if the ResitExam deadline is not empty
    if (deadline === undefined) {
      throw new Error("ResitExam deadline is empty");
    }
    // check if the ResitExam department is not empty
    if (department === undefined) {
      throw new Error("ResitExam department is empty");
    }
    // check if the ResitExam name is not empty
    if (name === undefined) {
      throw new Error("ResitExam name is empty");
    }
    // check if the ResitExam Instructor is correct and not empty
    if (isntructorId === undefined) {
      throw new Error("ResitExam instructor is empty");
    }
    // check if the ResitExam ID is not empty
    if (id === undefined) {
      throw new Error("ResitExam ID is empty");
    }
    
    
    // Create a complete ResitExam object with all required properties
    const completeResitExam: ResitExam = {
      id,
      name,
      department,
      instructor: isntructorId,
      lettersAllowed,
      examDate,
      deadline,
      location,
      students: [],
      createdAt: new Date(),
      createdBy: isntructorId,
      updatedAt: new Date() 
    };
    
    this.resitExams.push(completeResitExam);
  }


  getResitExam(id: string, instructorID: string): ResitExam | undefined {
    
    return this.resitExams.find(resitExam => resitExam.id === id && resitExam.instructor === instructorID);
  }


  deleteResitExam(id: string, instructorID: string, secretaryId: string): void {
    // check if the secretary Id is extists and authorized
    if (this.getSecretaryById(secretaryId) === undefined) {
      throw new Error("Unauthorized Secretary ID");
    }
    const index = this.resitExams.findIndex(resitExam => resitExam.id === id && resitExam.instructor === instructorID);
    if (index !== -1) {
      this.resitExams.splice(index, 1);
    }
  }
  
  // updateResitExam(id: string, name: string, instructorID: string, department: string, Letters: string[], examDate: Date, deadline: Date, location: string, secretaryId: string): void{
  //   // check if the secretary Id is extists and authorized
  //   if (this.getSecretaryById(secretaryId) === undefined) {
  //     throw new Error("Unauthorized Secretary ID");
  //   }
  //   // check if the instructor Id is extists
  //   if (this.getInstructorById(instructorID) === undefined) {
  //     throw new Error("Instructor ID not found");
  //   }
  //   // check if the ResitExam Id is already taken
  //   if (this.resitExam.some(resitExam => resitExam.id === id)) {
  //     throw new Error("ResitExam Id already taken");
  //   }
  //   // check if the ResitExam Date not taken
  //   if (this.resitExam.some(resitExam => resitExam.examDate.getTime() === examDate.getTime())) {
  //     throw new Error("ResitExam Date already taken");
  //   }
  //   // check if the location is avilable and not empty
  //   if (this.resitExam.some(resitExam => resitExam.location === location)) {
  //     throw new Error("ResitExam location already taken");
  //   }
  //   // check if the ResitExam lettersAllowed is not empty
  //   if (Letters.length === 0) {
  //     throw new Error("ResitExam lettersAllowed is empty");
  //   }
  //   // check if the ResitExam deadline is not empty
  //   if (deadline === undefined) {
  //     throw new Error("ResitExam deadline is empty");
  //   }
  //   // check if the ResitExam department is not empty
  //   if (department === undefined) {
  //     throw new Error("ResitExam department is empty");
  //   }
  //   // check if the ResitExam name is not empty
  //   if (name === undefined) {
  //     throw new Error("ResitExam name is empty");
  //   }
  //   // check if the ResitExam Instructor is correct and not empty
  //   if (instructorID === undefined) {
  //     throw new Error("ResitExam instructor is empty");
  //   }
  //   // check if the ResitExam ID is not empty
  //   if (id === undefined) {
  //     throw new Error("ResitExam ID is empty");
  //   }
    
  //   // 
  //   // const completeResitExam: ResitExam = {
  //   //   id,
  //   //   name,
  //   //   department,
  //   //   instructor: instructorID,
  //   //   Letters,
  //   //   examDate,
  //   //   deadline,
  //   //   location,
  //   //   students: [],
  //   //   createdAt: new Date(),
  //   //   createdBy: instructorID,
  //   //   addedAt: new Date()
  //   // };
    
  //   // this.resitExam.push(completeResitExam);

  //      // 4. Perform the Update
  //      this.resitExam[index] = {
  //       ...originalExam, // Keep unchanged fields like id, name, students, createdAt, createdBy, addedAt
  //       instructor: instructorID, // Update instructor
  //       department: department,   // Update department
  //       lettersAllowed: Letters,  // Update allowed letters
  //       examDate: examDate,       // Update exam date
  //       deadline: deadline,       // Update deadline
  //       location: location,       // Update location
  //       updatedAt: new Date()     // Add or update the 'updatedAt' timestamp
  //     };

  //   const index = this.resitExam.findIndex(resitExam => resitExam.id === id);
  //   if (index !== -1) {
  //     // Assuming we want to update the instructor field
  //     this.resitExam[index] = { 
  //       ...this.resitExam[index], 
  //       instructor: instructorID 

        
  //     };
  //   }
  // }


  updateResitExam(id: string, name: string, instructorID: string, department: string, Letters: string[], examDate: Date, deadline: Date, location: string, secretaryId: string): void {
    // 1. Authorization Check: Ensure the secretary is valid
    if (!this.getSecretaryById(secretaryId)) { // Use direct check
      throw new Error("Unauthorized Secretary ID");
    }

    // 2. Find the Exam to Update
    const index = this.resitExams.findIndex(resitExam => resitExam.id === id);
    if (index === -1) {
      throw new Error(`Update failed: ResitExam with ID ${id} not found.`);
    }
    // Get a reference to the original exam object
    const originalExam = this.resitExams[index];

    // 3. Validate Inputs (New Values)
    // Check if the NEW instructor Id exists
    // IMPORTANT: Using direct array find due to potential recursion in your getInstructorById. Fix getInstructorById!
    if (!this.instructor.find(inst => inst.id === instructorID)) {
        throw new Error(`Update failed: Instructor with ID ${instructorID} not found`);
    }

    // Check if the NEW Date/Location combination conflicts with *other* exams
    const conflictingExam = this.resitExams.find(exam =>
        exam.id !== id && // Must not be the exam we are currently updating
        exam.examDate.getTime() === examDate.getTime() &&
        exam.location === location
    );
    if (conflictingExam) {
        throw new Error(`Update failed: Another ResitExam (ID: ${conflictingExam.id}) is already scheduled at location '${location}' for the specified date/time.`);
    }

    // Check if other required fields are provided and seem valid
    if (!name) { // Check for null/undefined/empty string
        throw new Error("Update failed: ResitExam name cannot be empty");
    }
    if (!department) { // Check for null/undefined/empty string
        throw new Error("Update failed: ResitExam department cannot be empty");
    }
    if (!Letters || Letters.length === 0) { // Check for null/undefined/empty array
        throw new Error("Update failed: ResitExam lettersAllowed cannot be empty");
    }
    if (!examDate) { // Check for null/undefined Date object
        throw new Error("Update failed: ResitExam examDate cannot be empty");
    }
    if (!deadline) { // Check for null/undefined Date object
        throw new Error("Update failed: ResitExam deadline cannot be empty");
    }
    if (!location) { // Check for null/undefined/empty string
        throw new Error("Update failed: ResitExam location cannot be empty");
    }
    // instructorID validity checked above
    // id validity checked by findIndex


    // 4. Perform the Update
    // Create the updated exam object using spread syntax and new values
    this.resitExams[index] = {
      ...originalExam, // Keep unchanged fields (students, createdAt, createdBy, addedAt etc.)
      name: name,               // Update name
      instructor: instructorID, // Update instructor
      department: department,   // Update department
      lettersAllowed: Letters,  // Update allowed letters
      examDate: examDate,       // Update exam date
      deadline: deadline,       // Update deadline
      location: location,       // Update location
      updatedAt: new Date()     // Add or update the 'updatedAt' timestamp
    };

    // The logic block you had at the end finding the index again and only updating instructor
    // was redundant and incorrect, it has been removed and incorporated correctly above.
  }


  getResitExamsByInstructorId( instructorId: string): ResitExam[] {
    // check if the instructor Id is extists
    if (this.getInstructorById(instructorId) === undefined) {
      throw new Error("Instructor not found");
    }
    return this.resitExams.filter(resitExam => resitExam.instructor === instructorId);

  }

  getStudentResitExams(studentId: string): ResitExam[] {
    // check if the student Id is extists
    if (this.getStudentById(studentId) === undefined) {
      throw new Error("Student not found");
    }
    return this.resitExams.filter(resitExam => resitExam.students.includes(studentId));
  }

  // Assign instructor to course
  assignInstructorToCourse(instructorId: string, courseId: string): boolean {
    const courseIndex = this.courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return false;

    // Update the course with the new instructor
    this.courses[courseIndex] = {
      ...this.courses[courseIndex],
      instructor: instructorId,
      updatedAt: new Date()
    };

    return true;
  }

  // Unassign instructor from course
  unassignInstructorFromCourse(courseId: string): boolean {
    const courseIndex = this.courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return false;

    // Remove instructor from course
    this.courses[courseIndex] = {
      ...this.courses[courseIndex],
      instructor: undefined,
      updatedAt: new Date()
    };

    return true;
  }

  // Add student to course
  addStudentToCourse(studentId: string, courseId: string): boolean {
    const courseIndex = this.courses.findIndex(c => c.id === courseId);
    const student = this.getStudentById(studentId);
    
    if (courseIndex === -1 || !student) return false;

    // Add student to course's student list if not already there
    if (!this.courses[courseIndex].students.includes(studentId)) {
      this.courses[courseIndex].students.push(studentId);
      
      // Add course to student's course list if not already there
      if (!student.courses.includes(courseId)) {
        student.courses.push(courseId);
      }
      
      return true;
    }
    return false;
  }

  // Get all students in a course
  getStudentsInCourse(courseId: string): Student[] {
    const course = this.getCourseById(courseId);
    if (!course) return [];

    return this.student.filter(student => course.students.includes(student.id));
  }

  // Get all courses for a student
  getCoursesForStudent(studentId: string): Course[] {
    const student = this.getStudentById(studentId);
    if (!student) return [];

    return this.courses.filter(course => student.courses.includes(course.id));
  }

  // Get all courses for an instructor
  getCoursesForInstructor(instructorId: string): Course[] {
    return this.courses.filter(course => course.instructor === instructorId);
  }

  // Get instructor of a course
  getCourseInstructorDetails(courseId: string): Instructor | undefined {
    const course = this.getCourseById(courseId);
    if (!course || !course.instructor) return undefined;

    return this.getInstructorById(course.instructor);
  }

  // Update course details
  updateCourseDetails(
    courseId: string,
    updates: {
      name?: string;
      department?: string;
      instructor?: string;
    },
    secretaryId: string
  ): boolean {
    // Verify secretary authorization
    if (!this.getSecretaryById(secretaryId)) return false;

    const courseIndex = this.courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return false;

    // If changing instructor, verify new instructor exists
    if (updates.instructor && !this.getInstructorById(updates.instructor)) {
      return false;
    }

    // Update the course
    this.courses[courseIndex] = {
      ...this.courses[courseIndex],
      ...updates,
      updatedAt: new Date()
    };

    return true;
  }

  //?? IF NEEDED:

  // Get course statistics 
  getCourseStats(courseId: string): {
    totalStudents: number;
    hasInstructor: boolean;
    department: string;
    createdAt: Date;
    lastUpdated: Date | null;
  } | undefined {
    const course = this.getCourseById(courseId);
    if (!course) return undefined;

    return {
      totalStudents: course.students.length,
      hasInstructor: !!course.instructor,
      department: course.department,
      createdAt: course.createdAt,
      lastUpdated: course.updatedAt
    };
  }

}
