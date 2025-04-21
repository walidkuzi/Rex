import { datastore } from "..";
import { Course, Secretary, ResitExam, Instructor, Student, User } from "../../types";

export class inMemoryDatastore implements datastore {

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

  private instructor: Instructor[] = [];
  private resitExam: ResitExam[] = [];
  private course: Course[] = [];



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
  createStudent(id: string, secretaryId: string, stdname: string, stdEmail: string, stdPasswerd: string): void {
    const newStudent: Student = {
      id: id,
      name: stdname,
      email: stdEmail,
      password: "",
      courses: [],
      resitExams: [],
      createdAt: new Date(),
      createdBy: "",
      updatedAt: new Date()
    }
    this.student.push(newStudent);
  }


  deleteStudent(id: string, secretary: string): void {
    // Check if the secretary Id is extists and authorized
    if (this.getSecretaryById(secretary) === undefined) {
      throw new Error("Unauthorized");
    }

    const index = this.student.findIndex(student => student.id === id);
    if (index !== -1) {
      this.student.splice(index, 1);
    }
  }


  updateStudentInfo(id: string, name: string, email: string, password: string, secretaryId: string): void {
    if (this.getSecretaryById(secretaryId) === undefined) {
      throw new Error("Unauthorized");
    }
    
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


  addCourseToStudent(studentId: string, courseId: string, secretaryId: string): void {
    // Check if the secretary Id is extists 
    if (this.getCourseById(courseId) === undefined) {
      throw new Error("Course not found");
    }
    // Check if the student Id is extists
    if (this.getStudentById(studentId) === undefined) {
      throw new Error("Student not found");
    }

    const student = this.getStudentById(studentId);
    if (student) {
      student.courses.push(courseId);
    }
  }


  addRistExamToStudent(studentId: string, resitExamId: string): void {  
    // check if the ResitExam Id is correct
    if (this.getResitExam(studentId, resitExamId) === undefined) {
      throw new Error("Resit exam not found");
    }

    const student = this.getStudentById(studentId);
    if (student) {    
      student.resitExams.push(resitExamId);
    }
  }

  
  removeStudentFromCourse(studentId: string, courseId: string, secretaryId: string): void {
    // Check if the secretary Id is extists and authorized
    if (this.getSecretaryById(secretaryId) === undefined) {
      throw new Error("Unauthorized");
    }
    // Check if the course Id is extists
    if (this.getCourseById(courseId) === undefined) {
      throw new Error("Course not found");
    } 
    // Check if the student Id is extists
    if (this.getStudentById(studentId) === undefined) {
      throw new Error("Student not found");
    }

    const student = this.getStudentById(studentId);
    if (student) {
      const index = student.courses.indexOf(courseId);
      if (index !== -1) {
        student.courses.splice(index, 1);
      }
    }
  }


  removeStudentFromResitExamFrom(studentId: string, resitExamId: string): void { 
    // Check if the ResitExam Id is extists
    if (this.getResitExam(studentId, resitExamId) === undefined) {
      throw new Error("Resit exam not found");
    }
    // Check if the student Id is extists
    if (this.getStudentById(studentId) === undefined) {
      throw new Error("Student not found");
    }

    const student = this.getStudentById(studentId);
    if (student) {  
      const index = student.resitExams.indexOf(resitExamId);
      if (index !== -1) {
        student.resitExams.splice(index, 1);
      }
    }
  }


  getStudent_ResitExamsById(id: string): string[] | undefined {
    const student = this.student.find(student => student.id === id);
    if (student) {
      return student.resitExams;
    }
    return undefined;

  }

  getStudentById(id: string): Student | undefined {
    return this.student.find(student => student.id === id);
  }


  getStudentCoursesByID(id: string): string[] | undefined {
    const student = this.student.find(student => student.id === id);
    if (student) {
      return student.courses;
    }
    return undefined;
  }



 




  //? Instructor DAO implementation
  createInstructor(id: string, name : string, email: string, password: string ,secretaryId: string): void {
    // check if the secretary Id is extists and authorized
    if (this.getSecretaryById(secretaryId) === undefined) {
      throw new Error("Unauthorized");
    }
    const newInstructor: Instructor = {
      id: id,
      name: name,
      email: email,
      password: password,
      courses: [],
      resitExams: [],
      createdAt: new Date(),
      createdBy: secretaryId,
      updatedAt: new Date() 

    }
  }


  getInstructorById(id: string): Instructor | undefined {
    //check if the instructor Id is correct
    if (this.getInstructorById(id) === undefined) {
      throw new Error("Instructor not found");
    }

    return this.instructor.find(instructor => instructor.id === id);
  }


  deleteInstructor(id: string, secretaryId: string): void {
    // check if the secretary Id is extists and authorized
    if (this.getSecretaryById(secretaryId) === undefined) {
      throw new Error("Unauthorized");
    }
    // check if the instructor Id is correct
    if (this.getInstructorById(id) === undefined) {
      throw new Error("Instructor not found");
    }
    const index = this.instructor.findIndex(instructor => instructor.id === id);
    if (index !== -1) {
      this.instructor.splice(index, 1);
    }
  }


  updateInstructor(id: string, name : string, email: string, password: string ,secretaryId: string): void {  
    // check if the secretary Id is extists and authorized
    if (this.getSecretaryById(secretaryId) === undefined) {
      throw new Error("Unauthorized");
    }
    // check if the instructor Id is correct
    if (this.getInstructorById(id) === undefined) {
      throw new Error("Instructor not found");
    }
    
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




  //? Course DAO implementation
  createCourse(courseId: string, cName: string, department: string  , secretaryId: string): void {
    // check if the secretary Id is extists and authorized
    if (this.getSecretaryById(secretaryId) === undefined) {
      throw new Error("Unauthorized secretary ID");
    }
    // check if the Course Id not taken
    if (this.getCourseById(secretaryId) === undefined) {
      throw new Error("Invalid Course Id");
    }
    
    // Create a new course object with the provided parameters
    const newCourse: Course = {
      id: courseId,
      name: cName,
      department: department,
      createdBy: secretaryId,
      instructor: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.course.push(newCourse);
  }

  
  // all course properties
  getCourseById(id: string): Course | undefined {
    // check if the Course Id is extists
    if (this.getCourseById(id) === undefined) {
      throw new Error("Course not found");
    }
    // return the course object with the matching ID 
    return this.course.find(course => course.id === id);
  }


  // only instructor name
  getCourseInstructor(id: string): string | undefined {
    // check if the Course Id is extists
    if (this.getCourseById(id) === undefined) {
      throw new Error("Course not found");
    }
    return this.course.find(course => course.id === id)?.instructor;
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

    const index = this.course.findIndex(course => course.id === id);
    if (index !== -1) {
      this.course.splice(index, 1);
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
    const index = this.course.findIndex(course => course.id === id);
    if (index !== -1) {
      this.course[index] = { 
        ...this.course[index], 
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
    if (this.resitExam.some(resitExam => resitExam.id === id)) {
      throw new Error("ResitExam Id already taken");
    }
    // check if the ResitExam Date not taken
    if (this.resitExam.some(resitExam => resitExam.examDate.getTime() === examDate.getTime())) {
      throw new Error("ResitExam Date already taken");
    }
    // check if the location is avilable and not empty
    if (this.resitExam.some(resitExam => resitExam.location === location)) {
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
      addedAt: new Date(),
      updatedAt: new Date() 
    };
    
    this.resitExam.push(completeResitExam);
  }


  getResitExam(id: string, instructorID: string): ResitExam | undefined {
    // check if the ResitExam Id is extists and instructor Id is correct
    return this.resitExam.find(resitExam => resitExam.id === id && resitExam.instructor === instructorID);
  }


  deleteResitExam(id: string, instructorID: string, secretaryId: string): void {
    // check if the secretary Id is extists and authorized
    if (this.getSecretaryById(secretaryId) === undefined) {
      throw new Error("Unauthorized Secretary ID");
    }
    const index = this.resitExam.findIndex(resitExam => resitExam.id === id && resitExam.instructor === instructorID);
    if (index !== -1) {
      this.resitExam.splice(index, 1);
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
    const index = this.resitExam.findIndex(resitExam => resitExam.id === id);
    if (index === -1) {
      throw new Error(`Update failed: ResitExam with ID ${id} not found.`);
    }
    // Get a reference to the original exam object
    const originalExam = this.resitExam[index];

    // 3. Validate Inputs (New Values)
    // Check if the NEW instructor Id exists
    // IMPORTANT: Using direct array find due to potential recursion in your getInstructorById. Fix getInstructorById!
    if (!this.instructor.find(inst => inst.id === instructorID)) {
        throw new Error(`Update failed: Instructor with ID ${instructorID} not found`);
    }

    // Check if the NEW Date/Location combination conflicts with *other* exams
    const conflictingExam = this.resitExam.find(exam =>
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
    this.resitExam[index] = {
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
    return this.resitExam.filter(resitExam => resitExam.instructor === instructorId);

  }

  getResitExamsByStudentId(studentId: string): ResitExam[] {
    // check if the student Id is extists
    if (this.getStudentById(studentId) === undefined) {
      throw new Error("Student not found");
    }
    return this.resitExam.filter(resitExam => resitExam.students.includes(studentId));
  }


}
