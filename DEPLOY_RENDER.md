# 🚀 Guía para Desplegar en Render - Dashboard SafeHome

## 📋 Prerrequisitos

1. Tu proyecto debe estar en un repositorio de GitHub/GitLab
2. Cuenta gratuita en [Render.com](https://render.com)

## 🔧 Configuración del Proyecto

### 1. Archivos ya configurados ✅

- `package.json` - Scripts de build configurados
- `render.yaml` - Configuración automática para Render
- `.env.example` - Plantilla para variables de entorno

### 2. Verificar que el build funcione localmente

```bash
npm run build
npm run preview
```

## 🌐 Pasos para Desplegar en Render

### Método 1: Con archivo render.yaml (Recomendado)

1. **Sube tu código a GitHub**
   ```bash
   git add .
   git commit -m "Preparado para deploy en Render"
   git push origin main
   ```

2. **Conecta con Render**
   - Ve a [render.com](https://render.com) y crea cuenta
   - Click en "New +" → "Blueprint"
   - Conecta tu repositorio de GitHub
   - Render detectará automáticamente el `render.yaml`

3. **Deploy automático**
   - Render usará la configuración del `render.yaml`
   - Build Command: `npm run build`
   - Publish Directory: `./dist`

### Método 2: Configuración Manual

1. **En Render Dashboard**
   - Click "New +" → "Static Site"
   - Conecta tu repositorio

2. **Configuración Manual**
   ```
   Name: dashboard-safehome
   Branch: main
   Build Command: npm run build
   Publish Directory: dist
   ```

3. **Variables de Entorno (si las necesitas)**
   - En Render Dashboard → tu servicio → Environment
   - Agregar variables tipo: `VITE_API_URL=https://tu-api.com`

## ⚙️ Configuración Avanzada

### Auto-Deploy
- Render desplegará automáticamente cada vez que hagas push a `main`

### Dominio Personalizado
- En Render Dashboard → Settings → Custom Domains
- Agregar tu dominio personalizado

### Variables de Entorno de Producción
```bash
# En Render Dashboard → Environment
VITE_APP_TITLE=Dashboard SafeHome
VITE_API_URL=https://tu-backend.com
NODE_VERSION=18
```

## 🔍 Troubleshooting

### Error de Build
```bash
# Si falla el build, verificar localmente:
npm install
npm run build
```

### Rutas no funcionan (404)
- El `render.yaml` ya incluye la configuración de SPA
- Todas las rutas redirigen a `index.html`

### Variables de entorno no funcionan
- Asegúrate que empiecen con `VITE_`
- Accede con `import.meta.env.VITE_VARIABLE_NAME`

## 📱 URLs Finales

Después del deploy tendrás:
- **URL de Render**: `https://dashboard-safehome.onrender.com`
- **Dominio personalizado**: Tu propio dominio (opcional)

## 🎯 Comandos Útiles

```bash
# Verificar build local
npm run build && npm run preview

# Ver logs en tiempo real (en Render Dashboard)
# Deploy → Logs

# Forzar nuevo deploy
# Render Dashboard → Manual Deploy
```

## 🚀 ¡Listo!

Una vez configurado, cualquier cambio que hagas y subas a GitHub se desplegará automáticamente en Render.

### Credenciales de prueba del dashboard:
- Usuario: `admin`  
- Contraseña: `admin123`