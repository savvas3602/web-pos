CREATE TABLE product_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    retail_price DOUBLE PRECISION NOT NULL,
    wholesale_price DOUBLE PRECISION NOT NULL,
    stock_quantity INTEGER NOT NULL,
    description VARCHAR(500),
    product_type_id INTEGER REFERENCES product_types(id) ON DELETE SET NULL
);

CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_product_type_id ON products(product_type_id);
