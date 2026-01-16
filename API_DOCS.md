# 📚 Documentación de API - Cupido Pizza

## Base URL

**Local:** `http://localhost:3000`  
**Producción:** `https://tu-dominio.vercel.app`

---

## 🔓 Endpoints Públicos

### 1. Health Check

Verificar que el servidor está funcionando.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2026-01-15T10:30:00.000Z"
}
```

---

### 2. Crear Pedido

Crear un nuevo pedido desde la mesa del cliente.

**Endpoint:** `POST /api/orders`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "pizza": "Margarita",
  "size": "mediana",
  "contactInfo": "Mesa 5"
}
```

**Campos:**
- `pizza` (string, requerido): Nombre de la pizza (3-100 caracteres)
- `size` (string, requerido): Tamaño - `pequeña`, `mediana`, o `grande`
- `contactInfo` (string, requerido): Nombre o número de mesa (1-50 caracteres)

**Response exitoso (201):**
```json
{
  "success": true,
  "message": "¡Pedido creado exitosamente!",
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "pizza": "Margarita",
    "size": "mediana",
    "contactInfo": "Mesa 5",
    "status": "pendiente",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  }
}
```

**Error de validación (400):**
```json
{
  "success": false,
  "error": "Error de validación",
  "details": [
    {
      "field": "size",
      "message": "Tamaño debe ser: pequeña, mediana, grande"
    }
  ]
}
```

---

## 🔐 Endpoints Protegidos (Admin)

Estos endpoints requieren autenticación mediante token JWT de Auth0.

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json
```

---

### 3. Obtener Todos los Pedidos

Listar todos los pedidos en el sistema.

**Endpoint:** `GET /api/orders`

**Query Parameters (opcionales):**
- `status`: Filtrar por estado (`pendiente`, `en_preparacion`, `listo`, `entregado`)

**Ejemplos:**
- `GET /api/orders` - Todos los pedidos
- `GET /api/orders?status=pendiente` - Solo pendientes

**Response exitoso (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6789012345",
      "pizza": "Pepperoni",
      "size": "grande",
      "contactInfo": "Mesa 3",
      "status": "en_preparacion",
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-15T10:35:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6789012346",
      "pizza": "Hawaiana",
      "size": "mediana",
      "contactInfo": "Mesa 7",
      "status": "pendiente",
      "createdAt": "2026-01-15T10:28:00.000Z",
      "updatedAt": "2026-01-15T10:28:00.000Z"
    }
  ]
}
```

**Error de autenticación (401):**
```json
{
  "success": false,
  "error": "Token inválido o expirado. Por favor, inicia sesión nuevamente."
}
```

---

### 4. Obtener Pedido por ID

Obtener detalles de un pedido específico.

**Endpoint:** `GET /api/orders/:id`

**Parámetros:**
- `id`: ID del pedido (24 caracteres hexadecimales)

**Ejemplo:**
```
GET /api/orders/65a1b2c3d4e5f6789012345
```

**Response exitoso (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "pizza": "Margarita",
    "size": "mediana",
    "contactInfo": "Mesa 5",
    "status": "listo",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:45:00.000Z"
  }
}
```

**Error pedido no encontrado (404):**
```json
{
  "success": false,
  "error": "Pedido no encontrado"
}
```

---

### 5. Actualizar Estado del Pedido

Cambiar el estado de un pedido.

**Endpoint:** `PATCH /api/orders/:id/status`

**Parámetros:**
- `id`: ID del pedido

**Body:**
```json
{
  "status": "en_preparacion"
}
```

**Estados válidos:**
- `pendiente` - Pedido recibido
- `en_preparacion` - En cocina
- `listo` - Listo para servir
- `entregado` - Entregado al cliente

**Response exitoso (200):**
```json
{
  "success": true,
  "message": "Estado del pedido actualizado",
  "data": {
    "status": "en_preparacion"
  }
}
```

**Error estado inválido (400):**
```json
{
  "success": false,
  "error": "Estado inválido"
}
```

---

### 6. Eliminar Pedido

Eliminar un pedido del sistema (mantenimiento/admin).

**Endpoint:** `DELETE /api/orders/:id`

**Parámetros:**
- `id`: ID del pedido

**Response exitoso (200):**
```json
{
  "success": true,
  "message": "Pedido eliminado correctamente"
}
```

---

## 📊 Códigos de Estado HTTP

- `200` - OK (Operación exitosa)
- `201` - Created (Recurso creado)
- `400` - Bad Request (Datos inválidos)
- `401` - Unauthorized (Token inválido/expirado)
- `403` - Forbidden (Sin permisos)
- `404` - Not Found (Recurso no encontrado)
- `500` - Internal Server Error (Error del servidor)

---

## 🔒 Autenticación con Auth0

### Obtener Token JWT

1. El usuario admin inicia sesión en el frontend
2. Auth0 devuelve un token JWT
3. El frontend incluye el token en cada petición protegida

**Formato del header:**
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Ejemplo con cURL

```bash
curl -X GET https://api.cupidopizza.com/api/orders \
  -H "Authorization: Bearer tu_token_aqui"
```

### Ejemplo con JavaScript (Fetch)

```javascript
const response = await fetch('https://api.cupidopizza.com/api/orders', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 🧪 Ejemplos de Uso Completos

### Flujo de Pedido Completo

**1. Cliente crea pedido:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "pizza": "Cuatro Quesos",
    "size": "grande",
    "contactInfo": "Mesa 8"
  }'
```

**2. Admin ve pedidos pendientes:**
```bash
curl -X GET http://localhost:3000/api/orders?status=pendiente \
  -H "Authorization: Bearer <token>"
```

**3. Admin actualiza a "en preparación":**
```bash
curl -X PATCH http://localhost:3000/api/orders/65a1b2c3d4e5f6789012345/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "en_preparacion"}'
```

**4. Admin actualiza a "listo":**
```bash
curl -X PATCH http://localhost:3000/api/orders/65a1b2c3d4e5f6789012345/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "listo"}'
```

**5. Admin actualiza a "entregado":**
```bash
curl -X PATCH http://localhost:3000/api/orders/65a1b2c3d4e5f6789012345/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "entregado"}'
```

---

## 🔍 Errores Comunes

### Error 401: Token inválido

**Causa:** Token JWT expirado o inválido  
**Solución:** Renovar el token mediante Auth0

### Error 400: Validación

**Causa:** Datos enviados no cumplen las validaciones  
**Solución:** Revisar el formato y valores permitidos

### Error 404: Pedido no encontrado

**Causa:** El ID del pedido no existe o es inválido  
**Solución:** Verificar que el ID es correcto y tiene 24 caracteres

---

¡Listo para integrar! 🚀
