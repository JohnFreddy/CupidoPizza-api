/**
 * Configuración de variables de entorno
 */

import dotenv from 'dotenv';

dotenv.config();

/**
 * Validar que las variables de entorno requeridas existan
 */
const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DATABASE',
  'MONGODB_COLLECTION',
  'AUTH0_DOMAIN',
  'AUTH0_AUDIENCE'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}

export const config = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB Atlas - Driver Nativo
  mongodb: {
    uri: process.env.MONGODB_URI,
    database: process.env.MONGODB_DATABASE,
    collection: process.env.MONGODB_COLLECTION
  },
  
  // Auth0
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE
  },
  
  // CORS
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:3000']
  }
};

export default config;
