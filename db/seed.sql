-- =========================
-- Categorías
-- =========================
INSERT INTO categories (id, name) VALUES
(gen_random_uuid(), 'Bebidas'),
(gen_random_uuid(), 'Postres'),
(gen_random_uuid(), 'Snacks'),
(gen_random_uuid(), 'Café'),
(gen_random_uuid(), 'Sandwiches');

-- =========================
-- Productos
-- =========================
INSERT INTO products (id, name, category_id, price, stock, active) VALUES
(gen_random_uuid(), 'Latte', (SELECT id FROM categories WHERE name='Café'), 45.00, 50, true),
(gen_random_uuid(), 'Capuccino', (SELECT id FROM categories WHERE name='Café'), 40.00, 30, true),
(gen_random_uuid(), 'Brownie', (SELECT id FROM categories WHERE name='Postres'), 25.00, 20, true),
(gen_random_uuid(), 'Galletas', (SELECT id FROM categories WHERE name='Snacks'), 15.00, 100, true),
(gen_random_uuid(), 'Sandwich de Pollo', (SELECT id FROM categories WHERE name='Sandwiches'), 60.00, 10, true);

-- =========================
-- Clientes
-- =========================
INSERT INTO customers (id, name, email) VALUES
(gen_random_uuid(), 'Ana López', 'ana@example.com'),
(gen_random_uuid(), 'Carlos Pérez', 'carlos@example.com'),
(gen_random_uuid(), 'María García', 'maria@example.com'),
(gen_random_uuid(), 'Luis Hernández', 'luis@example.com'),
(gen_random_uuid(), 'Sofía Torres', 'sofia@example.com');

-- =========================
-- Órdenes
-- =========================
INSERT INTO orders (id, customer_id, created_at, status, channel) VALUES
(gen_random_uuid(), (SELECT id FROM customers WHERE name='Ana López'), NOW() - interval '5 days', 'completed', 'in-store'),
(gen_random_uuid(), (SELECT id FROM customers WHERE name='Carlos Pérez'), NOW() - interval '4 days', 'completed', 'online'),
(gen_random_uuid(), (SELECT id FROM customers WHERE name='María García'), NOW() - interval '3 days', 'completed', 'in-store'),
(gen_random_uuid(), (SELECT id FROM customers WHERE name='Luis Hernández'), NOW() - interval '2 days', 'completed', 'online'),
(gen_random_uuid(), (SELECT id FROM customers WHERE name='Sofía Torres'), NOW() - interval '1 days', 'completed', 'in-store');

-- =========================
-- Items de órdenes
-- =========================
INSERT INTO order_items (id, order_id, product_id, qty, unit_price) VALUES
(gen_random_uuid(), (SELECT id FROM orders ORDER BY created_at ASC LIMIT 1), (SELECT id FROM products WHERE name='Latte'), 2, 45.00),
(gen_random_uuid(), (SELECT id FROM orders ORDER BY created_at ASC LIMIT 1), (SELECT id FROM products WHERE name='Brownie'), 1, 25.00),
(gen_random_uuid(), (SELECT id FROM orders ORDER BY created_at ASC OFFSET 1 LIMIT 1), (SELECT id FROM products WHERE name='Capuccino'), 1, 40.00),
(gen_random_uuid(), (SELECT id FROM orders ORDER BY created_at ASC OFFSET 2 LIMIT 1), (SELECT id FROM products WHERE name='Sandwich de Pollo'), 2, 60.00),
(gen_random_uuid(), (SELECT id FROM orders ORDER BY created_at ASC OFFSET 3 LIMIT 1), (SELECT id FROM products WHERE name='Galletas'), 3, 15.00);

-- =========================
-- Pagos
-- =========================
INSERT INTO payments (id, order_id, method, paid_amount) VALUES
(gen_random_uuid(), (SELECT id FROM orders ORDER BY created_at ASC LIMIT 1), 'cash', 115.00),
(gen_random_uuid(), (SELECT id FROM orders ORDER BY created_at ASC OFFSET 1 LIMIT 1), 'card', 40.00),
(gen_random_uuid(), (SELECT id FROM orders ORDER BY created_at ASC OFFSET 2 LIMIT 1), 'cash', 120.00),
(gen_random_uuid(), (SELECT id FROM orders ORDER BY created_at ASC OFFSET 3 LIMIT 1), 'transfer', 45.00),
(gen_random_uuid(), (SELECT id FROM orders ORDER BY created_at ASC OFFSET 4 LIMIT 1), 'card', 60.00);