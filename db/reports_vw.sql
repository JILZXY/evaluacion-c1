-- ====================================================================================
-- VIEW: vw_sales_daily
-- Descripción: Ventas agregadas por día con métricas de tickets y ticket promedio
-- Grain: 1 fila por día (DATE)
-- Métricas: 
--   - total_ventas: suma de todos los pagos del día
--   - tickets: cantidad de órdenes completadas
--   - ticket_promedio: promedio de venta por orden
-- Tecnologías: CTE, COALESCE, NULLIF, agregación (SUM, COUNT)
-- 
-- VERIFY queries:
-- SELECT * FROM vw_sales_daily WHERE day = '2024-01-15';
-- SELECT SUM(total_ventas), SUM(tickets) FROM vw_sales_daily;
-- ====================================================================================
CREATE OR REPLACE VIEW vw_sales_daily AS
WITH daily_sales AS (
  SELECT
    DATE(o.created_at) AS day,
    COUNT(o.id) AS tickets,
    SUM(p.paid_amount) AS total_ventas
  FROM orders o
  JOIN payments p ON o.id = p.order_id
  GROUP BY DATE(o.created_at)
)
SELECT
  day,
  total_ventas,
  tickets,
  COALESCE(total_ventas / NULLIF(tickets,0),0) AS ticket_promedio
FROM daily_sales
WHERE total_ventas > 0;

-- ====================================================================================
-- VIEW: vw_top_products_ranked
-- Descripción: Productos rankeados por revenue y unidades vendidas
-- Grain: 1 fila por producto
-- Métricas:
--   - total_units: cantidad total de unidades vendidas
--   - total_revenue: ingresos totales generados por el producto
--   - rank_revenue: posición del producto por ingresos (1 = mayor ingreso)
--   - rank_units: posición del producto por unidades vendidas
-- Tecnologías: Window Functions (RANK), agregación, HAVING
--
-- VERIFY queries:
-- SELECT * FROM vw_top_products_ranked WHERE rank_revenue <= 10;
-- SELECT COUNT(*) FROM vw_top_products_ranked WHERE total_units > 50;
-- ====================================================================================
CREATE OR REPLACE VIEW vw_top_products_ranked AS
SELECT
  p.id AS product_id,
  p.name AS product_name,
  SUM(oi.qty) AS total_units,
  SUM(oi.qty * oi.unit_price) AS total_revenue,
  RANK() OVER (ORDER BY SUM(oi.qty * oi.unit_price) DESC) AS rank_revenue,
  RANK() OVER (ORDER BY SUM(oi.qty) DESC) AS rank_units
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
HAVING SUM(oi.qty) > 0;

-- ====================================================================================
-- VIEW: vw_inventory_risk
-- Descripción: Productos activos con análisis de riesgo de inventario bajo
-- Grain: 1 fila por producto
-- Métricas:
--   - stock: cantidad actual en inventario
--   - risk_percent: porcentaje de riesgo (productos con <20 unidades)
-- Tecnologías: CASE, JOIN
--
-- VERIFY queries:
-- SELECT * FROM vw_inventory_risk WHERE risk_percent > 0 ORDER BY stock ASC;
-- SELECT category_name, COUNT(*) FROM vw_inventory_risk GROUP BY category_name;
-- ====================================================================================
CREATE OR REPLACE VIEW vw_inventory_risk AS
SELECT
  p.id AS product_id,
  p.name AS product_name,
  c.name AS category_name,
  p.stock,
  CASE 
    WHEN p.stock < 20 THEN ROUND((p.stock::numeric / 100) * 100, 2)
    ELSE 0
  END AS risk_percent
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active';

-- ====================================================================================
-- VIEW: vw_customer_value
-- Descripción: Valor total generado por cada cliente con métricas de compra
-- Grain: 1 fila por cliente
-- Métricas:
--   - num_orders: cantidad de órdenes realizadas por el cliente
--   - total_spent: gasto total acumulado del cliente
--   - avg_spent: gasto promedio por orden
-- Tecnologías: LEFT JOIN, COALESCE, NULLIF, HAVING
--
-- VERIFY queries:
-- SELECT * FROM vw_customer_value WHERE num_orders >= 5 ORDER BY total_spent DESC;
-- SELECT AVG(avg_spent), MAX(total_spent) FROM vw_customer_value;
-- ====================================================================================
CREATE OR REPLACE VIEW vw_customer_value AS
SELECT
  c.id AS customer_id,
  c.name AS customer_name,
  COUNT(o.id) AS num_orders,
  SUM(p.paid_amount) AS total_spent,
  COALESCE(SUM(p.paid_amount) / NULLIF(COUNT(o.id),0),0) AS avg_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
LEFT JOIN payments p ON o.id = p.order_id
GROUP BY c.id, c.name
HAVING SUM(p.paid_amount) > 0;

-- ====================================================================================
-- VIEW: vw_payment_mix
-- Descripción: Distribución de métodos de pago con porcentajes del total
-- Grain: 1 fila por método de pago
-- Métricas:
--   - total_amount: monto total pagado con cada método
--   - percent_of_total: porcentaje que representa del total de pagos
-- Tecnologías: CTE, subquery, agregación (SUM)
--
-- VERIFY queries:
-- SELECT * FROM vw_payment_mix ORDER BY total_amount DESC;
-- SELECT SUM(percent_of_total) FROM vw_payment_mix; -- debe ser 100
-- ====================================================================================
CREATE OR REPLACE VIEW vw_payment_mix AS
WITH totals AS (
  SELECT SUM(paid_amount) AS grand_total FROM payments
)
SELECT
  method,
  SUM(paid_amount) AS total_amount,
  ROUND((SUM(paid_amount) / (SELECT grand_total FROM totals)) * 100, 2) AS percent_of_total
FROM payments
GROUP BY method;

-- ====================================================================================
-- VIEW: vw_orders_channel_mix (VIEW adicional)
-- Descripción: Distribución de órdenes por canal de venta
-- Grain: 1 fila por canal (in-store, online)
-- Métricas:
--   - total_orders: cantidad de órdenes por canal
--   - percent_of_total: porcentaje que representa del total de órdenes
-- Tecnologías: Subquery, agregación, ROUND
--
-- VERIFY queries:
-- SELECT * FROM vw_orders_channel_mix;
-- SELECT SUM(percent_of_total) FROM vw_orders_channel_mix; -- debe ser 100
-- ====================================================================================
CREATE OR REPLACE VIEW vw_orders_channel_mix AS
SELECT
  channel,
  COUNT(id) AS total_orders,
  ROUND(COUNT(id) * 100.0 / (SELECT COUNT(*) FROM orders), 2) AS percent_of_total
FROM orders
GROUP BY channel;
