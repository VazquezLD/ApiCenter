import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import prisma from "../config/db.js";
import { z } from "zod";

const createProjectSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    baseUrl: z.string().url("Debes proporcionar una URL válida (ej: https://google.com)"),
    description: z.string().optional(),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]).default("GET"),
    tags: z.array(z.string()).default([])
});

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: "Usuario no autenticado" });
            return;
        }

        // Restricción: Máximo 9 proyectos por usuario
        const projectCount = await prisma.project.count({
            where: { userId }
        });

        if (projectCount >= 9) {
            res.status(403).json({ 
                error: "Límite alcanzado", 
                message: "Has alcanzado el límite máximo de 9 proyectos permitidos por cuenta." 
            });
            return;
        }

        const validation = createProjectSchema.safeParse(req.body);
        
        if (!validation.success) {
            res.status(400).json({ 
                error: "Datos inválidos", 
                details: validation.error.issues.map(e => e.message)
            });
            return;
        }
        const { name, baseUrl, description, method, tags } = validation.data;

        const newProject = await prisma.project.create({
        data: {
                name,
                baseUrl,
                description: description ?? null,
                method: method as any,
                tags,
                userId,
                status: "ACTIVO",
                lastStatus: "PENDIENTE"
            }
        });

        res.status(201).json({
            message: "Proyecto creado exitosamente",
            project: newProject
        });

    } catch (error) {
        console.error("Error en createProject:", error);
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
            include: {
                logs: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Mapear para incluir la última latencia directamente en el objeto
        const projectsWithLatency = projects.map(p => ({
            ...p,
            lastResponseTime: p.logs.length > 0 ? p.logs[0].responseTime : null,
            // Aseguramos que el status refleje el último chequeo si existe
            currentStatus: p.logs.length > 0 ? (p.logs[0].isOnline ? 'online' : 'offline') : 'pending'
        }));

        res.status(200).json(projectsWithLatency);

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

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
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

export const getProjectLogs = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const project = await prisma.project.findUnique({
            where: { id: id as string }
        });

        if (!project || project.userId !== userId) {
            res.status(404).json({ error: "Proyecto no encontrado o no autorizado" });
            return;
        }

        const logs = await prisma.log.findMany({
            where: { projectId: id as string },
            orderBy: { createdAt: 'desc' },
            take: 50 
        });

        res.status(200).json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los logs" });
    }
};

export const checkProjectStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        // 1. Buscar el proyecto y validar que sea del usuario
        const project = await prisma.project.findUnique({
            where: { id: id as string }
        });

        if (!project || project.userId !== userId) {
            res.status(404).json({ error: "Proyecto no encontrado" });
            return;
        }

        // 2. Ejecutar el "Ping" manual
        const startTime = Date.now();
        let isOnline = false;
        let statusCode = 0;

        try {
            const url = project.baseUrl.startsWith('http') ? project.baseUrl : `https://${project.baseUrl}`;
            const response = await fetch(url, { 
                method: project.method,
                signal: AbortSignal.timeout(10000) 
            });
            statusCode = response.status;
            isOnline = response.ok;
        } catch (err) {
            isOnline = false;
            statusCode = 0;
        }

        const responseTime = Date.now() - startTime;

        // 3. Guardar en DB (Update status y Crear Log)
        const [updatedProject, newLog] = await prisma.$transaction([
            prisma.project.update({
                where: { id: project.id },
                data: { lastStatus: isOnline ? "ONLINE" : "OFFLINE" }
            }),
            prisma.log.create({
                data: {
                    statusCode,
                    responseTime,
                    isOnline,
                    projectId: project.id
                }
            })
        ]);

        // 4. Devolver el resultado al front
        res.status(200).json({
            message: "Chequeo completado",
            status: updatedProject.lastStatus,
            responseTime,
            statusCode
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al realizar el chequeo manual" });
    }
};