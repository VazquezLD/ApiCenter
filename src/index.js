import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares globales
app.use(helmet()); // Seguridad de cabeceras
app.use(cors());   // Permitir que el frontend se conecte
app.use(express.json()); // Para que Express entienda JSON en el body

// Ruta de prueba (Health Check)
app.get('/health', (req, res) => {
  res.json({ status: 'ApiCenter esta corriendo correctamente', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});