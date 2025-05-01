import { Datastore } from "..";
import { Course, Secretary, ResitExam, Instructor, Student, StudentCourseGrade, StudentCourseDetails, InstructorCourseDetails, ResitExamResponse } from "../../types";

  export class inMemoryDatastore implements Datastore {

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
    courses: ["course-101"],
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
    courses: ["course-101"],
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
      courses: ["course-101"],
      resitExams: ["resit-001"],
      createdAt: new Date(),
      createdBy: "sec-001",
      updatedAt: null
    }
  ];

  // tmp resit exams
  private resitExams: ResitExam[] = [{
    id: "resit-001",
    courseId: "course-101",
    name: "Resit Exam 1",
    department: "Software Engineering",
    instructors: ["inst-001"],
    lettersAllowed: ["CD", "DD", "FF", "FD"],
    examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days in ms after today
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days in ms after today
    location: "Altenizde Main Kampus A Blcok A Nirmen Tahran",
    students: ["001", "002"],
    createdAt: new Date(),
    createdBy: "sec-001",
    updatedAt: null
  }];
  private courses: Course[] = [{
    id: "course-101",
    name: "Introduction to Software Engineering",
    resitExamId: "resit-001",
    department: "Software Engineering",
    students: ["001", "002"], // must be added not created 
    instructor: "inst-001",
    createdBy: "sec-001",
    createdAt: new Date(),
    updatedAt: null,
  }];

  // tmp student course grades
  private studentCourseGrades: StudentCourseGrade[] = [
    { studentId: "001", courseId: "course-101", grade: 60, gradeLetter: "DD" }, 
    { studentId: "002", courseId: "course-101", grade: 45, gradeLetter: "FF" }, 
  ];

  // Interface for student resit exam results
  private studentResitExamResults: {
    studentId: string;
    resitExamId: string;
    grade: number;
    gradeLetter: string;
    submittedAt: Date;
  }[] = [];

  
//? Secretary DAO implementation - only get not create
  getSecretaryById(id: string): Secretary | undefined {
    return this.secretary.find(secretary => secretary.id === id);
  }


  getSecretaryByEmail(email: string): Secretary | undefined {
    return this.secretary.find(secretary => secretary.email === email);
  }
 // list all courses
  getCourses(): Course[] {
    return this.courses;
  }

  // list all resit exams
  getResitExams(): ResitExam[] {
    return this.resitExams;
  }







//? Student DAO implementation
  createStudent(student: Student): void {
    this.student.push(student);
  }

  deleteStudent(id: string, secretary: string): boolean {
    // Get the student to be deleted
    const student = this.getAstudent(id);
    if (!student) {
      return false;
    }

    // Remove student from all enrolled courses
    student.courses.forEach(courseId => {
      const course = this.getCourseById(courseId);
      if (course) {
        // Remove student from course's student list
        const studentIndex = course.students.indexOf(id);
        if (studentIndex !== -1) {
          course.students.splice(studentIndex, 1);
        }

        // If course has a resit exam, remove student from that resit exam
        if (course.resitExamId) {
          const resitExam = this.getResitExam(course.resitExamId);
          if (resitExam) {
            const resitExamIndex = resitExam.students.indexOf(id);
            if (resitExamIndex !== -1) {
              resitExam.students.splice(resitExamIndex, 1);
            }
          }
        }
      }
    });

    // Remove student from all resit exams
    student.resitExams.forEach(resitExamId => {
      const resitExam = this.getResitExam(resitExamId);
      if (resitExam) {
        const studentIndex = resitExam.students.indexOf(id);
        if (studentIndex !== -1) {
          resitExam.students.splice(studentIndex, 1);
        }
      }
    });

    // Finally, delete the student
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

  addCourseToStudent(studentId: string, courseId: string, grade: number, gradeLetter: string): boolean  {
    // Get the student and course
    const student = this.getAstudent(studentId);
    const course = this.getCourseById(courseId);
    
    // Validate both exist
    if (!student || !course) {
      return false;
    }
    
    // Check if the relationship already exists
    if (student.courses.includes(courseId)) {
      return false; // Already enrolled
    }
    
    // Add course to student's course list
    student.courses.push(courseId);
    
    // Add student to course's student list if not already there
    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
    }
    
    // Add course to student course grades
    this.studentCourseGrades.push({
      studentId: studentId,
      courseId: courseId,
      grade: grade,
      gradeLetter: gradeLetter
    });

    return true;
  }

  addRistExamToStudent(studentId: string, resitExamId: string): boolean {  
    // Get the student and resit exam
    const student = this.getAstudent(studentId);
    const resitExam = this.getResitExam(resitExamId);
    
    console.log(`student exams =======> : ${student?.resitExams}`);
    console.log(`student courses =======> : ${student?.courses}`);
    
    // Validate both exist
    if (!student || !resitExam) {
      console.log('Validation failed:', { studentExists: !!student, resitExamExists: !!resitExam });
      return false;
    }
    
    // Ensure resitExams array exists
    if (!student.resitExams) {
      student.resitExams = [];
    }
    
    // Check if the relationship already exists
    const isAlreadyEnrolled = student.resitExams.includes(resitExamId);
    console.log(`Is already enrolled =======> : ${isAlreadyEnrolled}`);
    
    if (isAlreadyEnrolled) {
      return false; // Already enrolled
    }

    // check if the resit exam Letters are allowed for the student to take the resit exam
    const lettersAllowed = resitExam?.lettersAllowed;
    const courseId = resitExam?.courseId;
    const studentGradeLetter = this.studentCourseGrades.find((g: { studentId: string; courseId: string; gradeLetter: string }) => 
      g.studentId === studentId && g.courseId === courseId)?.gradeLetter;

    if (!lettersAllowed?.includes(studentGradeLetter || '')) {
      return false; // Invalid grade letter
    }

    
    // Add resit exam to student's resit exams list
    student.resitExams.push(resitExamId);
    
    // Add student to resit exam's students list 
    resitExam.students.push(studentId);
    
    return true;
  }

  removeStudentFromCourse(studentId: string, courseId: string): boolean {
    // Get the student and course
    const student = this.getAstudent(studentId);
    const course = this.getCourseById(courseId);
    
    // Validate both exist
    if (!student || !course) {
      return false;
    }
    
    // Check if the relationship exists
    if (!student.courses.includes(courseId)) {
      return false; // Not enrolled
    }
    
    // Remove course from student's course list
    const studentCourseIndex = student.courses.indexOf(courseId);
    if (studentCourseIndex !== -1) {
      student.courses.splice(studentCourseIndex, 1);
    }
    
    // Remove student from course's student list
    const studentIndex = course.students.indexOf(studentId);
    if (studentIndex !== -1) {
      course.students.splice(studentIndex, 1);
    }

    // remove the student course grad e from studentCourseGrades
    const studentCourseGradeIndex = this.studentCourseGrades.findIndex(g => g.studentId === studentId && g.courseId === courseId);
    if (studentCourseGradeIndex !== -1) {
      this.studentCourseGrades.splice(studentCourseGradeIndex, 1);
    }

    //! Also The resit exam must be removed if the student has applied for it

    const resitExamId = course.resitExamId; // if found
    if (resitExamId) {

      // Remove resit exam from student's resit exams list
      const index = student.resitExams.indexOf(resitExamId);
      if (index !== -1) {
        student.resitExams.splice(index, 1);
      }

    
      // Remove student from resit exam's students list
      const resitExam = this.getResitExam(resitExamId);
      if (resitExam) {
        const resitExamIndex = resitExam.students.indexOf(studentId);
        if (resitExamIndex !== -1) {
          resitExam.students.splice(resitExamIndex, 1);
        }
      }
    }
    return true;
  }

  removeStudentFromResitExam(studentId: string, resitExamId: string): boolean {
    // Get the student and resit exam
    const student = this.getAstudent(studentId);
    const resitExam = this.getResitExam(resitExamId);
    
    // Validate both exist
    if (!student || !resitExam) {
      return false;
    }
    
    // Check if the student is enrolled in the resit exam
    // if (!student.resitExams.includes(resitExamId)) {
    //   return false; // Not enrolled
    // }
    
    // Remove resit exam from student's resit exams list
    const index = student.resitExams.indexOf(resitExamId);
    if (index !== -1) {
      student.resitExams.splice(index, 1);
    }

    
    // Remove student from resit exam's students list
    const resitExamIndex = resitExam.students.indexOf(studentId);
    if (resitExamIndex !== -1) {
      resitExam.students.splice(resitExamIndex, 1);
    }

    return true;
  }
  
  getAstudent(id: string): Student | undefined {
    const student = this.student.find(student => student.id === id);

    if (student) {
      return {
        ...student,
      };
    }
    return undefined;

  }


  getStudentCourses(id: string): string[] | undefined {
    const student = this.student.find(student => student.id === id);
    if (student) {
      return student.courses;
    }
    return undefined;
  }

  getStudentCourseDetails(id: string): StudentCourseDetails[] | undefined {
    const student = this.getAstudent(id);
    if (!student) {
      return undefined;
    }

    return student.courses.map(courseId => {
      const course = this.courses.find(c => c.id === courseId);
      const grade = this.studentCourseGrades.find(g => g.studentId === id && g.courseId === courseId);
      
      // Get resit exam result if it exists
      let resitExamResult = undefined;
      if (course?.resitExamId) {
        resitExamResult = this.studentResitExamResults.find(
          r => r.studentId === id && r.resitExamId === course.resitExamId
        );
      }

      return {
        courseId: courseId,
        courseName: course?.name || 'Unknown Course',
        grade: grade?.grade,
        gradeLetter: grade?.gradeLetter,
        resitExam: course?.resitExamId ? {
          // will return the resit exam id, grade, grade letter 
          //if the student has a resit exam and the new results are submitted
          resitExamId: course.resitExamId,
          grade: resitExamResult?.grade,
          gradeLetter: resitExamResult?.gradeLetter,
          submittedAt: resitExamResult?.submittedAt
        } : undefined
      };
    });
  }











  //? Instructor DAO implementation
  createInstructor(instructor: Instructor): void {
    this.instructor.push(instructor);
  }

  getInstructorById(id: string): Instructor | undefined {
    return this.instructor.find(i => i.id === id);
  }

  deleteInstructor(id: string): void {
    // Get the instructor to be deleted
    const instructor = this.getInstructorById(id);
    if (!instructor) {
      return;
    }

    // Remove instructor from all assigned courses
    instructor.courses.forEach(courseId => {
      const course = this.getCourseById(courseId);
      if (course && course.instructor === id) {
        // Remove instructor from course
        course.instructor = undefined;
        course.updatedAt = new Date();
      }
    });

    // Remove instructor from all assigned resit exams
    instructor.resitExams.forEach(resitExamId => {
      const resitExam = this.getResitExam(resitExamId);
      if (resitExam) {
        // Remove instructor from resit exam's instructors list
        const instructorIndex = resitExam.instructors.indexOf(id);
        if (instructorIndex !== -1) {
          resitExam.instructors.splice(instructorIndex, 1);
        }
      }
    });

    // Finally, delete the instructor
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

  getInsturctorCourses(instructorId: string): string[] | undefined {
    const instructor = this.getInstructorById(instructorId);
    if (instructor) {
      return instructor.courses;
    }
    return undefined;
  }

  getInstructorCourseDetails(id: string): InstructorCourseDetails[] | undefined {
    const instructor = this.getInstructorById(id);
    if (!instructor) {
      return undefined;
    }

    return instructor.courses.map(courseId => {
      const course = this.courses.find(c => c.id === courseId);
      if (!course) {
        return {
          courseId: courseId,
          courseName: 'Unknown Course',
          department: 'Unknown Department',
          students: []
        };
      }
      
      return {
        courseId: course.id,
        courseName: course.name,
        department: course.department,
        students: course.students
      };
    });
  }

  addCourseToInstructor(id: string, courseId: string): boolean {
    // determine which instructor to add the course to
    const instructor = this.getInstructorById(id);
    const course = this.getCourseById(courseId);
    

    if (instructor && course) {
      // add the course to the instructor
      instructor.courses.push(courseId);
      // add the instructor to the course
      course.instructor = id;

      const status = instructor.courses.includes(courseId);
      const status2 = course.instructor === id;
      if (status && status2) {
        return true;
      }
      return false;
    }
    return false;
  }

  addResitExamToInstructor(instructorId: string, resitExamId: string): boolean {
    // Get the instructor and resit exam
    const instructor = this.getInstructorById(instructorId);
    const resitExam = this.getResitExam(resitExamId);
    
    // Validate both exist
    if (!instructor || !resitExam) {
      return false;
    }
    
    // Check if the relationship already exists
    if (instructor.resitExams.includes(resitExamId)) {
      return false; // Already assigned
    }
    
    // Add resit exam to instructor's resit exams list
    instructor.resitExams.push(resitExamId);
    
    // Add instructor to resit exam's instructors list if not already there
    if (!resitExam.instructors.includes(instructorId)) {
      resitExam.instructors.push(instructorId);
    }
    
    return true;
  }


  assignInstructorToCourse(instructorId: string, courseId: string): boolean {
    // Get the instructor and course
    const instructor = this.getInstructorById(instructorId);
    const course = this.getCourseById(courseId);
    
    // Validate both exist
    if (!instructor || !course) {
      return false;
    }
    
    // Check if the course already has an instructor
    if (course.instructor) {
      return false; // Course already has an instructor
    }
    
    // Check if the instructor is already assigned to this course
    if (instructor.courses.includes(courseId)) {
      return false; // Already assigned
    }
    
    // Add course to instructor's course list
    instructor.courses.push(courseId);
    
    // Update the course with the new instructor
    course.instructor = instructorId;
    course.updatedAt = new Date();
    
    return true;
  }







//? Course DAO implementation
  // removeResitExamFromInstructor(id: string, resitExamId: string): boolean {
  //   const instructor = this.getInstructorById(id);
  //   if (instructor) {
  //     instructor.resitExams.splice(instructor.resitExams.indexOf(resitExamId), 1);
  //     return true;
  //   }
  //   return false;
  // }


//? Course DAO implementation
  createCourse(courseId: string, resitExamId: string, cName: string, department: string  , secretaryId: string): void {

    
    // Create a new course object with the provided parameters
    const newCourse: Course = {
      id: courseId,
      name: cName,
      resitExamId: resitExamId,
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

  unassignInstructorFromCourse(courseId: string, intsId : string): boolean {
    // Get the course
    const course = this.getCourseById(courseId);
    
    // Validate course exists
    if (!course) {
      return false;
    }
    
    // Check if the course has an instructor
    if (!course.instructor) {
      return false; // No instructor assigned
    }
    
    // Get the instructor
    const instructor = this.getInstructorById(intsId);
    
    // Validate instructor exists
    if (!instructor) {
      return false;
    }
    
    // Remove course from instructor's course list
    const courseIndex = instructor.courses.indexOf(courseId);
    if (courseIndex !== -1) {
      instructor.courses.splice(courseIndex, 1);
    }
    
    // Remove instructor from course
    course.instructor = undefined;
    course.updatedAt = new Date();
    
    return true;
  }

  addStudentToCourse(studentId: string, courseId: string): boolean {
    // Get the student and course
    const student = this.getAstudent(studentId);
    const course = this.getCourseById(courseId);
    
    // Validate both exist
    if (!student || !course) {
      return false;
    }
    
    // Check if the relationship already exists
    if (course.students.includes(studentId)) {
      return false; // Already enrolled
    }
    
    // Add student to course's student list
    course.students.push(studentId);
    
    // Add course to student's course list if not already there
    if (!student.courses.includes(courseId)) {
      student.courses.push(courseId);
    }
    
    return true;
  }

  getStudentsInCourse(courseId: string): Student[] {
    const course = this.getCourseById(courseId);
    if (!course) return [];

    return this.student.filter(student => course.students.includes(student.id));
  }

  getCoursesForStudent(studentId: string): Course[] {
    const student = this.getAstudent(studentId);
    if (!student) return [];

    return this.courses.filter(course => student.courses.includes(course.id));
  }

  getCoursesForInstructor(instructorId: string): Course[] {
    return this.courses.filter(course => course.instructor === instructorId);
  }

  getCourseInstructorDetails(courseId: string): Instructor | undefined {
    const course = this.getCourseById(courseId);
    if (!course || !course.instructor) return undefined;

    return this.getInstructorById(course.instructor);
  }

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















//? ResitExam DAO implementation
  createResitExam(resitExamId: string, courseId: string, name: string, department: string, instructorId: string, lettersAllowed: string[], examDate: Date, deadline: Date, location: string): void {

    // check if the instructor Id is extists
    if (this.getInstructorById(instructorId) === undefined) {
      throw new Error("Instructor ID not found");
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
    if (instructorId === undefined) {
      throw new Error("ResitExam instructor is empty");
    }

    // resitExamId is the id of the resit exam
    const id = resitExamId;
    
    // Create a complete ResitExam object with all required properties
    const completeResitExam: ResitExam = {
      id , // Ensure id is never undefined by providing a fallback
      name,
      courseId,
      department,
      instructors: [instructorId], // Initialize with the provided instructor ID
      lettersAllowed,
      examDate,
      deadline,
      location,
      students: [],
      createdAt: new Date(),
      createdBy: instructorId,
      updatedAt: new Date() 
    };

    // add the resit exam to the resit exams list
    this.resitExams.push(completeResitExam);

    // add the resit exam to the instructor resit exams list
    this.addResitExamToInstructor(instructorId, resitExamId);
  }

  getResitExam(id: string): ResitExam | undefined {
    console.log(`id =======> : ${id}`);
    return this.resitExams.find(resitExam => resitExam.id === id);
  }

  deleteResitExam(id: string, instructorID: string, resitExamId: string): void {
    // Find the resit exam
    const resitExam = this.getResitExam(resitExamId);
    if (!resitExam) {
      throw new Error('Resit exam not found');
    }

    // Remove resit exam from instructor's resit exams list
    const instructor = this.getInstructorById(instructorID);
    if (instructor) {
      const index = instructor.resitExams.indexOf(resitExamId);
      if (index !== -1) {
        instructor.resitExams.splice(index, 1);
      }
    }

    // Remove resit exam from all students resit exams lists
    resitExam.students.forEach(studentId => {
      const student = this.getAstudent(studentId);
      if (student) {
        const studentResitExamIndex = student.resitExams.indexOf(resitExamId);
        if (studentResitExamIndex !== -1) {
          student.resitExams.splice(studentResitExamIndex, 1);
        }
      }
    });

    // delete the resit exam from the resit exams list
    const resitExamIndex = this.resitExams.findIndex(exam => exam.id === resitExamId);
    if (resitExamIndex !== -1) {
      this.resitExams.splice(resitExamIndex, 1);
    }
  }

  updateResitExam(resitExamId: string, name: string, instructorID: string, department: string, Letters: string[], examDate: Date, deadline: Date, location: string): void {


    const id = resitExamId;

    //  Find the Exam to Update
    const index = this.resitExams.findIndex(resitExam => resitExam.id === id);
    if (index === -1) {
      throw new Error(`Update failed: ResitExam with ID ${id} not found.`);
    }
    // Get a reference to the original exam object
    const originalExam = this.resitExams[index];

    //  Validate Inputs (New Values)
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




    //  Perform the Update
    // Create the updated exam object using spread syntax and new values
    this.resitExams[index] = {
      ...originalExam, // Keep unchanged fields (students, createdAt, createdBy, addedAt, name, department, etc.)
      lettersAllowed: Letters,  // Update allowed letters
      examDate: examDate,       // Update exam date
      deadline: deadline,       // Update deadline
      location: location,       // Update location
      updatedAt: new Date()     // Add or update the 'updatedAt' timestamp
    };



  }

  getResitExamsByInstructorId( instructorId: string): ResitExam[] {
    // check if the instructor Id is extists
    if (this.getInstructorById(instructorId) === undefined) {
      throw new Error("Instructor not found");
    }
    return this.resitExams.filter(resitExam => resitExam.instructors.includes(instructorId));

  }

  getStudentResitExams(studentId: string): ResitExamResponse[] {
    // check if the student Id is extists
    if (this.getAstudent(studentId) === undefined) {
      throw new Error("Student not found");
    }
    // Get all resit exams for the student
    const resitExams = this.resitExams.filter(resitExam => resitExam.students.includes(studentId));
    
    // Map the resit exams to exclude the students array
    // this is the response that will be sent to the client "student dashboard"
    return resitExams.map(({ students, ...rest }) => rest);
  }

  getInstructorResitExams(id: string): ResitExam[] {
    // check if the instructor Id exists
    if (this.getInstructorById(id) === undefined) {
      throw new Error("Instructor not found");
    }
    return this.resitExams.filter(resitExam => resitExam.instructors.includes(id));
  }

  // Get all resit exam results for a student
  getStudentAllResitExamResults(studentId: string): { resitExamId: string; grade: number; gradeLetter: string; submittedAt: Date }[] {
    return this.studentResitExamResults
      .filter(r => r.studentId === studentId)
      .map(r => ({
        resitExamId: r.resitExamId,
        grade: r.grade,
        gradeLetter: r.gradeLetter,
        submittedAt: r.submittedAt
      }));
  }

  // Get all results for a specific resit exam
  getResitExamAllResults(resitExamId: string): { studentId: string; grade: number; gradeLetter: string; submittedAt: Date }[] {
    return this.studentResitExamResults
      .filter(r => r.resitExamId === resitExamId)
      .map(r => ({
        studentId: r.studentId,
        grade: r.grade,
        gradeLetter: r.gradeLetter,
        submittedAt: r.submittedAt
      }));
  }
  










//?  IF NEEDED:
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

  // Check if a student is enrolled in a course
  isStudentEnrolledInCourse(studentId: string, courseId: string): boolean {
    const student = this.getAstudent(studentId);
    const course = this.getCourseById(courseId);
    
    // Validate both exist
    if (!student || !course) {
      return false;
    }
    
    // Check if the relationship exists
    return student.courses.includes(courseId) && course.students.includes(studentId);
  }

  // Get enrollment status of a student in all courses
  getStudentEnrollmentStatus(studentId: string): { courseId: string; enrolled: boolean }[] {
    const student = this.getAstudent(studentId);
    if (!student) {
      return [];
    }
    
    return this.courses.map(course => ({
      courseId: course.id,
      enrolled: student.courses.includes(course.id)
    }));
  }

  // Get enrollment count for a course
  getCourseEnrollmentCount(courseId: string): number {
    const course = this.getCourseById(courseId);
    if (!course) {
      return 0;
    }
    
    return course.students.length;
  }

  // Update a single student resit exam grades
  // updateStudentResitExamGrades(grades: { studentId: string; courseId: string; grade: number; gradeLetter: string }[]): boolean {
  //   try {
  //     grades.forEach(grade => {
  //       // Find the existing grade entry
  //       const existingGradeIndex = this.studentCourseGrades.findIndex(
  //         g => g.studentId === grade.studentId && g.courseId === grade.courseId
  //       );

  //       if (existingGradeIndex !== -1) {
  //         // Update existing grade
  //         this.studentCourseGrades[existingGradeIndex] = {
  //           ...this.studentCourseGrades[existingGradeIndex],
  //           grade: grade.grade,
  //           gradeLetter: grade.gradeLetter
  //         };
  //       } else {
  //         // Add new grade if it doesn't exist
  //         this.studentCourseGrades.push({
  //           studentId: grade.studentId,
  //           courseId: grade.courseId,
  //           grade: grade.grade,
  //           gradeLetter: grade.gradeLetter
  //         });
  //       }
  //     });
  //     return true;
  //   } catch (error) {
  //     console.error('Error updating student resit exam grades:', error);
  //     return false;
  //   }
  // }
  // Update a single student resit exam results
  updateStudentResitExamResults(studentId: string, resitExamId: string, grade: number, gradeLetter: string): boolean {
    try {
      // Find the existing result entry
      const existingResultIndex = this.studentResitExamResults.findIndex(
        r => r.studentId === studentId && r.resitExamId === resitExamId
      );

        // Update existing result
        if (existingResultIndex !== -1) {
          this.studentResitExamResults[existingResultIndex] = {
            ...this.studentResitExamResults[existingResultIndex],
            grade: grade,
            gradeLetter: gradeLetter,
            submittedAt: new Date()
          };
        } else {
          // Add new result if it doesn't exist
          this.studentResitExamResults.push({
            studentId: studentId,
            resitExamId: resitExamId,
            grade: grade,
            gradeLetter: gradeLetter,
            submittedAt: new Date()
          });
        }
      return true;
    } catch (error: unknown) {
      console.error('Error updating student resit exam results:', error);
      return false;
    }
  }

  // Update resit exam results for all students in a course
  updateAllStudentsResitExamResults(resitExamId: string, results: { studentId: string; grade: number; gradeLetter: string }[]): boolean {
    try {
  

      // Update or add results for each student
      results.forEach(result => {
        const existingResultIndex = this.studentResitExamResults.findIndex(
          r => r.studentId === result.studentId && r.resitExamId === resitExamId
        );

        if (existingResultIndex !== -1) {
          // Update existing result
          this.studentResitExamResults[existingResultIndex] = {
            ...this.studentResitExamResults[existingResultIndex],
            grade: result.grade,
            gradeLetter: result.gradeLetter,
            submittedAt: new Date()
          };
        } else {
          // Add new result
          this.studentResitExamResults.push({
            studentId: result.studentId,
            resitExamId: resitExamId,
            grade: result.grade,
            gradeLetter: result.gradeLetter,
            submittedAt: new Date()
          });
        }
      });

      return true;
    } catch (error) {
      console.error('Error updating all students resit exam results:', error);
      return false;
    }
  }

  // Get student resit exam results
  getStudentResitExamResults(studentId: string, resitExamId: string): { grade: number; gradeLetter: string; submittedAt: Date } | undefined {
    const result = this.studentResitExamResults.find(
      r => r.studentId === studentId && r.resitExamId === resitExamId
    );
    return result ? { grade: result.grade, gradeLetter: result.gradeLetter, submittedAt: result.submittedAt } : undefined;
  }


}