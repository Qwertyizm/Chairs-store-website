CREATE DATABASE lKEA;
CREATE USER kasia WITH PASSWORD 'haslo';
ALTER ROLE kasia SET client_encoding TO 'utf8';
ALTER ROLE kasia SET default_transaction_isolation TO 'read committed';
ALTER ROLE kasia SET timezone TO 'UTC';

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT
);

CREATE TABLE logins (
    user_id SERIAL PRIMARY KEY,
    login VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    colour VARCHAR(50),
    height DECIMAL(6, 2),
    width DECIMAL(6, 2),
    depth DECIMAL(6, 2),
    style VARCHAR(50),
    wood_type VARCHAR(50)
);

ALTER TABLE products
ADD COLUMN image VARCHAR(255);

ALTER TABLE products
RENAME COLUMN wood_type TO material;



CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    date DATE NOT NULL,
    order_type VARCHAR(50) NOT NULL
);

CREATE TABLE ordered (
    order_id INTEGER REFERENCES orders(id) NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    amount INTEGER NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    amount INTEGER NOT NULL
);


-- Relacja między tabelą cart a tabelą users
ALTER TABLE cart
ADD CONSTRAINT fk_cart_user
FOREIGN KEY (user_id) REFERENCES users(id);

-- Relacja między tabelą cart a tabelą products
ALTER TABLE cart
ADD CONSTRAINT fk_cart_product
FOREIGN KEY (product_id) REFERENCES products(id);

-- Relacja między tabelą ordered a tabelą orders
ALTER TABLE ordered
ADD CONSTRAINT fk_ordered_order
FOREIGN KEY (order_id) REFERENCES orders(id);

-- Relacja między tabelą ordered a tabelą products
ALTER TABLE ordered
ADD CONSTRAINT fk_ordered_product
FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE products
RENAME COLUMN amount TO quantity;


INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Copper chair with spheres and black tubes',
    10, -- Przykładowa ilość na stanie
    199.99, -- Przykładowa cena
    'living room',
    'copper',
    90.0,
    60.0,
    70.0,
    'modern',
    'metal', 
    'https://pics.craiyon.com/2023-11-04/381f5a364d864a2db25a3f0d24b47c0d.webp'
);


INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'White postmodern sofa chair inspired by Japanese house tiles',
    5,
    299.99,
    'living room',
    'peach', -- Odpowiada polskiemu "brzoskwiniowy"
    100.0,
    80.0,
    90.0,
    'postmodern',
    'upholstery', -- Odpowiada polskiemu "tapicerka"
    'https://pics.craiyon.com/2023-09-21/b71ca4a1a117455db81562a5b3bed3ff.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Tugaw horror show poster with red, black, and white color scheme',
    8, -- Przykładowa ilość na stanie
    149.99, -- Przykładowa cena
    'kitchen',
    'red, black, white', -- Kolorowe schemat - czerwony, czarny, biały
    110.0,
    50.0,
    60.0,
    'modern',
    'leather', -- Ta kolumna może być pusta dla krzeseł
    'https://pics.craiyon.com/2023-10-13/1b7e5cda21e64581b6676ab036907826.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Eateot style chair',
    80, -- Przykładowa ilość na stanie
    149.99, -- Przykładowa cena
    'bathroom',
    'brown', -- Kolorowe schemat - czerwony, czarny, biały
    110.0,
    50.0,
    60.0,
    'archaic',
    'leather', -- Ta kolumna może być pusta dla krzeseł
    'https://pics.craiyon.com/2023-11-28/bwBbhWQxRoGmGGKoTdfgEQ.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Image of diverse eco-friendly furniture designs',
    80, -- Przykładowa ilość na stanie
    200.99, -- Przykładowa cena
    'bathroom',
    'beige', -- Kolorowe schemat - czerwony, czarny, biały
    110.0,
    50.0,
    60.0,
    'futuristic',
    'leather', -- Ta kolumna może być pusta dla krzeseł
    'https://pics.craiyon.com/2023-11-25/SFjzYJaQQQ-XaMvOqtps1w.webp'
);

--psql -d lkea