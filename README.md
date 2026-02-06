# Evaluación Práctica Unidad 1 - AWOS y BDA 5°A

Dashboard de análisis de ventas para cafetería del campus, construido con Next.js (TypeScript) y PostgreSQL. La aplicación implementa seguridad real con usuario de solo lectura sobre VIEWS.

## 🏗️ Arquitectura

- **Frontend/Backend**: Next.js 15 (App Router + TypeScript)
- **Base de Datos**: PostgreSQL 16
- **Contenedores**: Docker & Docker Compose
- **ORM/Query**: node-postgres (pg)
- **Validación**: Zod

---

## 📋 Modelo de Datos

### Tablas (6 tablas con relaciones FK)

- `categories` - Categorías de productos
- `products` - Productos con stock y precios
- `customers` - Clientes registrados
- `orders` - Órdenes de compra con estado y canal
- `order_items` - Items de cada orden
- `payments` - Pagos asociados a órdenes

### VIEWS Implementadas (6 VIEWS)

1. **vw_sales_daily** - Ventas diarias con métricas agregadas (CTE, COALESCE)
2. **vw_top_products_ranked** - Ranking de productos por revenue (Window Functions)
3. **vw_inventory_risk** - Análisis de riesgo de inventario (CASE)
4. **vw_customer_value** - Valor de clientes por compras (LEFT JOIN, HAVING)
5. **vw_payment_mix** - Distribución de métodos de pago (CTE)
6. **vw_orders_channel_mix** - Distribución de canales de venta

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- Docker Desktop instalado
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/JILZXY/evaluacion-c1.git
cd evaluacion-c1
