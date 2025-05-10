import express from 'express';
import courseRoutes from './courseRoutes';
import studentRoutes from './studentRoutes';
import instructorRoutes from './instructorRoutes';

const router = express.Router();

// Mount routes
router.use(courseRoutes);
router.use(studentRoutes);
router.use(instructorRoutes);

export default router; 