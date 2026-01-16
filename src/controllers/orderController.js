/**
 * Controlador para operaciones de pedidos
 */

import * as orderService from '../services/orderService.js';
import { createOrderDocument, createOrderUpdate, validateOrder, validateOrderStatus } from '../models/orderModel.js';
import { catchAsync } from '../utils/errors.js';

/**
 * @route   POST /api/orders
 * @desc    Crear un nuevo pedido
 * @access  Public
 */
export const createOrder = catchAsync(async (req, res) => {
  const { pizza, size, contactInfo } = req.body;

  // Validar datos del pedido
  const validation = validateOrder({ pizza, size, contactInfo });
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Datos de pedido inválidos',
      details: validation.errors
    });
  }

  // Crear documento de pedido
  const orderDocument = createOrderDocument({ pizza, size, contactInfo });

  // Guardar en base de datos
  const result = await orderService.createOrder(orderDocument);

  res.status(201).json({
    success: true,
    message: '¡Pedido creado exitosamente!',
    data: result.order
  });
});

/**
 * @route   GET /api/orders
 * @desc    Obtener todos los pedidos
 * @access  Private (Admin)
 */
export const getAllOrders = catchAsync(async (req, res) => {
  // Filtros opcionales desde query params
  const filters = {};
  
  if (req.query.status) {
    filters.status = req.query.status;
  }

  const result = await orderService.getAllOrders(filters);

  res.status(200).json({
    success: true,
    count: result.orders.length,
    data: result.orders
  });
});

/**
 * @route   GET /api/orders/:id
 * @desc    Obtener un pedido específico por ID
 * @access  Private (Admin)
 */
export const getOrderById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await orderService.getOrderById(id);

  if (!result.order) {
    return res.status(404).json({
      success: false,
      error: 'Pedido no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    data: result.order
  });
});

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Actualizar el estado de un pedido
 * @access  Private (Admin)
 */
export const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validar estado
  if (!validateOrderStatus(status)) {
    return res.status(400).json({
      success: false,
      error: 'Estado inválido'
    });
  }

  // Crear actualización
  const updateData = createOrderUpdate(status);

  // Actualizar en base de datos
  const result = await orderService.updateOrderStatus(id, updateData);

  if (!result.success) {
    return res.status(404).json({
      success: false,
      error: result.message
    });
  }

  res.status(200).json({
    success: true,
    message: 'Estado del pedido actualizado',
    data: { status }
  });
});

/**
 * @route   DELETE /api/orders/:id
 * @desc    Eliminar un pedido (opcional, para mantenimiento)
 * @access  Private (Admin)
 */
export const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await orderService.deleteOrder(id);

  if (result.deletedCount === 0) {
    return res.status(404).json({
      success: false,
      error: 'Pedido no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Pedido eliminado correctamente'
  });
});

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
