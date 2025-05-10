-- faculty secretary
-- valid insert
INSERT INTO FacultySecretary (FacultySecretarySpecialId, FacultySecretaryName, FacultySecretaryEmail, FacultySecretaryPassword)
VALUES ('FS001', 'test', 'test', 'test');

-- fail (duplicate email)
INSERT INTO FacultySecretary (FacultySecretarySpecialId, FacultySecretaryName, FacultySecretaryEmail, FacultySecretaryPassword)
VALUES ('FS002', 'test', 'test', 'test');

-- fail (null name)
INSERT INTO FacultySecretary (FacultySecretarySpecialId, FacultySecretaryEmail, FacultySecretaryPassword)
VALUES ('FS003', 'test', 'test'); 

-- student
-- valid insert
INSERT INTO Student (StudentName, StudentEmail, StudentPassword, FacultySecretaryId)
VALUES ('test', 'test', 'test', 1);

-- fail (invalid foreign key)
INSERT INTO Student (StudentName, StudentEmail, StudentPassword, FacultySecretaryId)
VALUES ('test', 'test', 'test', 9999);

-- fail (duplicate email)
INSERT INTO Student (StudentName, StudentEmail, StudentPassword, FacultySecretaryId)
VALUES ('test', 'test', 'test', 1);

-- fail (null name)
INSERT INTO Student (StudentEmail, StudentPassword, FacultySecretaryId)
VALUES ('test', 'test', 1); 

-- fail (update with null name)
UPDATE Student SET StudentName = NULL WHERE StudentEmail = 'test'; 

-- instructor
-- valid insert
INSERT INTO Instructor (InstructorName, InstructorEmail, InstructorPassword, FacultySecretaryId)
VALUES ('test', 'test', 'test', 1);

-- fail (invalid foreign key)
INSERT INTO Instructor (InstructorName, InstructorEmail, InstructorPassword, FacultySecretaryId)
VALUES ('test', 'test', 'test', 9999);

-- fail (duplicate email)
INSERT INTO Instructor (InstructorName, InstructorEmail, InstructorPassword, FacultySecretaryId)
VALUES ('test', 'test', 'test', 1); 

-- fail (null name)
INSERT INTO Instructor (InstructorEmail, InstructorPassword, FacultySecretaryId)
VALUES ('test', 'test', 1); 

-- faculty
-- valid insert
INSERT INTO Faculty (FacultyName, FacultySecretaryId)
VALUES ('test', 1);

-- fail (invalid foreign key)
INSERT INTO Faculty (FacultyName, FacultySecretaryId)
VALUES ('test', 9999); 

-- fail (null FacultyName)
INSERT INTO Faculty (FacultySecretaryId)
VALUES (1); 

-- fail (delete faculty with existing FacultySecretary)
DELETE FROM Faculty WHERE FacultyId = 1; 

-- department
-- valid insert
INSERT INTO Department (DepartmentName, FacultyId)
VALUES ('test', 1);

-- fail (invalid foreign key)
INSERT INTO Department (DepartmentName, FacultyId)
VALUES ('test', 9999); 

-- fail (null DepartmentName)
INSERT INTO Department (FacultyId)
VALUES (1); 

-- course
-- valid insert
INSERT INTO Course (CourseCode, CourseName, InstructorId, DepartmentId, FacultySecretaryId)
VALUES ('test', 'test', 1, 1, 1);

-- fail (invalid foreign key - InstructorId)
INSERT INTO Course (CourseCode, CourseName, InstructorId, DepartmentId, FacultySecretaryId)
VALUES ('test', 'test', 9999, 1, 1);

-- fail (invalid foreign key - DepartmentId)
INSERT INTO Course (CourseCode, CourseName, InstructorId, DepartmentId, FacultySecretaryId)
VALUES ('test', 'test', 1, 9999, 1);

-- fail (invalid foreign key - FacultySecretaryId)
INSERT INTO Course (CourseCode, CourseName, InstructorId, DepartmentId, FacultySecretaryId)
VALUES ('test', 'test', 1, 1, 9999);

-- fail (duplicate CourseCode)
INSERT INTO Course (CourseCode, CourseName, InstructorId, DepartmentId, FacultySecretaryId)
VALUES ('test', 'test', 1, 1, 1);

-- enroll
-- valid insert
INSERT INTO Enroll (StudentId, CourseId, EnrollGrade)
VALUES (1, 1, 85);

-- fail (invalid foreign key - StudentId)
INSERT INTO Enroll (StudentId, CourseId, EnrollGrade)
VALUES (9999, 1, 85);

-- fail (invalid foreign key - CourseId)
INSERT INTO Enroll (StudentId, CourseId, EnrollGrade)
VALUES (1, 9999, 85);

-- fail (duplicate enrollment)
INSERT INTO Enroll (StudentId, CourseId, EnrollGrade)
VALUES (1, 1, 85);

-- pass (null EnrollGrade)
INSERT INTO Enroll (StudentId, CourseId)
VALUES (1, 1);

-- resit exam application
-- valid insert
INSERT INTO ResitExamApplication (ResitExamId, StudentId, CourseId, Status)
VALUES (1, 1, 1, 'test');

-- fail (invalid foreign key - ResitExamId)
INSERT INTO ResitExamApplication (ResitExamId, StudentId, CourseId, Status)
VALUES (9999, 1, 1, 'test');

-- fail (invalid foreign key - StudentId)
INSERT INTO ResitExamApplication (ResitExamId, StudentId, CourseId, Status)
VALUES (1, 9999, 1, 'test');

-- fail (invalid foreign key - CourseId)
INSERT INTO ResitExamApplication (ResitExamId, StudentId, CourseId, Status)
VALUES (1, 1, 9999, 'test');

-- fail (invalid Status)
INSERT INTO ResitExamApplication (ResitExamId, StudentId, CourseId, Status)
VALUES (1, 1, 1, 'invalid');

-- resit exam enroll
-- valid insert
INSERT INTO ResitExamEnroll (ResitExamApplicationId, Status)
VALUES (1, 'test');

-- fail (invalid foreign key - ResitExamApplicationId)
INSERT INTO ResitExamEnroll (ResitExamApplicationId, Status)
VALUES (9999, 'test');

-- fail (null Status)
INSERT INTO ResitExamEnroll (ResitExamApplicationId)
VALUES (1);
 
-- assigned exam hall
-- valid insert
INSERT INTO AssignedExamHall (ExamHallId, ResitExamId)
VALUES (1, 1);

-- fail (invalid foreign key - ExamHallId)
INSERT INTO AssignedExamHall (ExamHallId, ResitExamId)
VALUES (9999, 1);

-- fail (invalid foreign key - ResitExamId)
INSERT INTO AssignedExamHall (ExamHallId, ResitExamId)
VALUES (1, 9999);
