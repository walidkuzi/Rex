import { CourseDao } from './CourseDao';
import { InstructorDao } from './InstructorDao';
import { ResitExamDao } from './ResitExamDao';
import { StudentDao } from './StudentDao';
import { inMemoryDatastore } from './memorydb';
// import { inMemoryDatastore } from './memorydb';

export interface Datastore extends CourseDao, InstructorDao, ResitExamDao, StudentDao {}


// This is the in-memory implementation of the datastore
// singleton instance of the in-memory datastore
// db.access all the methods of the datastore
export const db = new inMemoryDatastore();