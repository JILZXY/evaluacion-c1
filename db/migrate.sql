ALTER TABLE orders
  ALTER COLUMN channel TYPE order_channel
  USING channel::order_channel;

ALTER TABLE orders
  ALTER COLUMN status TYPE order_status
  USING status::order_status;

ALTER TABLE payments
  ALTER COLUMN method TYPE payment_method
  USING method::payment_method;

ALTER TABLE products
  ADD COLUMN status product_status DEFAULT 'active';

UPDATE products
  SET status = CASE
    WHEN active = true THEN 'active'
    ELSE 'inactive'
  END;

ALTER TABLE products DROP COLUMN active;