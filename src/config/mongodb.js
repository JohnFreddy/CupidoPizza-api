/**
 * Configuración y conexión a MongoDB usando Driver Nativo
 */

import { MongoClient, ServerApiVersion } from 'mongodb';
import config from './env.js';

let client;
let db;
let ordersCollection;

/**
 * Conectar a MongoDB Atlas
 */
export const connectDB = async () => {
  try {
    if (client) {
      console.log('⚡ Usando conexión existente de MongoDB');
      return { client, db, ordersCollection };
    }

    console.log('🔌 Conectando a MongoDB Atlas...');

    client = new MongoClient(config.mongodb.uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    
    // Ping para verificar conexión
    await client.db('admin').command({ ping: 1 });
    
    // Configurar database y collection
    db = client.db(config.mongodb.database);
    ordersCollection = db.collection(config.mongodb.collection);

    console.log('✅ Conectado exitosamente a MongoDB Atlas');

    return { client, db, ordersCollection };
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    throw error;
  }
};

/**
 * Obtener la colección de pedidos
 * @returns {Collection} - Colección de MongoDB
 */
export const getOrdersCollection = async () => {
  if (!ordersCollection) {
    await connectDB();
  }
  return ordersCollection;
};

/**
 * Cerrar conexión (para testing o shutdown graceful)
 */
export const closeConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    ordersCollection = null;
    console.log('🔌 Conexión a MongoDB cerrada');
  }
};

export default {
  connectDB,
  getOrdersCollection,
  closeConnection
};
