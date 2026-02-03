-- vw_sales_daily: métricas por día
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
HAVING SUM(total_ventas) > 0;