CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_payments_method ON payments(method);