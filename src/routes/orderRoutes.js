/**
 * Rutas para operaciones de pedidos
 */

import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { checkJwt, handleAuthError } from '../middleware/auth.js';
import { validateCreateOrder, validateUpdateStatus, validateOrderId } from '../middleware/validators.js';

const router = express.Router();

/**
 * Rutas públicas (sin autenticación)
 */

// Crear nuevo pedido
router.post(
  '/',
  validateCreateOrder,
  orderController.createOrder
);

/**
 * Rutas protegidas (requieren autenticación de admin)
 */

// Obtener todos los pedidos
router.get(
  '/',
  checkJwt,
  handleAuthError,
  orderController.getAllOrders
);

// Obtener pedido por ID
router.get(
  '/:id',
  checkJwt,
  handleAuthError,
  validateOrderId,
  orderController.getOrderById
);

// Actualizar estado del pedido
router.patch(
  '/:id/status',
  checkJwt,
  handleAuthError,
  validateUpdateStatus,
  orderController.updateOrderStatus
);

// Eliminar pedido (opcional)
router.delete(
  '/:id',
  checkJwt,
  handleAuthError,
  validateOrderId,
  orderController.deleteOrder
);

export default router;
