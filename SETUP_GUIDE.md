# 📋 Guía de Configuración - Cupido Pizza Backend

## 🔧 Configuración de MongoDB Atlas Data API

### Paso 1: Crear Cluster en MongoDB Atlas

1. Ir a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear una cuenta o iniciar sesión
3. Crear un nuevo cluster (M0 Free es suficiente para MVP)
4. Esperar a que el cluster esté listo (2-5 minutos)

### Paso 2: Habilitar Data API

1. En el dashboard del cluster, ir a **App Services**
2. Click en **Create a New App** o usar una app existente
3. En el menú lateral, ir a **HTTPS Endpoints**
4. Click en **Data API**
5. Habilitar la Data API
6. Copiar el **URL Endpoint** (será algo como: `https://data.mongodb-api.com/app/application-xxxxx/endpoint/data/v1`)

### Paso 3: Crear API Key

1. En la sección de **Data API**, ir a **API Keys**
2. Click en **Create API Key**
3. Dar un nombre descriptivo (ej: "cupidopizza-backend")
4. Copiar el **API Key** (solo se muestra una vez, guárdala bien)

### Paso 4: Configurar Base de Datos y Colección

1. En el cluster, click en **Browse Collections**
2. Click en **Create Database**
   - Database name: `cupidopizza`
   - Collection name: `orders`
3. Click en **Create**

### Paso 5: Actualizar .env

```bash
MONGODB_DATA_API_URL=https://data.mongodb-api.com/app/application-xxxxx/endpoint/data/v1
MONGODB_API_KEY=tu_api_key_real_aqui
MONGODB_DATABASE=cupidopizza
MONGODB_COLLECTION=orders
```

### Paso 6: Verificar Data Source Name

En el archivo [mongodb.js](src/config/mongodb.js), verifica que el `dataSource` coincida con el nombre de tu cluster:

```javascript
dataSource: 'Cluster0', // Ajustar según tu cluster
```

---

## 🔐 Configuración de Auth0

### Paso 1: Crear Cuenta en Auth0

1. Ir a [Auth0](https://auth0.com/)
2. Crear una cuenta o iniciar sesión
3. Crear un nuevo tenant

### Paso 2: Crear Aplicación (Frontend)

1. En el dashboard, ir a **Applications** → **Applications**
2. Click en **Create Application**
3. Nombre: "Cupido Pizza Admin"
4. Tipo: **Single Page Web Applications**
5. Click en **Create**

### Paso 3: Configurar Aplicación

En la configuración de la aplicación:

**Allowed Callback URLs:**
```
http://localhost:5173/callback,
https://tu-dominio.vercel.app/callback
```

**Allowed Logout URLs:**
```
http://localhost:5173,
https://tu-dominio.vercel.app
```

**Allowed Web Origins:**
```
http://localhost:5173,
https://tu-dominio.vercel.app
```

### Paso 4: Crear API

1. En el dashboard, ir a **Applications** → **APIs**
2. Click en **Create API**
3. Nombre: "Cupido Pizza API"
4. Identifier (Audience): `https://api.cupidopizza.com`
5. Signing Algorithm: **RS256**
6. Click en **Create**

### Paso 5: Actualizar .env

```bash
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_AUDIENCE=https://api.cupidopizza.com
```

### Paso 6: Crear Usuario Admin (Opcional)

1. En el dashboard, ir a **User Management** → **Users**
2. Click en **Create User**
3. Configurar email y contraseña para el admin

---

## 🚀 Instalación y Ejecución Local

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales reales
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

### 4. Probar endpoints

**Health check:**
```bash
curl http://localhost:3000/health
```

**Crear pedido (público):**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "pizza": "Margarita",
    "size": "mediana",
    "contactInfo": "Mesa 5"
  }'
```

---

## 🌐 Deploy en Vercel

### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

### 2. Login en Vercel

```bash
vercel login
```

### 3. Deploy

```bash
cd backend
vercel
```

### 4. Configurar Variables de Entorno en Vercel

En el dashboard de Vercel:

1. Ir a **Settings** → **Environment Variables**
2. Agregar todas las variables del archivo `.env`:
   - `MONGODB_DATA_API_URL`
   - `MONGODB_API_KEY`
   - `MONGODB_DATABASE`
   - `MONGODB_COLLECTION`
   - `AUTH0_DOMAIN`
   - `AUTH0_AUDIENCE`
   - `ALLOWED_ORIGINS` (incluir la URL de tu frontend en Vercel)

3. Hacer redeploy:
```bash
vercel --prod
```

---

## 🧪 Probar la API en Producción

Una vez deployado en Vercel, la URL será algo como:
```
https://cupidopizza-backend.vercel.app
```

**Health check:**
```bash
curl https://cupidopizza-backend.vercel.app/health
```

**Crear pedido:**
```bash
curl -X POST https://cupidopizza-backend.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "pizza": "Pepperoni",
    "size": "grande",
    "contactInfo": "Mesa 3"
  }'
```

---

## 📊 Verificar Datos en MongoDB Atlas

1. Ir a MongoDB Atlas
2. Click en **Browse Collections**
3. Seleccionar database `cupidopizza`
4. Seleccionar collection `orders`
5. Ver los documentos insertados

---

## ⚠️ Troubleshooting

### Error: "Variables de entorno faltantes"
- Verificar que el archivo `.env` existe y tiene todas las variables
- En Vercel, verificar que las variables están configuradas correctamente

### Error: "CORS policy"
- Verificar que la URL del frontend está en `ALLOWED_ORIGINS`
- Actualizar en `.env` local y en Vercel

### Error: "Token inválido"
- Verificar configuración de Auth0
- Asegurarse de que el `audience` y `domain` son correctos
- Verificar que el token JWT no ha expirado

### Error al conectar con MongoDB
- Verificar que la API Key es correcta
- Verificar que la URL del Data API es correcta
- Verificar que el cluster está activo

---

## 📞 Próximos Pasos

1. ✅ Backend completado y configurado
2. ⏭️ Crear frontend en React
3. ⏭️ Integrar Auth0 en el frontend
4. ⏭️ Conectar frontend con backend
5. ⏭️ Deploy completo

---

¡El backend está listo para usar! 🎉
