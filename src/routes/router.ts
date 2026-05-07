import { Router } from 'express';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js'

const router = Router();
router.use('/auth', authRoutes);
router.use('/project', projectRoutes)
export default router;