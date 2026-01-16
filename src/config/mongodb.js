/**
 * Configuración y conexión a MongoDB usando Driver Nativo
 * Optimizado para ambientes serverless (Vercel)
 */

import { MongoClient, ServerApiVersion } from 'mongodb';
import config from './env.js';

// Variable global para cachear la conexión en el contexto de ejecución
let cachedClient = null;
let cachedDb = null;

/**
 * Conectar a MongoDB Atlas (optimizado para serverless)
 * @returns {Promise<{client: MongoClient, db: Db}>}
 */
export const connectDB = async () => {
  // Si ya existe una conexión en caché, reutilizarla
  if (cachedClient && cachedDb) {
    console.log('⚡ Reutilizando conexión existente de MongoDB');
    return { client: cachedClient, db: cachedDb };
  }

  try {
    console.log('🔌 Creando nueva conexión a MongoDB Atlas...');

    // Opciones optimizadas para serverless
    const client = new MongoClient(config.mongodb.uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      // Optimizaciones para Vercel/Serverless
      maxPoolSize: 10, // Reducir pool para serverless
      minPoolSize: 1,
      maxIdleTimeMS: 60000, // Cerrar conexiones inactivas después de 1 min
      serverSelectionTimeoutMS: 10000, // Timeout más corto
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
      w: 'majority'
    });

    await client.connect();
    
    const db = client.db(config.mongodb.database);
    
    // Verificar conexión con ping
    await db.admin().ping();
    
    console.log('✅ Conectado exitosamente a MongoDB Atlas');

    // Cachear la conexión
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    // Limpiar caché en caso de error
    cachedClient = null;
    cachedDb = null;
    throw new Error(`Error de conexión a MongoDB: ${error.message}`);
  }
};

/**
 * Obtener la colección de pedidos
 * @returns {Promise<Collection>} - Colección de MongoDB
 */
export const getOrdersCollection = async () => {
  const { db } = await connectDB();
  return db.collection(config.mongodb.collection);
};

/**
 * Cerrar conexión (principalmente para testing o shutdown)
 * En serverless, Vercel maneja el ciclo de vida automáticamente
 */
export const closeConnection = async () => {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('🔌 Conexión a MongoDB cerrada');
  }
};

export default {
  connectDB,
  getOrdersCollection,
  closeConnection
};
