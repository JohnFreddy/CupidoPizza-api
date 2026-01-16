/**
 * Middleware de validación para pedidos
 */

import { body, param, validationResult } from 'express-validator';
import { PIZZA_SIZES, ORDER_STATUS } from '../models/orderModel.js';

/**
 * Middleware para manejar errores de validación
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

/**
 * Validaciones para crear un pedido
 */
export const validateCreateOrder = [
  body('pizza')
    .trim()
    .notEmpty().withMessage('Pizza es requerida')
    .isLength({ min: 3, max: 100 }).withMessage('Pizza debe tener entre 3 y 100 caracteres'),
  
  body('size')
    .trim()
    .notEmpty().withMessage('Tamaño es requerido')
    .isIn(Object.values(PIZZA_SIZES)).withMessage(`Tamaño debe ser: ${Object.values(PIZZA_SIZES).join(', ')}`),
  
  body('contactInfo')
    .trim()
    .notEmpty().withMessage('Información de contacto es requerida')
    .isLength({ min: 1, max: 50 }).withMessage('Información de contacto debe tener entre 1 y 50 caracteres'),
  
  handleValidationErrors
];

/**
 * Validaciones para actualizar estado de pedido
 */
export const validateUpdateStatus = [
  param('id')
    .trim()
    .notEmpty().withMessage('ID de pedido es requerido')
    .isLength({ min: 24, max: 24 }).withMessage('ID de pedido inválido'),
  
  body('status')
    .trim()
    .notEmpty().withMessage('Estado es requerido')
    .isIn(Object.values(ORDER_STATUS)).withMessage(`Estado debe ser: ${Object.values(ORDER_STATUS).join(', ')}`),
  
  handleValidationErrors
];

/**
 * Validaciones para obtener pedido por ID
 */
export const validateOrderId = [
  param('id')
    .trim()
    .notEmpty().withMessage('ID de pedido es requerido')
    .isLength({ min: 24, max: 24 }).withMessage('ID de pedido inválido'),
  
  handleValidationErrors
];

export default {
  validateCreateOrder,
  validateUpdateStatus,
  validateOrderId,
  handleValidationErrors
};
