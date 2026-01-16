/**
 * Configuración de la aplicación Express
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/env.js';
import { connectDB } from './config/mongodb.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './utils/errors.js';

const app = express();

/**
 * Conectar a MongoDB al iniciar la app
 */
connectDB().catch(err => {
  console.error('Error fatal al conectar con MongoDB:', err);
  process.exit(1);
});

/**
 * Middlewares de seguridad
 */
app.use(helmet()); // Headers de seguridad

/**
 * CORS - Configuración para permitir orígenes específicos
 */
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    if (config.cors.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

/**
 * Middlewares de parsing
 */
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

/**
 * Logger - Solo en desarrollo
 */
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

/**
 * Rutas de health check
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cupido Pizza API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

/**
 * Rutas de la API
 */
app.use('/api/orders', orderRoutes);

/**
 * Ruta 404 - No encontrada
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

/**
 * Middleware de manejo de errores global
 */
app.use(errorHandler);

export default app;
