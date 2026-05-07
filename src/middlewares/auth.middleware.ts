import { Response, NextFunction, Request } from "express";
import jwt, { JwtPayload }from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {userId: string};
}

export const verifyToken = (req: AuthRequest, res:Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401).json({error: 'Acceso denegado. No se proporciono Token.'})
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("Falta configurar JWT_SECRET en el archivo .env");
        }

        if (!token) {
            res.status(401).json({error: 'Acceso denegado. Token malformado.'});
            return;
        }

        const decoded = jwt.verify(token, secret);
        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
            req.user = { userId: (decoded as JwtPayload).userId }; 
            next();
        
        } else {
            res.status(401).json({ error: 'El token no tiene un formato válido.' });
        }

        } catch (error) {
            res.status(401).json({ error: 'Token inválido o expirado.' });
        }
}

