# 🍕 Cupido Pizza - Backend API

API REST para el sistema de pedidos de Cupido Pizza.

## 📋 Descripción

Backend simple y eficiente para gestionar pedidos de pizzería mediante QR en mesas.

### Stack Tecnológico

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de datos**: MongoDB Atlas Data API
- **Autenticación**: Auth0
- **Hosting**: Vercel

---

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ 
- Cuenta en MongoDB Atlas
- Cuenta en Auth0

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# Iniciar en modo desarrollo
npm run dev

# Iniciar en producción
npm start
```

---

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/           # Configuraciones
│   │   ├── env.js        # Variables de entorno
│   │   └── mongodb.js    # Config MongoDB
│   ├── middleware/       # Middlewares
│   │   ├── auth.js       # Autenticación Auth0
│   │   └── validators.js # Validaciones
│   ├── controllers/      # Controladores
│   │   └── orderController.js
│   ├── services/         # Lógica de negocio
│   │   └── orderService.js
│   ├── routes/           # Rutas API
│   │   └── orderRoutes.js
│   ├── models/           # Modelos de datos
│   │   └── orderModel.js
│   ├── utils/            # Utilidades
│   │   └── errors.js
│   ├── app.js            # Configuración Express
│   └── server.js         # Punto de entrada
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Pedidos (Público)

- `POST /api/orders` - Crear nuevo pedido

### Pedidos (Admin - Requiere Auth)

- `GET /api/orders` - Obtener todos los pedidos
- `GET /api/orders/:id` - Obtener pedido específico
- `PATCH /api/orders/:id/status` - Actualizar estado del pedido

---

## 🔐 Autenticación

Solo los endpoints de administración requieren autenticación mediante Auth0:

```javascript
Authorization: Bearer <token_jwt>
```

---

## 📊 Modelo de Datos

### Order (Pedido)

```javascript
{
  _id: ObjectId,
  pizza: String,           // Nombre de la pizza
  size: String,            // "pequeña", "mediana", "grande"
  contactInfo: String,     // Nombre o número de mesa
  status: String,          // "pendiente", "en_preparacion", "listo", "entregado"
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 Variables de Entorno

Ver `.env.example` para la configuración completa.

### Obligatorias

- `MONGODB_DATA_API_URL` - URL de MongoDB Atlas Data API
- `MONGODB_API_KEY` - API Key de MongoDB
- `AUTH0_DOMAIN` - Dominio de Auth0
- `AUTH0_AUDIENCE` - Audience de Auth0

---

## 🔧 Configuración de MongoDB Atlas Data API

1. Crear cluster en MongoDB Atlas
2. Habilitar Data API
3. Crear API Key con permisos de lectura/escritura
4. Copiar URL del endpoint y API Key

---

## 🔧 Configuración de Auth0

1. Crear aplicación en Auth0
2. Configurar API con identificador (audience)
3. Obtener dominio y audience
4. Configurar CORS y URLs permitidas

---

## 🚢 Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel dashboard
```

Crear archivo `vercel.json` en la raíz del backend.

---

## 📝 Estados de Pedido

1. **pendiente** - Pedido recibido, esperando confirmación
2. **en_preparacion** - Pedido en cocina
3. **listo** - Pedido listo para entregar
4. **entregado** - Pedido entregado al cliente

---

## 🔒 Seguridad

- CORS configurado para orígenes permitidos
- Helmet para headers de seguridad
- Validación de entrada con express-validator
- Autenticación JWT con Auth0
- API Key para MongoDB

---

## 📞 Soporte

Para dudas o problemas, contactar al equipo de desarrollo.

---

Desarrollado con ❤️ para Cupido Pizza
