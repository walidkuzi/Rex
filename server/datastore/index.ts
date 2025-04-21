import { CourseDao } from './courseDao';
import { InstructorDao } from './instructorDao';
import { ResitExamDao } from './resitExamDao';
import { StudentDao } from './studentDao';
import { UserDao } from './userDao';

export interface datastore extends UserDao, CourseDao, InstructorDao, ResitExamDao, StudentDao {}
