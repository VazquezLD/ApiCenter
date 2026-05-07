import { Router } from 'express';
import { createProject, deleteProyect, getProjects, updateProject } from '../controllers/project.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();
router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getProjects);
router.patch('/:id', verifyToken, updateProject)
router.delete('/:id',verifyToken , deleteProyect)

export default router;