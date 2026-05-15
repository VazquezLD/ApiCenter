import { Router } from 'express';
import { createProject, deleteProject, getProjects, updateProject, getProjectLogs, checkProjectStatus } from '../controllers/project.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();
router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getProjects);
router.get('/:id/logs', verifyToken, getProjectLogs);
router.patch('/:id', verifyToken, updateProject);
router.delete('/:id',verifyToken , deleteProject);
router.post('/:id/check', verifyToken, checkProjectStatus);

export default router;