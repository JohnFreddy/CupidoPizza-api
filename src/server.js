/**
 * Punto de entrada de la aplicación
 */

import app from './app.js';
import config from './config/env.js';
import { closeConnection } from './config/mongodb.js';

const PORT = config.port;

/**
 * Iniciar el servidor
 */
const server = app.listen(PORT, () => {
  console.log('\n🍕 ========================================');
  console.log(`   Cupido Pizza API - ${config.nodeEnv.toUpperCase()}`);
  console.log('   ========================================');
  console.log(`   🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`   📡 http://localhost:${PORT}`);
  console.log(`   🏥 Health check: http://localhost:${PORT}/health`);
  console.log('   ========================================\n');
});

/**
 * Manejo de errores no capturados
 */
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Cerrando servidor...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Cerrando servidor...');
  console.error(err);
  process.exit(1);
});

/**
 * Manejo de señales de terminación
 */
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor gracefully...');
  server.close(async () => {
    console.log('✅ Servidor HTTP cerrado');
    await closeConnection();
    console.log('✅ Conexión MongoDB cerrada');
    process.exit(0);
  });
});

export default server;
