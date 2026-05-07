import { Request, Response } from "express";
import prisma from '../config/db';
import bcrypt from 'bcryptjs';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        })

        if (existingUser){
            res.status(400).json({error: 'Este email ya se encuentra en uso. Porfavor prueba otro.'})
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passworHasheada = await bcrypt.hash(password, salt)
        const newUser = await prisma.user.create({
            data:{
                email: email,
                name: name,
                password: passworHasheada
            }
        });

        res.status(201).json({
            message: 'Usuario creado exitosamente.',
            user: {name: newUser.name, email: newUser.email}
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Error interno del servidor.'})
    }
};