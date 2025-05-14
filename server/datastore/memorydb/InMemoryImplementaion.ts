import { Datastore } from "..";
import { Course, Secretary, ResitExam, Instructor, Student, StudentCourseGrade, StudentCourseDetails, InstructorCourseDetails, ResitExamResponse, CourseWithResitExam } from "../../types";

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
    createdBy: "admin123",
    createdAt: new Date(),
    updatedAt: null
  },
  {
    id: "002",
    name: "Ali Muhmmad",
    email: "ali@example.com",
    password: "pass123",
    courses: [""],
    resitExams: [],
    createdBy: "admin14",
    createdAt: new Date(),
    updatedAt: null
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
    },
    {
      id: "inst-001",
      name: "Ahmed Mohamed",
      email: "Ahmed.mohamed@example.com",
      password: "password123",
      courses: [],
      resitExams: [],
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
    resitExamId: "resit-101",
    department: "Software Engineering",
    students: ["001", "002"], // must be added not created 
    instructor: "inst-001",
    createdBy: "sec-001",
    createdAt: new Date(),
    updatedAt: null,
    },
    {
      id: "course-002",
      name: "Introduction to Software Engineering",
      resitExamId: "resit-002",
      department: "Software Engineering",
      students: [""],        // must be added not created 
      instructor: "",  // must be added after instructor is created  
      createdBy: "sec-001",
      createdAt: new Date(),
      updatedAt: null,
    }
  ];

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
  getSecretaryById(id: string): Promise<Secretary | undefined> {
    return Promise.resolve(this.secretary.find(secretary => secretary.id === id));
  }


  getSecretaryByEmail(email: string): Promise<Secretary | undefined> {
    return Promise.resolve(this.secretary.find(secretary => secretary.email === email));
  }
 // list all courses
  getCourses(): Promise<Course[]> {
    return Promise.resolve(this.courses);
  }

  // list all resit exams
  getResitExams(): Promise<ResitExam[]> {
    return Promise.resolve(this.resitExams);
  }

  // list all students
  getStudents(): Promise<Student[]> {
    return Promise.resolve(this.student);
  }

  // list all instructors
  getInstructors(): Promise<Instructor[]> {
    return Promise.resolve(this.instructor);
  }






//? Student DAO implementation
   createStudent(student: Student): Promise<void> {
    this.student.push(student);
    return Promise.resolve();
  }

  async deleteStudent(id: string, secretaryID: string): Promise<void> {
    // Get the student to be deleted
    const student = await this.getAstudent(id);
    if (!student) {
      return Promise.reject(new Error("Student not found"));
    }

    // Remove student from all enrolled courses
    const studentCourses = [...student.courses];
    for (const courseId of studentCourses) {
      const course = await this.getCourseById(courseId);
      if (course) {
        // Remove student from course's student list
        const studentIndex = course.students.indexOf(id);
        if (studentIndex !== -1) {
          course.students.splice(studentIndex, 1);
        }

        // If course has a resit exam, remove student from that resit exam
        if (course.resitExamId) {
          const resitExam = await this.getResitExam(course.resitExamId);
          if (resitExam) {
            const resitExamIndex = resitExam.students.indexOf(id);
            if (resitExamIndex !== -1) {
              resitExam.students.splice(resitExamIndex, 1);
            }
          }
        }
      }
    }

    // Remove student from all resit exams
    const studentResitExams = [...student.resitExams];
    for (const resitExamId of studentResitExams) {
      const resitExam = await this.getResitExam(resitExamId);
      if (resitExam) {
        const studentIndex = resitExam.students.indexOf(id);
        if (studentIndex !== -1) {
          resitExam.students.splice(studentIndex, 1);
        }
      }
    }

    // Finally, delete the student
    const index = this.student.findIndex(student => student.id === id);
    if (index !== -1) {
      this.student.splice(index, 1);
    }
  }

  async updateStudentInfo(id: string, name: string, email: string, password: string, secretaryId: string): Promise<void> {
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
    return Promise.resolve();
  }

  async addCourseToStudent(studentId: string, courseId: string, grade: number, gradeLetter: string): Promise<boolean> {
    // Get the student and course
    const student = await this.getAstudent(studentId);
    const course = await this.getCourseById(courseId);
    
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

  async addRistExamToStudent(studentId: string, resitExamId: string): Promise<boolean> {  
    // Get the student and resit exam
    const student = await this.getAstudent(studentId);
    const resitExam = await this.getResitExam(resitExamId);
    
    // Validate both exist
    if (!student || !resitExam) {
      return false;
    }
    
    // Ensure resitExams array exists
    if (!student.resitExams) {
      student.resitExams = [];
    }
    
    // Check if the relationship already exists
    if (student.resitExams.includes(resitExamId)) {
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

   async removeStudentFromCourse(studentId: string, courseId: string, secretaryId: string): Promise<void> {
    // Get the student and course
    const student = await this.getAstudent(studentId);
    const course = await this.getCourseById(courseId);
    
    // Validate both exist
    if (!student || !course) {
      return Promise.reject(new Error("Student or course not found"));
    }

    // Remove course from student's courses list
    const studentCourseIndex = student.courses.indexOf(courseId);
    if (studentCourseIndex !== -1) {
      student.courses.splice(studentCourseIndex, 1);
    }
    
    // Remove student from course's students list
    const courseStudentIndex = course.students.indexOf(studentId);
    if (courseStudentIndex !== -1) {
      course.students.splice(courseStudentIndex, 1);
    }

    // If course has a resit exam, remove student from that resit exam
    if (course.resitExamId) {
      const resitExam = await this.getResitExam(course.resitExamId);
      if (resitExam) {
        const resitExamIndex = resitExam.students.indexOf(studentId);
        if (resitExamIndex !== -1) {
          resitExam.students.splice(resitExamIndex, 1);
        }
      }
    }
  }

   async removeStudentFromResitExam(studentId: string, resitExamId: string): Promise<void> {
    // Get the student and resit exam
    const student = await this.getAstudent(studentId);
    const resitExam = await this.getResitExam(resitExamId);
    
    // Validate both exist
    if (!student || !resitExam) {
      return Promise.reject(new Error("Student or resit exam not found"));
    }
    
    // Remove resit exam from student's resit exams list
    const studentResitExamIndex = student.resitExams.indexOf(resitExamId);
    if (studentResitExamIndex !== -1) {
      student.resitExams.splice(studentResitExamIndex, 1);
    }
    
    // Remove student from resit exam's students list
    const resitExamStudentIndex = resitExam.students.indexOf(studentId);
    if (resitExamStudentIndex !== -1) {
      resitExam.students.splice(resitExamStudentIndex, 1);
    }
  }
  
  getAstudent(id: string): Promise<Student | undefined> {
    const student = this.student.find(student => student.id === id);
    if (!student) {
      return Promise.resolve(undefined);
    }

    // Ensure courses is always an array
    return Promise.resolve({
        ...student,
      courses: student.courses || []
    });
    }


  getStudentCourses(id: string): Promise<string[] | undefined> {
    const student = this.student.find(student => student.id === id);
    return Promise.resolve(student ? student.courses : undefined);
  }

   async getStudentCourseDetails(id: string): Promise<StudentCourseDetails[] | undefined> {
    const student = await this.getAstudent(id);
    if (!student) {
      return Promise.resolve(undefined);
    }

    const details = await Promise.all(student.courses.map(async courseId => {
      const course = await this.getCourseById(courseId);
      const grade = this.studentCourseGrades.find(g => g.studentId === id && g.courseId === courseId);
      
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
          resitExamId: course.resitExamId,
          grade: resitExamResult?.grade,
          gradeLetter: resitExamResult?.gradeLetter,
          submittedAt: resitExamResult?.submittedAt
        } : undefined
      };
    }));

    return Promise.resolve(details);
  }











  //? Instructor DAO implementation
   createInstructor(instructor: Instructor): Promise<void> {
    this.instructor.push(instructor);
    return Promise.resolve();
  }

  getInstructorById(id: string): Promise<Instructor | undefined> {
    return Promise.resolve(this.instructor.find(i => i.id === id));
  }

   async deleteInstructor(id: string): Promise<void> {
    // Get the instructor to be deleted
    const instructor = await this.getInstructorById(id);
    if (!instructor) {
      return Promise.reject(new Error("Instructor not found"));
    }

    // Remove instructor from all assigned courses
    const instructorCourses = [...instructor.courses];
    for (const courseId of instructorCourses) {
      const course = await this.getCourseById(courseId);
      if (course && course.instructor === id) {
        // Remove instructor from course
        course.instructor = undefined;
        course.updatedAt = new Date();
      }
    }

    // Remove instructor from all assigned resit exams
    const instructorResitExams = [...instructor.resitExams];
    for (const resitExamId of instructorResitExams) {
      const resitExam = await this.getResitExam(resitExamId);
      if (resitExam) {
        // Remove instructor from resit exam's instructors list
        const instructorIndex = resitExam.instructors?.indexOf(id);
        if (instructorIndex !== undefined && instructorIndex !== -1 && resitExam.instructors) {
          resitExam.instructors.splice(instructorIndex, 1);
        }
      }
    }

    // Finally, delete the instructor
    const index = this.instructor.findIndex(instructor => instructor.id === id);
    if (index !== -1) {
      this.instructor.splice(index, 1);
    }
    return Promise.resolve();
  }

   updateInstructor(id: string, name: string, email: string, password: string): Promise<void> {
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
    return Promise.resolve();
  }

   async getInsturctorCourses(instructorId: string): Promise<string[] | undefined> {
    const instructor = await this.getInstructorById(instructorId);
    if (!instructor) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(instructor.courses);
  }

   async getInstructorCourseDetails(id: string): Promise<InstructorCourseDetails[] | undefined> {
    const instructor = await this.getInstructorById(id);
    if (!instructor) {
      return Promise.resolve(undefined);
    }

    const details = await Promise.all(instructor.courses.map(async (courseId: string) => {
      const course = await this.getCourseById(courseId);
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
    }));

    return Promise.resolve(details);
  }

   async addCourseToInstructor(id: string, courseId: string): Promise<boolean> {
    // determine which instructor to add the course to
    const instructor = await this.getInstructorById(id);
    const course = await this.getCourseById(courseId);

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

   async addResitExamToInstructor(instructorId: string, resitExamId: string): Promise<boolean> {
    const instructor = await this.getInstructorById(instructorId);
    const resitExam = await this.getResitExam(resitExamId);
    
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
    if (!resitExam.instructors?.includes(instructorId)) {
      resitExam.instructors?.push(instructorId);
    }
    
    return true;
  }


   async assignInstructorToCourse(instructorId: string, courseId: string): Promise<boolean> {
    const instructor = await this.getInstructorById(instructorId);
    const course = await this.getCourseById(courseId);
    
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

   async unassignInstructorFromCourse(instructorId: string, courseId: string): Promise<boolean> {
    const instructor = await this.getInstructorById(instructorId);
    const course = await this.getCourseById(courseId);
    
    if (!instructor || !course) {
      return false;
    }
    
    // Check if the course has this instructor
    if (course.instructor !== instructorId) {
      return false; // Course doesn't have this instructor
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
  async createCourse(course: Course): Promise<void> {
    // push the new course to the courses array
    this.courses.push(course);
    return Promise.resolve();
  }

  // all course properties
  async getCourseById(courseId: string): Promise<CourseWithResitExam | undefined> {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return Promise.resolve(undefined);

    // Only try to get resit exam if course has a resit exam linked to it's resitExamId
    let resitExamLettersAllowed: string[] = [];
    if (course.resitExamId) {
      try {
        const resitExam = await this.getResitExam(course.resitExamId);
        resitExamLettersAllowed = resitExam?.lettersAllowed ?? [];
      } catch (error) {
        // If resit exam doesn't exist yet, just use empty array for letters
        resitExamLettersAllowed = [];
      }
    }
    
    return Promise.resolve({
      ...course,
      resitExamLettersAllowed
    });
  }

  // only instructor id
   async getCourseInstructor(courseId: string): Promise<string | undefined> {
    const course = await this.getCourseById(courseId);
    if (!course) {
      return Promise.reject(new Error("Course not found"));
    }
    return Promise.resolve(course.instructor);
  }

  listCourseStudents(id: string): Promise<string[] | undefined> {
    const course = this.courses.find(course => course.id === id);
    return Promise.resolve(course ? course.students : undefined);
  }

   async deleteCourse(id: string, secretaryId: string): Promise<void> {
    if (!await this.getSecretaryById(secretaryId)) {
      return Promise.reject(new Error("Unauthorized"));
    }

    if (!await this.getCourseById(id)) {
      return Promise.reject(new Error("Course not found"));
    }

    const index = this.courses.findIndex(course => course.id === id);
    if (index !== -1) {
      this.courses.splice(index, 1);
    }
    return Promise.resolve();
  }

   async updateCourse(id: string, name: string, instructor: string, department: string, secretaryId: string): Promise<void> {
    if (!await this.getSecretaryById(secretaryId)) {
      return Promise.reject(new Error("Unauthorized"));
    }
    
    if (!await this.getCourseById(id)) {
      return Promise.reject(new Error("Course not found"));
    }

    const index = this.courses.findIndex(course => course.id === id);
    if (index !== -1) {
      this.courses[index] = { 
        ...this.courses[index], 
        name, 
        instructor, 
        department,
        updatedAt: new Date()
      };
    }
    return Promise.resolve();
  }

   async removeCourseFromInstructor(courseId: string, instructorId: string): Promise<boolean> {
    const course = await this.getCourseById(courseId);
    if (!course) return false;

    const instructor = await this.getInstructorById(instructorId);
    if (!instructor) return false;
    
    // Check if the course has an instructor
    if (!course.instructor) {
      return false; // No instructor assigned
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

   async addStudentToCourse(studentId: string, courseId: string): Promise<boolean> {
    const course = await this.getCourseById(courseId);
    if (!course) return false;

    const student = await this.getAstudent(studentId);
    if (!student) return false;
    
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

   async getStudentsForCourse(courseId: string): Promise<Student[]> {
    const course = await this.getCourseById(courseId);
    if (!course) return [];

    return this.student.filter(student => course.students.includes(student.id));
  }

   async getCoursesForStudent(studentId: string): Promise<Course[]> {
    const student = await this.getAstudent(studentId);
    if (!student) return [];

    return this.courses.filter(course => student.courses.includes(course.id));
  }

   async getCourseInstructorDetails(courseId: string): Promise<Instructor | undefined> {
    const course = await this.getCourseById(courseId);
    if (!course || !course.instructor) return undefined;

    return this.getInstructorById(course.instructor);
  }

  async updateCourseDetails(
    courseId: string,
    updates: {
      name?: string;
      department?: string;
      instructor?: string;
    },
    secretaryId: string
  ): Promise<boolean> {
    // Verify secretary authorization
    const secretary = await this.getSecretaryById(secretaryId);
    if (!secretary) return false;

    const course = await this.getCourseById(courseId);
    if (!course) return false;

    // If changing instructor, verify new instructor exists
    if (updates.instructor) {
      const instructor = await this.getInstructorById(updates.instructor);
      if (!instructor) return false;
    }

    // Update the course
    Object.assign(course, updates);
    course.updatedAt = new Date();

    return true;
  }















//? ResitExam DAO implementation
   async createResitExamBySecretary(secr_id: string, resitExamId: string, courseId: string, examDate: Date, deadline: Date, location: string): Promise<void> {
    // Check if location is already taken
    if (this.resitExams.some(resitExam => resitExam.location === location)) {
      return Promise.reject(new Error("ResitExam location already taken"));
    }

    if (!deadline) {
      return Promise.reject(new Error("ResitExam deadline is empty"));
    }

    // Get the course to verify it exists and get its details
    const course = await this.getCourseById(courseId);
    if (!course) {
      return Promise.reject(new Error("Course not found"));
    }

    // Verify the resitExamId matches the course's resitExamId
    if (course.resitExamId !== resitExamId) {
      return Promise.reject(new Error("ResitExam ID does not match the course's resit exam ID"));
    }

    const completeResitExam: ResitExam = {
      id: resitExamId,
      courseId,
      name: course.name,
      department: course.department,
      instructors: [],
      lettersAllowed: [],
      examDate,
      deadline,
      location,
      students: [],
      createdAt: new Date(),
      createdBy: secr_id,
      updatedAt: new Date() 
    };

    this.resitExams.push(completeResitExam);

    // Get the course instructor and add them to the resit exam
    const instructor = await this.getCourseInstructor(courseId);
    if (instructor) {
      completeResitExam.instructors = [instructor];
      await this.addResitExamToInstructor(instructor, resitExamId);
    }

    return Promise.resolve();
  }

   async createResitExamByInstuctor(resitExamId: string, courseId: string, name: string, department: string, instructorId: string, lettersAllowed: string[]): Promise<void> {
    // Validate instructor exists
    const instructor = await this.getInstructorById(instructorId);
    if (!instructor) {
      return Promise.reject(new Error("Instructor ID not found"));
    }

    // Get the course to verify it exists and get its details
    const course = await this.getCourseById(courseId);
    if (!course) {
      return Promise.reject(new Error("Course not found"));
    }

    // Verify the resitExamId matches the course's resitExamId
    if (course.resitExamId !== resitExamId) {
      return Promise.reject(new Error("ResitExam ID does not match the course's resit exam ID"));
    }

    // Verify the instructor is assigned to the course
    if (course.instructor !== instructorId) {
      return Promise.reject(new Error("Instructor is not assigned to this course"));
    }

    if (lettersAllowed.length === 0) {
      return Promise.reject(new Error("ResitExam lettersAllowed is empty"));
    }

    const completeResitExam: ResitExam = {
      id: resitExamId,
      name,
      courseId,
      department,
      instructors: [instructorId],
      lettersAllowed,
      students: [],
      examDate: undefined,
      deadline: undefined,
      location: undefined,
      createdAt: new Date(),
      createdBy: instructorId,
      updatedAt: new Date() 
    };

    this.resitExams.push(completeResitExam);
    await this.addResitExamToInstructor(instructorId, resitExamId);
    return Promise.resolve();
  }


  getResitExam(id: string): Promise<ResitExam> {
    const resitExam = this.resitExams.find(resitExam => resitExam.id === id);
    if (!resitExam) {
      return Promise.reject(new Error(`ResitExam with ID ${id} not found`));
    }

    // Ensure all fields are properly initialized
    const completeResitExam: ResitExam = {
      id: resitExam.id,
      courseId: resitExam.courseId,
      name: resitExam.name || undefined,
      department: resitExam.department || undefined,
      instructors: resitExam.instructors || undefined,
      lettersAllowed: resitExam.lettersAllowed || undefined,
      examDate: resitExam.examDate || undefined,
      deadline: resitExam.deadline || undefined,
      location: resitExam.location || undefined,
      students: resitExam.students || [],
      createdAt: resitExam.createdAt,
      createdBy: resitExam.createdBy,
      updatedAt: resitExam.updatedAt
    };

    return Promise.resolve(completeResitExam);
  }

   async getStudentResitExams(id: string): Promise<ResitExamResponse[]> {
    const student = await this.getAstudent(id);
    if (!student) {
      return Promise.resolve([]);
    }

    const resitExams = await Promise.all(
      student.resitExams.map(async (resitExamId) => {
        const resitExam = await this.getResitExam(resitExamId);
        if (!resitExam) return null;

        return {
          id: resitExam.id,
          courseId: resitExam.courseId,
          name: resitExam.name || '',
          department: resitExam.department || '',
          instructors: resitExam.instructors || [],
          lettersAllowed: resitExam.lettersAllowed || [],
          examDate: resitExam.examDate || null,
          deadline: resitExam.deadline || null,
          location: resitExam.location || null,
          createdAt: resitExam.createdAt,
          createdBy: resitExam.createdBy,
          updatedAt: resitExam.updatedAt
        };
      })
    );

    return Promise.resolve(resitExams.filter((exam): exam is ResitExamResponse => exam !== null));
  }

   getStudentAllResitExamResults(studentId: string): Promise<{ resitExamId: string; grade: number; gradeLetter: string; submittedAt: Date }[]> {
    return Promise.resolve(
      this.studentResitExamResults
        .filter(result => result.studentId === studentId)
        .map(result => ({
          resitExamId: result.resitExamId,
          grade: result.grade,
          gradeLetter: result.gradeLetter,
          submittedAt: result.submittedAt
        }))
    );
  }

   getStudentResitExamResults(studentId: string, resitExamId: string): Promise<{ grade: number; gradeLetter: string; submittedAt: Date } | undefined> {
    const result = this.studentResitExamResults.find(
      r => r.studentId === studentId && r.resitExamId === resitExamId
    );

    if (!result) {
      return Promise.resolve(undefined);
    }

    return Promise.resolve({
      grade: result.grade,
      gradeLetter: result.gradeLetter,
      submittedAt: result.submittedAt
    });
  }

   async updateResitExamBySecretary(
    resitExamId: string,
    examDate: Date,
    deadline: Date,
    location: string
  ): Promise<void> {
    const resitExam = await this.getResitExam(resitExamId);
    if (!resitExam) {
      return Promise.reject(new Error("Resit exam not found"));
    }

    // Check if location is already taken by another resit exam
    const existingResitExam = this.resitExams.find(
      exam => exam.location === location && exam.id !== resitExamId
    );
    if (existingResitExam) {
      return Promise.reject(new Error("Resit exam location already taken"));
    }

    // Update the resit exam
    resitExam.examDate = examDate;
    resitExam.deadline = deadline;
    resitExam.location = location;
    resitExam.updatedAt = new Date();

    return Promise.resolve();
  }

   async getInstructorResitExams(id: string): Promise<ResitExam[] | undefined> {
    const instructor = await this.getInstructorById(id);
    if (!instructor) {
      return Promise.resolve(undefined);
    }

    const resitExams = await Promise.all(
      instructor.resitExams.map(async (resitExamId) => {
        return this.getResitExam(resitExamId);
      })
    );

    return Promise.resolve(resitExams.filter((exam): exam is ResitExam => exam !== undefined));
  }

   async deleteResitExam(id: string, instructorID: string, resitExamId: string): Promise<void> {
    // Get the instructor
    const instructor = await this.getInstructorById(instructorID);
    if (!instructor) {
      return Promise.reject(new Error("Instructor not found"));
    }

    // Get the resit exam
    const resitExam = await this.getResitExam(resitExamId);
    if (!resitExam) {
      return Promise.reject(new Error("Resit exam not found"));
    }

    // Remove resit exam from instructor's resit exams list
    const resitExamIndex = instructor.resitExams.indexOf(resitExamId);
    if (resitExamIndex !== -1) {
      instructor.resitExams.splice(resitExamIndex, 1);
    }

    // Remove instructor from resit exam's instructors list
    const instructorIndex = resitExam.instructors?.indexOf(instructorID);
    if (instructorIndex !== undefined && instructorIndex !== -1 && resitExam.instructors) {
      resitExam.instructors.splice(instructorIndex, 1);
    }

    // Delete the resit exam
    const index = this.resitExams.findIndex(exam => exam.id === resitExamId);
    if (index !== -1) {
      this.resitExams.splice(index, 1);
    }

    return Promise.resolve();
  }

   async updateResitExamByInstructor(id: string, name: string, instructorID: string, department: string, letters: string[]): Promise<void> {
    const instructor = await this.getInstructorById(instructorID);
    if (!instructor) {
      return Promise.reject(new Error("Instructor not found"));
    }

    const resitExam = await this.getResitExam(id);
    if (!resitExam) {
      return Promise.reject(new Error("Resit exam not found"));
    }

    // Update resit exam details
    resitExam.name = name;
    resitExam.department = department;
    resitExam.lettersAllowed = letters;
    resitExam.updatedAt = new Date();

    return Promise.resolve();
  }

   async getResitExamsByInstructorId(instructorID: string): Promise<ResitExam[]> {
    const instructor = await this.getInstructorById(instructorID);
    if (!instructor) {
      return Promise.resolve([]);
    }

    const resitExams = await Promise.all(
      instructor.resitExams.map(async (resitExamId) => {
        return this.getResitExam(resitExamId);
      })
    );

    return resitExams.filter((exam): exam is ResitExam => exam !== undefined);
  }

   async getResitExamAllResults(resitExamId: string): Promise<{ studentId: string; grade: number; gradeLetter: string; submittedAt: Date }[]> {
    const resitExam = await this.getResitExam(resitExamId);
    if (!resitExam) {
      return Promise.resolve([]);
    }
    
    return Promise.resolve(this.studentResitExamResults
      .filter(result => result.resitExamId === resitExamId)
      .map(result => ({
        studentId: result.studentId,
        grade: result.grade,
        gradeLetter: result.gradeLetter,
        submittedAt: result.submittedAt
      })));
  }

   async updateStudentResitExamResults(studentId: string, resitExamId: string, grade: number, gradeLetter: string): Promise<boolean> {
    const student = await this.getAstudent(studentId);
    if (!student) {
      return Promise.resolve(false);
    }

    const resitExam = await this.getResitExam(resitExamId);
    if (!resitExam) {
      return Promise.resolve(false);
    }

    // Check if the student is enrolled in this resit exam
    if (!student.resitExams.includes(resitExamId)) {
      return Promise.resolve(false);
    }

    // Check if the grade letter is allowed
    if (!resitExam.lettersAllowed?.includes(gradeLetter)) {
      return Promise.resolve(false);
    }

    // Update or add the result
      const existingResultIndex = this.studentResitExamResults.findIndex(
      result => result.studentId === studentId && result.resitExamId === resitExamId
      );

        if (existingResultIndex !== -1) {
      // Update existing result
          this.studentResitExamResults[existingResultIndex] = {
        studentId,
        resitExamId,
        grade,
        gradeLetter,
            submittedAt: new Date()
          };
        } else {
      // Add new result
          this.studentResitExamResults.push({
        studentId,
        resitExamId,
        grade,
        gradeLetter,
            submittedAt: new Date()
          });
        }

    return Promise.resolve(true);
  }

   async updateAllStudentsResitExamResults(resitExamId: string, results: { studentId: string; grade: number; gradeLetter: string }[]): Promise<boolean> {
    const resitExam = await this.getResitExam(resitExamId);
    if (!resitExam) {
      return Promise.resolve(false);
    }

    // Validate all students are enrolled in the resit exam
    for (const result of results) {
      const student = await this.getAstudent(result.studentId);
      if (!student || !student.resitExams.includes(resitExamId)) {
        return Promise.resolve(false);
      }

      // Validate grade letter is allowed
      if (!resitExam.lettersAllowed?.includes(result.gradeLetter)) {
        return Promise.resolve(false);
      }
    }

    // Update all results
    for (const result of results) {
        const existingResultIndex = this.studentResitExamResults.findIndex(
          r => r.studentId === result.studentId && r.resitExamId === resitExamId
        );

        if (existingResultIndex !== -1) {
          // Update existing result
          this.studentResitExamResults[existingResultIndex] = {
          studentId: result.studentId,
          resitExamId,
            grade: result.grade,
            gradeLetter: result.gradeLetter,
            submittedAt: new Date()
          };
        } else {
          // Add new result
          this.studentResitExamResults.push({
            studentId: result.studentId,
          resitExamId,
            grade: result.grade,
            gradeLetter: result.gradeLetter,
            submittedAt: new Date()
          });
      }
    }

    return Promise.resolve(true);
  }

//    getCourseStats(courseId: string): Promise<{
//     totalStudents: number;
//     averageGrade: number;
//     gradeDistribution: {
//       A: number;
//       B: number;
//       C: number;
//       D: number;
//       F: number;
//     };
//   } | undefined> {
//     const course = await this.getCourseById(courseId);
//     if (!course) return Promise.resolve(undefined);

//     const students = await this.getStudentsForCourse(courseId);
//     return Promise.resolve({
//       totalStudents: students.length,
//       averageGrade: students.reduce((acc, student) => {
//         const grade = this.studentCourseGrades.find(g => g.studentId === student.id && g.courseId === courseId)?.grade || 0;
//         return acc + grade;
//       }, 0) / students.length || 0,
//       gradeDistribution: {
//         A: students.filter(student => {
//           const grade = this.studentCourseGrades.find(g => g.studentId === student.id && g.courseId === courseId)?.gradeLetter;
//           return grade === 'A';
//         }).length,
//         B: students.filter(student => {
//           const grade = this.studentCourseGrades.find(g => g.studentId === student.id && g.courseId === courseId)?.gradeLetter;
//           return grade === 'B';
//         }).length,
//         C: students.filter(student => {
//           const grade = this.studentCourseGrades.find(g => g.studentId === student.id && g.courseId === courseId)?.gradeLetter;
//           return grade === 'C';
//         }).length,
//         D: students.filter(student => {
//           const grade = this.studentCourseGrades.find(g => g.studentId === student.id && g.courseId === courseId)?.gradeLetter;
//           return grade === 'D';
//         }).length,
//         F: students.filter(student => {
//           const grade = this.studentCourseGrades.find(g => g.studentId === student.id && g.courseId === courseId)?.gradeLetter;
//           return grade === 'F';
//         }).length
//       }
//     };
//   }
}