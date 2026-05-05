# 🌰 QUIMBOMBO — API REST de Inventario

Sistema de inventario para la empresa **QUIMBOMBO**, dedicada a la comercialización de frutos secos y snacks saludables.

**Evidencia:** GA7-220501096-AA5-EV03  
**Programa:** SENA — Análisis y Desarrollo de Software  
**Tecnología:** Node.js + Express  

---

## 📁 Estructura del Proyecto

```
QUIMBOMBO_API/
├── src/
│   ├── server.js                        # Servidor principal
│   ├── routes/
│   │   ├── productos.js                 # Rutas de productos
│   │   └── otros.js                     # Rutas movimientos, usuarios, reportes
│   ├── controllers/
│   │   ├── productosController.js       # Lógica de productos
│   │   ├── movimientosController.js     # Lógica de movimientos
│   │   ├── usuariosController.js        # Lógica de usuarios
│   │   └── reportesController.js        # Lógica de reportes
│   ├── middleware/
│   │   └── auth.js                      # Autenticación y roles
│   └── data/
│       ├── productos.json               # Base de datos productos
│       ├── movimientos.json             # Base de datos movimientos
│       └── usuarios.json               # Base de datos usuarios
├── docs/
│   └── DOCUMENTACION_API.md            # Documentación completa de servicios
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Requisitos

- **Node.js** v16 o superior
- **npm** v8 o superior

Verificar instalación:
```bash
node --version
npm --version
```

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/quimbombo-api.git
cd quimbombo-api
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor
```bash
# Modo producción
npm start

# Modo desarrollo (con recarga automática)
npm run dev
```

### 4. Verificar que funciona
Abrir en el navegador: **http://localhost:3000**

Deberías ver:
```json
{
  "nombre": "QUIMBOMBO API",
  "version": "1.0.0",
  "estado": "activo"
}
```

---

## 🔐 Autenticación

La API usa autenticación por headers HTTP. En cada solicitud (excepto `/login`) debes enviar:

```
x-username: admin
x-password: admin123
```

**Usuarios disponibles:**

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `admin123` | Administrador |
| `maria` | `emp123` | Empleado |
| `carlos` | `emp123` | Empleado |

---

## 🧪 Ejemplos de Uso con Thunder Client o Postman

### Login
```
POST http://localhost:3000/api/usuarios/login
Body: { "username": "admin", "password": "admin123" }
```

### Listar productos
```
GET http://localhost:3000/api/productos
Headers: x-username: admin | x-password: admin123
```

### Crear producto
```
POST http://localhost:3000/api/productos
Headers: x-username: admin | x-password: admin123
Body:
{
  "nombre": "Pistachos salados",
  "categoria": "Frutos secos",
  "unidad": "Kilogramos (kg)",
  "stock": 20,
  "stockMinimo": 5,
  "precio": 65000
}
```

### Registrar entrada de inventario
```
POST http://localhost:3000/api/movimientos
Headers: x-username: admin | x-password: admin123
Body:
{
  "tipo": "entrada",
  "productoId": "p001",
  "cantidad": 10,
  "fecha": "2025-03-20",
  "observaciones": "Reposición de stock"
}
```

### Ver reporte resumen
```
GET http://localhost:3000/api/reportes/resumen
Headers: x-username: admin | x-password: admin123
```

---

## 📋 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Información de la API |
| POST | `/api/usuarios/login` | Iniciar sesión |
| GET | `/api/productos` | Listar productos |
| GET | `/api/productos/:id` | Ver un producto |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/:id` | Editar producto (admin) |
| DELETE | `/api/productos/:id` | Eliminar producto (admin) |
| GET | `/api/movimientos` | Listar movimientos |
| POST | `/api/movimientos` | Registrar movimiento |
| GET | `/api/usuarios` | Listar usuarios (admin) |
| POST | `/api/usuarios` | Crear usuario (admin) |
| DELETE | `/api/usuarios/:id` | Eliminar usuario (admin) |
| GET | `/api/reportes/resumen` | Resumen general |
| GET | `/api/reportes/stock-por-categoria` | Stock por categoría |
| GET | `/api/reportes/alertas` | Alertas de inventario |
| GET | `/api/reportes/top-movimientos` | Productos más activos |

---

## 🔗 Repositorio

**GitHub:** https://github.com/TU_USUARIO/quimbombo-api

> 📌 Reemplaza `TU_USUARIO` con tu usuario real de GitHub antes de entregar.

---

## 👨‍💻 Autor

**Nombre:** TU NOMBRE COMPLETO  
**Ficha:** TU NÚMERO DE FICHA  
**Programa:** Análisis y Desarrollo de Software  
**Centro de Formación:** SENA  
**Año:** 2025
