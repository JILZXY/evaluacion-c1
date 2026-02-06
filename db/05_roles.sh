#!/bin/bash
set -e

# Este script se ejecuta dentro del contenedor de base de datos al iniciarse
# Utiliza las variables de entorno inyectadas por docker-compose para crear el usuario

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE ROLE $DB_VIEWER_USER LOGIN PASSWORD '$DB_VIEWER_PASSWORD';
    
    -- Dar permisos solo sobre views
    GRANT SELECT ON vw_sales_daily, vw_top_products_ranked, 
    vw_inventory_risk, vw_customer_value, vw_payment_mix, vw_orders_channel_mix TO $DB_VIEWER_USER;
EOSQL
