-- Crear usuario viewer (contraseña debe coincidir con DB_VIEWER_PASSWORD del .env)
CREATE ROLE viewer_user LOGIN PASSWORD 'CambiarPorPasswordDelEnv';

-- Dar permisos solo sobre views
GRANT SELECT ON vw_sales_daily, vw_top_products_ranked,
vw_inventory_risk, vw_customer_value, vw_payment_mix, vw_orders_channel_mix TO viewer_user;