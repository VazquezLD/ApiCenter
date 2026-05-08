import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import router from './routes/router';
import { swaggerDocs } from './config/swagger';

dotenv.config();

const app = express();

// Middlewares globales
app.use(helmet()); // Seguridad de cabeceras
app.use(cors());   // Permitir que el frontend se conecte
app.use(express.json()); // Para que Express entienda JSON en el body

// Rutas de los endpoints definidos, primera versión 
// Se separa en otro router para poder crear otro v2 y que no se caiga la app mientras se prueban los nuevos.

app.use('/api/v1/', router)


// Ruta de prueba (Health Check)
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ApiCenter esta corriendo correctamente', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
swaggerDocs(app, PORT);
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});