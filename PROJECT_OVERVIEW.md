# 🍕 Cupido Pizza - Documentación del Proyecto

## 📌 Resumen Ejecutivo

Sistema de pedidos web para pizzería, optimizado para uso mediante QR en mesas. MVP simple y funcional.

---

## 🎯 Visión General

### Propósito
Facilitar pedidos directos desde las mesas del local mediante QR, con gestión centralizada para el administrador.

### Alcance
- **Fase 1:** ✅ Backend API (COMPLETADO)
- **Fase 2:** Frontend cliente y admin
- **Fase 3:** Deploy y configuración en producción

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

```
┌─────────────────────────────────────────┐
│           FRONTEND (React)              │
│  - Cliente: Pedidos simples             │
│  - Admin: Panel con Auth0               │
└─────────────┬───────────────────────────┘
              │
              │ HTTP/REST
              │
┌─────────────▼───────────────────────────┐
│        BACKEND (Node.js/Express)        │
│  - API REST                             │
│  - Autenticación JWT (Auth0)            │
│  - Validaciones                         │
└─────────────┬───────────────────────────┘
              │
              │ Data API
              │
┌─────────────▼───────────────────────────┐
│       MongoDB Atlas (Cloud)             │
│  - Colección: orders                    │
│  - Data API habilitada                  │
└─────────────────────────────────────────┘
```

### Hosting
- **Backend:** Vercel (serverless)
- **Frontend:** Vercel
- **Base de datos:** MongoDB Atlas (cloud)
- **Autenticación:** Auth0 (SaaS)

---

## 📊 Modelo de Datos

### Colección: `orders`

```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6789012345"),
  pizza: "Margarita",
  size: "mediana",              // "pequeña" | "mediana" | "grande"
  contactInfo: "Mesa 5",
  status: "pendiente",          // "pendiente" | "en_preparacion" | "listo" | "entregado"
  createdAt: "2026-01-15T10:30:00.000Z",
  updatedAt: "2026-01-15T10:30:00.000Z"
}
```

### Estados del Pedido

1. **pendiente** → Pedido recibido, esperando confirmación
2. **en_preparacion** → En cocina
3. **listo** → Listo para servir
4. **entregado** → Entregado al cliente

---

## 🔌 API Endpoints

### Públicos (sin autenticación)
- `POST /api/orders` - Crear pedido

### Protegidos (requieren Auth0 JWT)
- `GET /api/orders` - Listar todos los pedidos
- `GET /api/orders/:id` - Obtener pedido específico
- `PATCH /api/orders/:id/status` - Actualizar estado
- `DELETE /api/orders/:id` - Eliminar pedido

Ver documentación completa: [API_DOCS.md](API_DOCS.md)

---

## 🔐 Seguridad

### Implementado
- ✅ CORS configurado para orígenes permitidos
- ✅ Helmet para headers de seguridad
- ✅ Validación de entrada (express-validator)
- ✅ Autenticación JWT con Auth0
- ✅ API Key para MongoDB Data API
- ✅ Separación rutas públicas/protegidas

### Pendiente (futuro)
- Rate limiting
- Logs de auditoría
- Monitoreo de errores

---

## 📁 Estructura del Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── env.js              # Variables de entorno validadas
│   │   └── mongodb.js          # Config MongoDB Data API
│   │
│   ├── middleware/
│   │   ├── auth.js             # Autenticación Auth0 + JWT
│   │   └── validators.js       # Validaciones express-validator
│   │
│   ├── controllers/
│   │   └── orderController.js  # Lógica de controladores
│   │
│   ├── services/
│   │   └── orderService.js     # Interacción con MongoDB
│   │
│   ├── routes/
│   │   └── orderRoutes.js      # Definición de rutas
│   │
│   ├── models/
│   │   └── orderModel.js       # Modelo y validaciones de datos
│   │
│   ├── utils/
│   │   └── errors.js           # Manejo de errores
│   │
│   ├── app.js                  # Configuración Express
│   └── server.js               # Punto de entrada
│
├── .env.example                # Template variables de entorno
├── .gitignore
├── package.json
├── vercel.json                 # Config deploy Vercel
│
├── README.md                   # Documentación general
├── SETUP_GUIDE.md             # Guía configuración paso a paso
├── API_DOCS.md                # Documentación API detallada
└── PROJECT_OVERVIEW.md        # Este archivo
```

---

## 🚀 Guía de Inicio Rápido

### 1. Clonar e Instalar

```bash
cd backend
npm install
```

### 2. Configurar Entorno

```bash
cp .env.example .env
# Editar .env con credenciales reales
```

### 3. Iniciar Desarrollo

```bash
npm run dev
```

### 4. Probar API

```bash
# Health check
curl http://localhost:3000/health

# Crear pedido
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"pizza":"Margarita","size":"mediana","contactInfo":"Mesa 5"}'
```

Ver guía completa: [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 🎨 Flujo de Usuario

### Cliente (sin login)

```
1. Escanea QR en la mesa
   ↓
2. Ve página de inicio con info de la pizzería
   ↓
3. Opción: Ver menú (PDF)
   ↓
4. Accede a formulario de pedido
   ↓
5. Selecciona: pizza, tamaño, nombre/mesa
   ↓
6. Envía pedido
   ↓
7. Recibe confirmación
```

### Admin (con login Auth0)

```
1. Accede al panel de admin
   ↓
2. Login con Auth0
   ↓
3. Ve lista de pedidos en tiempo real
   ↓
4. Filtra por estado (pendiente, en preparación, etc.)
   ↓
5. Actualiza estado de cada pedido
   ↓
6. Tracking del flujo completo
```

---

## 📋 Checklist de Implementación

### ✅ Fase 1: Backend (COMPLETADO)

- [x] Estructura del proyecto
- [x] Configuración de Express
- [x] Integración MongoDB Atlas Data API
- [x] Modelo de datos (Order)
- [x] Endpoints de pedidos (CRUD)
- [x] Middleware de autenticación (Auth0)
- [x] Validaciones de entrada
- [x] Manejo de errores
- [x] Configuración CORS
- [x] Configuración para Vercel
- [x] Documentación completa

### ⏭️ Fase 2: Frontend (PENDIENTE)

- [ ] Setup proyecto React (Vite)
- [ ] Estructura de carpetas
- [ ] Página de inicio (info pizzería)
- [ ] Componente visor de menú (PDF)
- [ ] Formulario de pedido (cliente)
- [ ] Integración Auth0 (login admin)
- [ ] Panel de administración
- [ ] Lista de pedidos con filtros
- [ ] Gestión de estados
- [ ] Diseño responsive (mobile-first)
- [ ] Integración con API backend

### ⏭️ Fase 3: Deploy y Testing (PENDIENTE)

- [ ] Deploy backend en Vercel
- [ ] Deploy frontend en Vercel
- [ ] Configurar variables de entorno producción
- [ ] Configurar Auth0 para producción
- [ ] Testing end-to-end
- [ ] Generar QR codes para mesas
- [ ] Documentación de usuario final

---

## 🔧 Variables de Entorno Requeridas

```bash
# Server
PORT=3000
NODE_ENV=development

# MongoDB Atlas Data API
MONGODB_DATA_API_URL=https://data.mongodb-api.com/app/xxx/endpoint/data/v1
MONGODB_API_KEY=tu_api_key
MONGODB_DATABASE=cupidopizza
MONGODB_COLLECTION=orders

# Auth0
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_AUDIENCE=https://api.cupidopizza.com

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://tu-dominio.vercel.app
```

Ver [.env.example](.env.example) para template completo

---

## 📈 Próximos Pasos

1. ✅ **Backend completado** - API REST funcional
2. ⏭️ **Desarrollar Frontend** - React con Vite
3. ⏭️ **Integración completa** - Frontend ↔ Backend
4. ⏭️ **Testing** - Pruebas funcionales
5. ⏭️ **Deploy** - Producción en Vercel
6. ⏭️ **QR Generation** - Códigos para mesas

---

## 🤝 Convenciones de Código

### JavaScript
- ES Modules (`import/export`)
- Async/await para operaciones asíncronas
- JSDoc para documentación de funciones
- Nombres descriptivos en español para variables de negocio

### Estructura
- Separación de responsabilidades (MVC)
- Services para lógica de negocio
- Controllers para manejo de requests
- Middleware para validaciones y auth

### Git
- Commits descriptivos en español
- Branches: `feature/`, `fix/`, `docs/`

---

## 📞 Soporte y Contacto

Para dudas técnicas o mejoras, contactar al equipo de desarrollo.

---

## 📄 Licencia

MIT - Uso interno para Cupido Pizza

---

**Estado del Proyecto:** 🟢 Backend Completado | 🟡 Frontend en Progreso

**Última actualización:** 15 de Enero, 2026

---

Desarrollado con ❤️ para Cupido Pizza 🍕
