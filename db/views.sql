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

CREATE OR REPLACE VIEW vw_orders_channel_mix AS
SELECT
  channel,
  COUNT(id) AS total_orders,
  ROUND(COUNT(id) * 100.0 / (SELECT COUNT(*) FROM orders), 2) AS percent_of_total
FROM orders
GROUP BY channel;