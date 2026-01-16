/**
 * Utilidades para manejo de errores
 */

/**
 * Clase de error personalizada para errores de la aplicación
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware para manejo de errores global
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error para debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Error de validación de MongoDB
  if (err.name === 'ValidationError') {
    const message = 'Datos de entrada inválidos';
    error = new AppError(message, 400);
  }

  // Error de autenticación
  if (err.name === 'UnauthorizedError') {
    const message = 'Token inválido o expirado';
    error = new AppError(message, 401);
  }

  // Error de MongoDB ObjectId
  if (err.name === 'CastError') {
    const message = 'ID de recurso inválido';
    error = new AppError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Wrapper para funciones async que captura errores
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default {
  AppError,
  errorHandler,
  catchAsync
};
