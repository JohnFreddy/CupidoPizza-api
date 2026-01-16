/**
 * Modelo de datos para pedidos
 * 
 * Este modelo define la estructura de un pedido en la aplicación
 */

export const ORDER_STATUS = {
  PENDING: 'pendiente',
  IN_PREPARATION: 'en_preparacion',
  READY: 'listo',
  DELIVERED: 'entregado'
};

export const PIZZA_SIZES = {
  SMALL: 'pequeña',
  MEDIUM: 'mediana',
  LARGE: 'grande'
};

/**
 * Validación de orden
 * @param {Object} orderData - Datos del pedido
 * @returns {Object} - Objeto con isValid y errors
 */
export const validateOrder = (orderData) => {
  const errors = [];

  // Validar pizza
  if (!orderData.pizza || typeof orderData.pizza !== 'string' || orderData.pizza.trim() === '') {
    errors.push('Pizza es requerida y debe ser un texto válido');
  }

  // Validar tamaño
  const validSizes = Object.values(PIZZA_SIZES);
  if (!orderData.size || !validSizes.includes(orderData.size)) {
    errors.push(`Tamaño debe ser uno de: ${validSizes.join(', ')}`);
  }

  // Validar información de contacto
  if (!orderData.contactInfo || typeof orderData.contactInfo !== 'string' || orderData.contactInfo.trim() === '') {
    errors.push('Información de contacto es requerida');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validación de estado de orden
 * @param {string} status - Estado a validar
 * @returns {boolean}
 */
export const validateOrderStatus = (status) => {
  return Object.values(ORDER_STATUS).includes(status);
};

/**
 * Crear estructura de orden para guardar en DB
 * @param {Object} orderData - Datos del pedido
 * @returns {Object} - Orden formateada
 */
export const createOrderDocument = (orderData) => {
  const now = new Date().toISOString();
  
  return {
    pizza: orderData.pizza.trim(),
    size: orderData.size,
    contactInfo: orderData.contactInfo.trim(),
    status: ORDER_STATUS.PENDING,
    createdAt: now,
    updatedAt: now
  };
};

/**
 * Crear estructura de actualización de orden
 * @param {string} status - Nuevo estado
 * @returns {Object} - Actualización formateada
 */
export const createOrderUpdate = (status) => {
  return {
    status,
    updatedAt: new Date().toISOString()
  };
};
