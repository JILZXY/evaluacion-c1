CREATE TYPE order_channel AS ENUM ('in-store', 'online');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'transfer', 'voucher');
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'discontinued');


CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL,
  status product_status DEFAULT 'active'
);

CREATE TABLE customers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  created_at TIMESTAMP DEFAULT now(),
  status order_status DEFAULT 'pending',
  channel order_channel NOT NULL
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  qty INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
);

CREATE TABLE payments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  method payment_method NOT NULL,
  paid_amount NUMERIC(10,2) NOT NULL
);