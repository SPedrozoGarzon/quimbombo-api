# 📋 Documentación de Servicios Web — QUIMBOMBO API

**Proyecto:** Sistema de Inventario QUIMBOMBO  
**Versión:** 1.0.0  
**Tecnología:** Node.js + Express  
**Base URL:** `http://localhost:3000`  
**Evidencia:** GA7-220501096-AA5-EV03

---

## 🔐 Autenticación

Todos los endpoints (excepto `/api/usuarios/login`) requieren los siguientes headers HTTP:

| Header | Descripción | Ejemplo |
|--------|-------------|---------|
| `x-username` | Nombre de usuario registrado | `admin` |
| `x-password` | Contraseña del usuario | `admin123` |

**Usuarios de prueba:**

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `admin123` | Administrador |
| `maria` | `emp123` | Empleado |
| `carlos` | `emp123` | Empleado |

**Permisos por rol:**

| Acción | Admin | Empleado |
|--------|-------|----------|
| Ver productos | ✅ | ✅ |
| Crear productos | ✅ | ✅ |
| Editar productos | ✅ | ❌ |
| Eliminar productos | ✅ | ❌ |
| Registrar entradas | ✅ | ✅ |
| Registrar salidas | ✅ | ❌ |
| Ver movimientos | ✅ | ✅ |
| Gestionar usuarios | ✅ | ❌ |
| Ver reportes | ✅ | ✅ |

---

## 📦 1. Servicio de Productos

### 1.1 Listar todos los productos

| Campo | Detalle |
|-------|---------|
| **Método** | `GET` |
| **URL** | `/api/productos` |
| **Autenticación** | Requerida |
| **Rol** | Admin / Empleado |

**Parámetros opcionales (query string):**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `categoria` | string | Filtrar por categoría | `?categoria=Frutos secos` |
| `stockBajo` | boolean | Solo productos con stock bajo | `?stockBajo=true` |

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "total": 8,
  "datos": [
    {
      "id": "p001",
      "codigo": "QB0001",
      "nombre": "Almendras tostadas",
      "categoria": "Frutos secos",
      "unidad": "Kilogramos (kg)",
      "stock": 45,
      "stockMinimo": 10,
      "precio": 28000,
      "descripcion": "Almendras californianas tostadas sin sal",
      "activo": true,
      "fechaRegistro": "2025-01-10"
    }
  ]
}
```

---

### 1.2 Obtener producto por ID

| Campo | Detalle |
|-------|---------|
| **Método** | `GET` |
| **URL** | `/api/productos/:id` |
| **Autenticación** | Requerida |
| **Rol** | Admin / Empleado |

**Parámetro de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | ID único del producto |

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "datos": {
    "id": "p001",
    "codigo": "QB0001",
    "nombre": "Almendras tostadas",
    "categoria": "Frutos secos",
    "unidad": "Kilogramos (kg)",
    "stock": 45,
    "stockMinimo": 10,
    "precio": 28000,
    "descripcion": "Almendras californianas tostadas sin sal",
    "activo": true,
    "fechaRegistro": "2025-01-10"
  }
}
```

**Respuesta error (404):**
```json
{
  "exito": false,
  "mensaje": "Producto no encontrado"
}
```

---

### 1.3 Crear producto

| Campo | Detalle |
|-------|---------|
| **Método** | `POST` |
| **URL** | `/api/productos` |
| **Autenticación** | Requerida |
| **Rol** | Admin / Empleado |
| **Content-Type** | `application/json` |

**Cuerpo de la solicitud (Body):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombre` | string | ✅ | Nombre del producto |
| `categoria` | string | ✅ | Categoría del producto |
| `unidad` | string | ✅ | Unidad de medida |
| `stock` | number | ❌ | Stock inicial (default: 0) |
| `stockMinimo` | number | ❌ | Stock mínimo permitido (default: 0) |
| `precio` | number | ❌ | Precio unitario en COP (default: 0) |
| `descripcion` | string | ❌ | Descripción del producto |

**Ejemplo de solicitud:**
```json
{
  "nombre": "Pistachos salados",
  "categoria": "Frutos secos",
  "unidad": "Kilogramos (kg)",
  "stock": 20,
  "stockMinimo": 5,
  "precio": 65000,
  "descripcion": "Pistachos importados con sal marina"
}
```

**Respuesta exitosa (201):**
```json
{
  "exito": true,
  "mensaje": "Producto creado exitosamente",
  "datos": {
    "id": "uuid-generado",
    "codigo": "QB0009",
    "nombre": "Pistachos salados",
    "categoria": "Frutos secos",
    "unidad": "Kilogramos (kg)",
    "stock": 20,
    "stockMinimo": 5,
    "precio": 65000,
    "descripcion": "Pistachos importados con sal marina",
    "activo": true,
    "fechaRegistro": "2025-03-20"
  }
}
```

---

### 1.4 Actualizar producto

| Campo | Detalle |
|-------|---------|
| **Método** | `PUT` |
| **URL** | `/api/productos/:id` |
| **Autenticación** | Requerida |
| **Rol** | Solo Admin |

**Campos actualizables:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `nombre` | string | Nuevo nombre |
| `categoria` | string | Nueva categoría |
| `unidad` | string | Nueva unidad |
| `stockMinimo` | number | Nuevo stock mínimo |
| `precio` | number | Nuevo precio |
| `descripcion` | string | Nueva descripción |

**Ejemplo de solicitud:**
```json
{
  "precio": 70000,
  "stockMinimo": 8
}
```

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Producto actualizado",
  "datos": { }
}
```

---

### 1.5 Eliminar producto

| Campo | Detalle |
|-------|---------|
| **Método** | `DELETE` |
| **URL** | `/api/productos/:id` |
| **Autenticación** | Requerida |
| **Rol** | Solo Admin |

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Producto eliminado correctamente"
}
```

> ⚠️ La eliminación es **lógica**: el producto se marca como inactivo pero no se borra físicamente de la base de datos.

---

## 🔄 2. Servicio de Movimientos

### 2.1 Listar todos los movimientos

| Campo | Detalle |
|-------|---------|
| **Método** | `GET` |
| **URL** | `/api/movimientos` |
| **Autenticación** | Requerida |
| **Rol** | Admin / Empleado |

**Parámetros opcionales (query string):**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `tipo` | string | `entrada` o `salida` | `?tipo=entrada` |
| `productoId` | string | ID del producto | `?productoId=p001` |
| `desde` | date | Fecha inicio (YYYY-MM-DD) | `?desde=2025-03-01` |
| `hasta` | date | Fecha fin (YYYY-MM-DD) | `?hasta=2025-03-31` |

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "total": 5,
  "datos": [
    {
      "id": "m001",
      "tipo": "entrada",
      "productoId": "p001",
      "nombreProducto": "Almendras tostadas",
      "cantidad": 20,
      "fecha": "2025-03-01",
      "responsable": "admin",
      "observaciones": "Compra proveedor Los Andes"
    }
  ]
}
```

---

### 2.2 Obtener movimiento por ID

| Campo | Detalle |
|-------|---------|
| **Método** | `GET` |
| **URL** | `/api/movimientos/:id` |
| **Autenticación** | Requerida |
| **Rol** | Admin / Empleado |

---

### 2.3 Registrar movimiento

| Campo | Detalle |
|-------|---------|
| **Método** | `POST` |
| **URL** | `/api/movimientos` |
| **Autenticación** | Requerida |
| **Rol** | Admin (entrada+salida) / Empleado (solo entrada) |

**Cuerpo de la solicitud:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `tipo` | string | ✅ | `"entrada"` o `"salida"` |
| `productoId` | string | ✅ | ID del producto |
| `cantidad` | number | ✅ | Cantidad a mover (mayor a 0) |
| `fecha` | string | ✅ | Fecha en formato YYYY-MM-DD |
| `observaciones` | string | ❌ | Nota adicional |

**Ejemplo de solicitud:**
```json
{
  "tipo": "entrada",
  "productoId": "p001",
  "cantidad": 15,
  "fecha": "2025-03-20",
  "observaciones": "Reposición urgente de stock"
}
```

**Respuesta exitosa (201):**
```json
{
  "exito": true,
  "mensaje": "Entrada registrada correctamente",
  "datos": {
    "id": "uuid-generado",
    "tipo": "entrada",
    "productoId": "p001",
    "nombreProducto": "Almendras tostadas",
    "cantidad": 15,
    "fecha": "2025-03-20",
    "responsable": "admin",
    "observaciones": "Reposición urgente de stock"
  },
  "stockActual": 60
}
```

**Error stock insuficiente (400):**
```json
{
  "exito": false,
  "mensaje": "Stock insuficiente. Disponible: 3"
}
```

---

## 👥 3. Servicio de Usuarios

### 3.1 Login

| Campo | Detalle |
|-------|---------|
| **Método** | `POST` |
| **URL** | `/api/usuarios/login` |
| **Autenticación** | ❌ No requerida |
| **Rol** | Público |

**Cuerpo de la solicitud:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Inicio de sesión exitoso",
  "datos": {
    "id": "u001",
    "nombre": "Administrador QUIMBOMBO",
    "username": "admin",
    "rol": "admin",
    "activo": true,
    "fechaCreacion": "2025-01-10"
  }
}
```

---

### 3.2 Listar usuarios

| Campo | Detalle |
|-------|---------|
| **Método** | `GET` |
| **URL** | `/api/usuarios` |
| **Autenticación** | Requerida |
| **Rol** | Solo Admin |

---

### 3.3 Crear usuario

| Campo | Detalle |
|-------|---------|
| **Método** | `POST` |
| **URL** | `/api/usuarios` |
| **Autenticación** | Requerida |
| **Rol** | Solo Admin |

**Cuerpo de la solicitud:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombre` | string | ✅ | Nombre completo |
| `username` | string | ✅ | Usuario único para login |
| `password` | string | ✅ | Mínimo 6 caracteres |
| `rol` | string | ✅ | `"admin"` o `"empleado"` |

---

### 3.4 Eliminar usuario

| Campo | Detalle |
|-------|---------|
| **Método** | `DELETE` |
| **URL** | `/api/usuarios/:id` |
| **Autenticación** | Requerida |
| **Rol** | Solo Admin |

> ⚠️ No se puede eliminar el usuario `admin` principal.

---

## 📈 4. Servicio de Reportes

### 4.1 Resumen general

| Campo | Detalle |
|-------|---------|
| **Método** | `GET` |
| **URL** | `/api/reportes/resumen` |
| **Autenticación** | Requerida |
| **Rol** | Admin / Empleado |

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "datos": {
    "totalProductos": 8,
    "productosSinStock": 0,
    "productosStockBajo": 3,
    "totalMovimientos": 5,
    "totalEntradas": 135,
    "totalSalidas": 17,
    "balanceUnidades": 118,
    "valorInventario": 7845000
  }
}
```

---

### 4.2 Stock por categoría

| Campo | Detalle |
|-------|---------|
| **Método** | `GET` |
| **URL** | `/api/reportes/stock-por-categoria` |
| **Autenticación** | Requerida |
| **Rol** | Admin / Empleado |

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "datos": [
    {
      "categoria": "Frutos secos",
      "totalStock": 78,
      "totalProductos": 3,
      "valorTotal": 3570000
    }
  ]
}
```

---

### 4.3 Alertas de inventario

| Campo | Detalle |
|-------|---------|
| **Método** | `GET` |
| **URL** | `/api/reportes/alertas` |
| **Autenticación** | Requerida |
| **Rol** | Admin / Empleado |

---

### 4.4 Top productos con más movimientos

| Campo | Detalle |
|-------|---------|
| **Método** | `GET` |
| **URL** | `/api/reportes/top-movimientos` |
| **Autenticación** | Requerida |
| **Rol** | Admin / Empleado |

---

## ❌ Códigos de Error

| Código | Significado |
|--------|-------------|
| `400` | Solicitud incorrecta — faltan campos o datos inválidos |
| `401` | No autenticado — credenciales incorrectas o faltantes |
| `403` | Prohibido — el rol no tiene permiso para esta acción |
| `404` | No encontrado — el recurso solicitado no existe |
| `409` | Conflicto — el recurso ya existe (ej: username duplicado) |

---

## 🗺️ Resumen de Endpoints

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Info de la API | Público |
| POST | `/api/usuarios/login` | Iniciar sesión | Público |
| GET | `/api/productos` | Listar productos | Todos |
| GET | `/api/productos/:id` | Ver producto | Todos |
| POST | `/api/productos` | Crear producto | Todos |
| PUT | `/api/productos/:id` | Editar producto | Admin |
| DELETE | `/api/productos/:id` | Eliminar producto | Admin |
| GET | `/api/movimientos` | Listar movimientos | Todos |
| GET | `/api/movimientos/:id` | Ver movimiento | Todos |
| POST | `/api/movimientos` | Registrar movimiento | Todos* |
| GET | `/api/usuarios` | Listar usuarios | Admin |
| POST | `/api/usuarios` | Crear usuario | Admin |
| DELETE | `/api/usuarios/:id` | Eliminar usuario | Admin |
| GET | `/api/reportes/resumen` | Resumen general | Todos |
| GET | `/api/reportes/stock-por-categoria` | Stock por categoría | Todos |
| GET | `/api/reportes/alertas` | Alertas de stock | Todos |
| GET | `/api/reportes/top-movimientos` | Top movimientos | Todos |

> *Empleados solo pueden registrar entradas, no salidas.
