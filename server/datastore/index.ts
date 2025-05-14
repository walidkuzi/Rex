import { CourseDao } from './dao/CourseDao';
import { InstructorDao } from './dao/InstructorDao';
import { ResitExamDao } from './dao/ResitExamDao';
import { StudentDao } from './dao/StudentDao';
import { inMemoryDatastore } from './memorydb/InMemoryImplementaion';
// import { inMemoryDatastore } from './memorydb';

export interface Datastore extends CourseDao, InstructorDao, ResitExamDao, StudentDao {}


// This is the in-memory implementation of the datastore
// singleton instance of the in-memory datastore
// db.access all the methods of the datastore
export const db = new inMemoryDatastore();