# 🔧 Solución a Errores de Conexión MongoDB en Vercel

## 🎯 Problema

Error SSL/TLS al conectar desde Vercel serverless:
```
MongoServerSelectionError: tlsv1 alert internal error
```

## ✅ Soluciones Implementadas

### 1. Código Optimizado para Serverless
- ✅ Conexión lazy (on-demand)
- ✅ Connection pooling optimizado
- ✅ Caché de conexión entre invocaciones
- ✅ Timeouts ajustados para serverless
- ✅ Handler específico para Vercel en `/api/index.js`

### 2. Configuración de MongoDB Atlas

#### ⚠️ IMPORTANTE: Configurar Network Access

**Paso 1: Permitir acceso desde Vercel**

1. Ve a MongoDB Atlas Dashboard
2. Click en **Network Access** (menú lateral)
3. Click en **Add IP Address**
4. Selecciona **"Allow Access from Anywhere"**
   - IP: `0.0.0.0/0`
   - Descripción: `Vercel - All IPs`
5. Click en **Confirm**

> **Nota:** Vercel usa IPs dinámicas, por lo que necesitas permitir todos los IPs. Esto es seguro porque la autenticación se hace con usuario/contraseña.

**Paso 2: Verificar Connection String**

Tu URI actual debe verse así:
```
mongodb+srv://mono:<password>@cluster0.4fwmjpr.mongodb.net/?retryWrites=true&w=majority
```

**Mejoras recomendadas para Vercel:**
```bash
MONGODB_URI=mongodb+srv://mono:<password>@cluster0.4fwmjpr.mongodb.net/?retryWrites=true&w=majority&appName=cupidopizza
```

Agrega `&appName=cupidopizza` al final para mejor tracking.

### 3. Variables de Entorno en Vercel

**Verifica que estén configuradas en Vercel Dashboard:**

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:

```bash
MONGODB_URI=mongodb+srv://mono:1036665034*@cluster0.4fwmjpr.mongodb.net/?retryWrites=true&w=majority&appName=cupidopizza
MONGODB_DATABASE=Pizzeria
MONGODB_COLLECTION=orders
AUTH0_DOMAIN=dev-76xwqqcy01cafiou.auth0.com
AUTH0_AUDIENCE=https://api.cupidopizza.com
ALLOWED_ORIGINS=https://tu-frontend.vercel.app,http://localhost:5173
NODE_ENV=production
```

**IMPORTANTE:** Después de agregar las variables, haz un **redeploy**:
```bash
vercel --prod
```

### 4. Estructura de Deploy

```
backend/
├── api/
│   └── index.js          ← Handler para Vercel (NUEVO)
├── src/
│   ├── app.js            ← Express app (modificado)
│   ├── config/
│   │   └── mongodb.js    ← Optimizado para serverless
│   └── ...
└── vercel.json           ← Configuración actualizada
```

## 🧪 Testing

### Test Local (debe seguir funcionando):
```bash
npm run dev
```

### Test en Vercel:
```bash
# Health check
curl https://tu-proyecto.vercel.app/health

# Crear pedido
curl -X POST https://tu-proyecto.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{"pizza":"Margarita","size":"mediana","contactInfo":"Mesa 5"}'
```

## ⚡ Optimizaciones Aplicadas

1. **Connection Pooling:**
   - `maxPoolSize: 10` (reducido para serverless)
   - `maxIdleTimeMS: 60000` (cerrar conexiones inactivas)

2. **Timeouts:**
   - `serverSelectionTimeoutMS: 10000`
   - `socketTimeoutMS: 45000`
   - `connectTimeoutMS: 10000`

3. **Caché:**
   - Reutilización de conexiones entre invocaciones
   - Variables globales para cachear cliente y db

4. **Retry:**
   - `retryWrites: true`
   - `retryReads: true`

## 🔍 Debugging

Si sigues teniendo problemas:

1. **Verifica logs en Vercel:**
   - Ve a tu proyecto → Deployments
   - Click en el deployment actual
   - Ve a "Functions" → logs

2. **Test Connection String:**
   ```bash
   # Usa mongosh para probar la conexión
   mongosh "mongodb+srv://mono:1036665034*@cluster0.4fwmjpr.mongodb.net/?retryWrites=true&w=majority"
   ```

3. **Verifica IP Whitelist:**
   - MongoDB Atlas → Network Access
   - Debe tener `0.0.0.0/0` (Allow from anywhere)

## 📋 Checklist

- [ ] Código actualizado (optimizado para serverless)
- [ ] Network Access configurado en MongoDB Atlas (`0.0.0.0/0`)
- [ ] Variables de entorno configuradas en Vercel
- [ ] Redeploy en Vercel
- [ ] Test de endpoints

## 🆘 Si Aún No Funciona

1. **Revisa que el usuario MongoDB tenga permisos:**
   - MongoDB Atlas → Database Access
   - Usuario debe tener rol `readWrite` en la database `Pizzeria`

2. **Verifica el nombre de la database:**
   - Tu database se llama `Pizzeria` (con mayúscula)
   - Debe coincidir exactamente en `.env` y Vercel

3. **Contraseña con caracteres especiales:**
   - Tu contraseña tiene `*` al final
   - Asegúrate de que esté URL-encoded correctamente
   - En la URI debe ser: `1036665034*` (como está)

---

¡Todo listo! El código ahora es compatible con Vercel serverless. 🚀
