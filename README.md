# Dashboard de Administración

## Descripción
Dashboard de administración para gestión de residentes, visitantes y seguridad de un complejo residencial. Desarrollado con React + Vite y TypeScript.

## Características
- 🔐 Sistema de autenticación
- 📊 Dashboard principal con estadísticas en tiempo real
- 👥 Gestión de residentes y visitantes
- 📹 Monitoreo de cámaras de seguridad
- 📋 Historial de actividades
- 📊 Generación de reportes
- ⚙️ Panel de configuración
- 📱 Diseño responsive

## Tecnologías
- React 18
- TypeScript
- Vite
- CSS3 con Flexbox y Grid

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd Dashboard
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el proyecto en modo desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## Credenciales de Acceso
- **Usuario:** admin
- **Contraseña:** admin123

## Scripts Disponibles
- `npm run dev` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto
```
src/
├── App.tsx          # Componente principal con lógica de autenticación
├── App.css          # Estilos del login
├── Dashboard.tsx    # Componente del dashboard principal
├── Dashboard.css    # Estilos del dashboard
├── main.tsx         # Punto de entrada de la aplicación
└── index.css        # Estilos globales
```

## Funcionalidades del Dashboard

### Panel Principal
- Estadísticas en tiempo real de residentes activos
- Conteo de ingresos diarios
- Monitoreo de visitantes activos
- Estado de cámaras online

### Actividad Reciente
- Registro de ingresos y salidas
- Actualizaciones del sistema
- Nuevos visitantes registrados
- Historial con timestamps

### Alertas del Sistema
- Mantenimientos programados
- Backups completados
- Notificaciones de seguridad

### Acciones Rápidas
- Registrar nuevo visitante
- Buscar residente
- Exportar reportes

## Navegación
La aplicación cuenta con un sidebar lateral con las siguientes secciones:
- 🏠 Dashboard
- 👥 Residentes
- 🚶 Visitantes
- 📋 Historial
- 📹 Cámaras
- 📊 Reportes
- ⚙️ Configuración

## Desarrollo
Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Autor
Desarrollado para Tecsup - PreTesis Dashboard

## Licencia
Este proyecto es parte de un trabajo de tesis académica.
