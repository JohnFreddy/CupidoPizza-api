/**
 * Middleware de autenticación con Auth0
 * 
 * Protege rutas que requieren autenticación de administrador
 */

import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import config from '../config/env.js';

/**
 * Middleware para verificar JWT de Auth0
 */
export const checkJwt = jwt({
  // Obtener la clave pública de Auth0
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.auth0.domain}/.well-known/jwks.json`
  }),

  // Validar el audience y el issuer
  audience: config.auth0.audience,
  issuer: `https://${config.auth0.domain}/`,
  algorithms: ['RS256']
});

/**
 * Middleware opcional para verificar permisos o roles específicos
 * (Se puede expandir en el futuro si se necesitan diferentes roles de admin)
 */
export const checkPermissions = (requiredPermissions = []) => {
  return (req, res, next) => {
    // Si no hay permisos requeridos, solo verificar que esté autenticado
    if (requiredPermissions.length === 0) {
      return next();
    }

    // Obtener permisos del token (si Auth0 los incluye)
    const userPermissions = req.auth?.permissions || [];

    // Verificar que el usuario tenga todos los permisos requeridos
    const hasAllPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos suficientes para realizar esta acción'
      });
    }

    next();
  };
};

/**
 * Middleware para manejar errores de autenticación
 */
export const handleAuthError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.'
    });
  }
  next(err);
};

export default {
  checkJwt,
  checkPermissions,
  handleAuthError
};
