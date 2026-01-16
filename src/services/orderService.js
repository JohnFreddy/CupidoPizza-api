/**
 * Servicio para interactuar con MongoDB usando el Driver Nativo
 * 
 * Este servicio maneja todas las operaciones CRUD para pedidos
 */

import { ObjectId } from 'mongodb';
import { getOrdersCollection } from '../config/mongodb.js';

/**
 * Crear un nuevo pedido
 * @param {Object} orderData - Datos del pedido
 * @returns {Promise<Object>} - Pedido creado con su ID
 */
export const createOrder = async (orderData) => {
  try {
    const collection = await getOrdersCollection();
    const result = await collection.insertOne(orderData);
    
    return {
      success: true,
      insertedId: result.insertedId.toString(),
      order: {
        _id: result.insertedId,
        ...orderData
      }
    };
  } catch (error) {
    console.error('Error al crear pedido:', error.message);
    throw new Error('Error al crear el pedido en la base de datos');
  }
};

/**
 * Obtener todos los pedidos
 * @param {Object} filters - Filtros opcionales
 * @returns {Promise<Array>} - Lista de pedidos
 */
export const getAllOrders = async (filters = {}) => {
  try {
    const collection = await getOrdersCollection();
    const orders = await collection
      .find(filters)
      .sort({ createdAt: -1 }) // Más recientes primero
      .limit(100) // Límite razonable para un MVP
      .toArray();
    
    return {
      success: true,
      orders
    };
  } catch (error) {
    console.error('Error al obtener pedidos:', error.message);
    throw new Error('Error al obtener los pedidos de la base de datos');
  }
};

/**
 * Obtener un pedido por ID
 * @param {string} orderId - ID del pedido
 * @returns {Promise<Object|null>} - Pedido o null si no existe
 */
export const getOrderById = async (orderId) => {
  try {
    const collection = await getOrdersCollection();
    const order = await collection.findOne({ _id: new ObjectId(orderId) });
    
    return {
      success: true,
      order
    };
  } catch (error) {
    console.error('Error al obtener pedido:', error.message);
    throw new Error('Error al obtener el pedido de la base de datos');
  }
};

/**
 * Actualizar estado de un pedido
 * @param {string} orderId - ID del pedido
 * @param {Object} updateData - Datos a actualizar
 * @returns {Promise<Object>} - Resultado de la actualización
 */
export const updateOrderStatus = async (orderId, updateData) => {
  try {
    const collection = await getOrdersCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return {
        success: false,
        message: 'Pedido no encontrado'
      };
    }

    return {
      success: true,
      modifiedCount: result.modifiedCount,
      message: 'Estado actualizado correctamente'
    };
  } catch (error) {
    console.error('Error al actualizar pedido:', error.message);
    throw new Error('Error al actualizar el pedido en la base de datos');
  }
};

/**
 * Eliminar un pedido (opcional, para mantenimiento)
 * @param {string} orderId - ID del pedido
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const deleteOrder = async (orderId) => {
  try {
    const collection = await getOrdersCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(orderId) });
    
    return {
      success: true,
      deletedCount: result.deletedCount
    };
  } catch (error) {
    console.error('Error al eliminar pedido:', error.message);
    throw new Error('Error al eliminar el pedido de la base de datos');
  }
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
