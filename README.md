# Evaluación Práctica Unidad 1 - AWOS y BDA 5°A

Dashboard de análisis de ventas para cafetería del campus, construido con Next.js (TypeScript) y PostgreSQL. La aplicación implementa seguridad real con usuario de solo lectura sobre VIEWS.

---

## Instalación y Ejecución

### Requisitos Previos

- Docker Desktop instalado
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/JILZXY/evaluacion-c1.git
cd evaluacion-c1
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=cafe_analytics
POSTGRES_PORT=5432

# Application User (READ-ONLY on VIEWS)
DB_VIEWER_USER=app_user
DB_VIEWER_PASSWORD=app_secure_pass

# Application Configuration
NODE_ENV=development
PORT=3000
ROLE_ADMIN=admin
ROLE_USER=user
```

**Nota:** Puedes copiar el archivo de ejemplo `.env.example` si está disponible:
```bash
cp .env.example .env
```

### 3. Levantar con Docker (Recomendado)

Ejecuta el siguiente comando para construir y levantar los contenedores:

```bash
docker compose up --build
```

Esto iniciará:
- Base de datos PostgreSQL en `localhost:5432`
- Aplicación web en `http://localhost:3000`

### 4. Verificar la Instalación

Una vez que los contenedores estén corriendo, accede a:
- **Dashboard**: http://localhost:3000
- **Base de datos**: `localhost:5432` (usuario: `postgres`, password: `postgres123`)

---

## Seguridad - Usuario READ-ONLY

La aplicación NO se conecta como usuario `postgres`. Se utiliza un usuario `app_user` con permisos restringidos solo a SELECT sobre VIEWS.

### Verificación de Seguridad

1. **Conectarse al contenedor de base de datos:**

```bash
docker exec -it cafe_db psql -U postgres -d cafe_analytics
```

2. **Verificar permisos del usuario:**

```sql
-- Ver permisos sobre VIEWS
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE grantee = 'app_user';
```

Resultado esperado: Solo permisos `SELECT` sobre las 6 VIEWS.

3. **Probar restricciones:**

```sql
-- Conectarse como app_user
\c cafe_analytics app_user

-- Esto funciona (SELECT sobre VIEW)
SELECT * FROM vw_sales_daily LIMIT 5;

-- Esto falla (no tiene acceso a tablas)
SELECT * FROM products LIMIT 5;
```

Error esperado: `ERROR: permission denied for table products`

---

## Índices y Optimización

Se implementaron 3 índices para optimizar consultas frecuentes:

```sql
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_payments_method ON payments(method);
```

Para ver el análisis detallado de rendimiento con EXPLAIN, consulta [EXPLAIN.md](EXPLAIN.md).

---

## API Endpoints

Todos los endpoints requieren header `x-role: user` o `x-role: admin`.

### 1. Ventas Diarias
```
GET /api/reports/sales-daily?date_from=2024-01-01&date_to=2024-01-31
```

**Filtros:**
- `date_from` (opcional): Fecha inicio en formato YYYY-MM-DD
- `date_to` (opcional): Fecha fin en formato YYYY-MM-DD

### 2. Top Productos
```
GET /api/reports/top-products?search=cafe&page=1&limit=10
```

**Filtros:**
- `search` (opcional): Búsqueda por nombre de producto
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Items por página (default: 10)

### 3. Inventario en Riesgo
```
GET /api/reports/inventory-risk?category=Bebidas
```

**Filtros:**
- `category` (opcional): Nombre exacto de categoría (whitelist validado)

### 4. Valor de Clientes
```
GET /api/reports/customer-value?page=1&limit=10
```

**Filtros:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Items por página (default: 10)

### 5. Mix de Pagos
```
GET /api/reports/payment-mix
```

### 6. Mix de Canales
```
GET /api/reports/orders-channel-mix
```

---

## Pantallas de Reportes

La aplicación incluye las siguientes pantallas:

- `/` - Dashboard principal con navegación a reportes
- `/reports/sales-daily` - Ventas diarias con KPI de total del período
- `/reports/top-products` - Productos más vendidos con búsqueda y paginación
- `/reports/inventory-risk` - Productos con stock bajo, filtrado por categoría
- `/reports/customer-value` - Clientes por valor con paginación
- `/reports/payment-mix` - Distribución de métodos de pago
- `/reports/orders-channel-mix` - Distribución de canales de venta

Cada reporte incluye **KPIs destacados** que muestran métricas clave calculadas dinámicamente.

---

## Tecnologías Utilizadas

### Backend
- **Next.js 15**: Framework React con App Router
- **TypeScript**: Tipado estático
- **node-postgres (pg)**: Cliente PostgreSQL nativo
- **Zod**: Validación de esquemas y datos

### Base de Datos
- **PostgreSQL 16**: Base de datos relacional
- **VIEWS**: 6 vistas materializadas con SQL avanzado
- **Índices**: 3 índices B-tree para optimización

### Seguridad
- **Usuario read-only**: Acceso restringido solo a VIEWS
- **Validación Zod**: Prevención de SQL injection
- **Whitelist**: Filtros de categorías validados
- **Queries parametrizadas**: Protección contra ataques

### DevOps
- **Docker**: Contenedorización de aplicación y base de datos
- **Docker Compose**: Orquestación de servicios
- **Multi-stage builds**: Optimización de imágenes

---

## Desarrollo Local (sin Docker)

Si prefieres ejecutar la aplicación sin Docker:

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar PostgreSQL local
# Crear base de datos: cafe_analytics

# 3. Ejecutar scripts SQL manualmente
psql -U postgres -d cafe_analytics -f db/schema.sql
psql -U postgres -d cafe_analytics -f db/seed.sql
psql -U postgres -d cafe_analytics -f db/reports_vw.sql
psql -U postgres -d cafe_analytics -f db/index.sql

# 4. Crear usuario read-only
bash db/05_roles.sh

# 5. Configurar .env con DATABASE_URL
DATABASE_URL=postgres://app_user:app_secure_pass@localhost:5432/cafe_analytics

# 6. Iniciar servidor de desarrollo
npm run dev
```

Accede a http://localhost:3000

---

## Estructura del Proyecto

```
evaluacion-c1/
├── db/
│   ├── schema.sql          # Definición de tablas
│   ├── seed.sql            # Datos de prueba
│   ├── reports_vw.sql      # VIEWS documentadas
│   ├── index.sql           # Índices de optimización
│   ├── migrate.sql         # Migraciones
│   └── 05_roles.sh         # Script de seguridad
├── lib/
│   └── db.ts               # Pool de conexiones PostgreSQL
├── src/
│   └── app/
│       ├── api/
│       │   └── reports/    # API Routes por reporte
│       ├── reports/        # Páginas de reportes
│       ├── layout.tsx      # Layout principal
│       ├── page.tsx        # Dashboard home
│       └── middleware.ts   # Middleware de seguridad
├── public/                 # Archivos estáticos
├── .env                    # Variables de entorno (no incluir en Git)
├── .env.example            # Ejemplo de configuración
├── Dockerfile              # Imagen de Next.js
├── docker-compose.yml      # Orquestación de servicios
├── EXPLAIN.md              # Análisis de optimización
└── README.md               # Este archivo
```

---

## Notas Técnicas

### Paginación
- Implementada con LIMIT/OFFSET en `top-products` y `customer-value`
- Respuesta incluye metadatos: `{ data: [], pagination: { page, limit, total, totalPages } }`

### Validación
- Todos los inputs validados con Zod antes de ejecutar queries
- Whitelist en `inventory-risk` con 20 categorías permitidas
- Queries parametrizadas para prevenir SQL injection

---