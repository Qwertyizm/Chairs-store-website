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
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    colour VARCHAR(50),
    height DECIMAL(6, 2),
    width DECIMAL(6, 2),
    depth DECIMAL(6, 2),
    style VARCHAR(50),
    material VARCHAR(50),
    image VARCHAR(255)
);

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

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Asante African stool',
    10,
    199.99,
    'living room',
    'brown',
    40.0,
    30.0,
    30.0,
    'traditional',
    'wood',
    'https://pics.craiyon.com/2023-10-25/eb0c1b88de65486cac526e9bf472f768.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Colorful wooden chair in cylindrical shape',
    15,
    149.99,
    'living room',
    'multi-color',
    50.0,
    40.0,
    40.0,
    'modern',
    'wood',
    'https://pics.craiyon.com/2023-10-28/4a03da66efe2403bbb1421214408946b.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'White postmodern sofa chair inspired by Japanese house tiles',
    5,
    299.99,
    'living room',
    'peach',
    100.0,
    80.0,
    90.0,
    'postmodern',
    'upholstery',
    'https://pics.craiyon.com/2023-09-21/e914e642a32d419e98ed0b5c347e296e.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'A wooden bench in a lush green environment',
    20,
    79.99,
    'garden',
    'natural wood',
    60.0,
    120.0,
    40.0,
    'rustic',
    'wood',
    'https://media.craiyon.com/2023-09-18/40ce5bf8e5544f32a85de15fdfae97c6.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Chair crafted from recycled plastic bottles',
    30,
    49.99,
    'outdoor',
    'green',
    80.0,
    50.0,
    60.0,
    'ecofriendly',
    'recycled plastic',
    'https://pics.craiyon.com/2023-10-20/47751cbca92a41d5a58e7891ae82b1c8.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Visual representation of a transformable chair',
    12,
    129.99,
    'living room',
    'gray',
    90.0,
    60.0,
    70.0,
    'modern',
    'metal',
    'https://pics.craiyon.com/2023-09-28/dd4a2445ecb544e882002598319cda69.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Luxury wooden Aztec chair',
    8,
    349.99,
    'living room',
    'dark brown',
    110.0,
    70.0,
    80.0,
    'luxury',
    'exotic wood',
    'https://pics.craiyon.com/2023-10-11/9b484eb4836c4fac8734d53412ddbc9b.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Photo of a paper chair',
    18,
    89.99,
    'office',
    'white',
    120.0,
    80.0,
    90.0,
    'minimalistic',
    'paper',
    'https://pics.craiyon.com/2023-09-29/f813bfda887c4d71a26d72fa92fccc27.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Spiky metal bench in a bright studio',
    15,
    159.99,
    'studio',
    'silver',
    100.0,
    120.0,
    60.0,
    'industrial',
    'metal',
    'https://pics.craiyon.com/2023-12-05/qfS4LiHkQe6MIUKnzky77Q.webp'
);


--psql -d lkea