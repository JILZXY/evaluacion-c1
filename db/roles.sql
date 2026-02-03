-- Crear rol app
CREATE ROLE app_user LOGIN PASSWORD 'securepassword';

-- Dar permisos solo sobre views
GRANT SELECT ON vw_sales_daily, vw_top_products_ranked,
vw_inventory_risk, vw_customer_value, vw_payment_mix TO app_user;