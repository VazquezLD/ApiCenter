import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import prisma from "../config/db.js";

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: "Usuario no autenticado" });
            return;
        }

        const { name, baseUrl, description, method, tags } = req.body;

        const newProject = await prisma.project.create({
            data: {
                name,
                baseUrl,
                description,
                method,
                tags,
                userId
            }
        });

        res.status(201).json({
            message: "Proyecto creado exitosamente",
            project: newProject
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno al crear el proyecto" });
    }
};

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: "Usuario no autenticado" });
            return;
        }

        const projects = await prisma.project.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (projects.length > 0){
            res.status(200).json({projects})
        }else{
            res.status(200).json({message: 'No hay proyectos cargados aún.'})
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno al obtener los proyectos" });
    }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const updateData = req.body;
        
        if (!id) {
            res.status(400).json({ error: "El ID del proyecto es requerido" });
            return;
        }

        const project = await prisma.project.findUnique({ where: { id: id as string }});

        if (!project || project.userId !== userId) {
            res.status(404).json({ error: "Proyecto no encontrado o no autorizado" });
            return;
        };

        const updatedProject = await prisma.project.update({
            where: { id: id as string },
            data: {
                ...updateData
            }
        });

        res.status(200).json({message: 'Proyecto actualizado.', project: updatedProject})


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el proyecto" });
    }
};

export const deleteProyect = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: "El ID del proyecto es requerido" });
            return;
        }

        const project = await prisma.project.findUnique({ where: { id: id as string } });

        if (!project || project.userId !== userId) {
            res.status(404).json({ error: "Proyecto no encontrado o no autorizado" });
            return;
        };

        const projectDeleted = await prisma.project.delete({ where: { id: id as string }});

        res.status(200).json({message: 'Proyecto eliminado de manera satisfactoria.', project: projectDeleted})

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el proyecto" });
    }
};