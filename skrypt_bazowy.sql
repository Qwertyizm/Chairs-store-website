CREATE DATABASE lKEA;

--to już będąc w bazie--
CREATE USER pg WITH PASSWORD 'pg';
ALTER ROLE pg SET client_encoding TO 'utf8';
ALTER ROLE pg SET default_transaction_isolation TO 'read committed';
ALTER ROLE pg SET timezone TO 'UTC';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pg;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pg;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(255)
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

CREATE TABLE ordered_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
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
    quantity INTEGER NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE cart (
    user_id INTEGER REFERENCES users(id) NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (user_id, product_id)
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
FOREIGN KEY (product_id) REFERENCES ordered_products(id);

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

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Elegant blue velvet armchair',
    15,
    249.99,
    'living room',
    'blue',
    90.0,
    70.0,
    80.0,
    'elegant',
    'velvet',
    'https://pics.craiyon.com/2023-11-01/64ea59733b9f4b17948a3379fb8986c3.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Modern grey leather sofa',
    10,
    399.99,
    'living room',
    'grey',
    120.0,
    90.0,
    100.0,
    'modern',
    'leather',
    'https://pics.craiyon.com/2023-11-24/f4oF5U2uRpaxzoKkHARwrQ.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Vintage green velvet dining chair',
    8,
    129.99,
    'dining room',
    'green',
    85.0,
    50.0,
    60.0,
    'vintage',
    'velvet',
    'https://pics.craiyon.com/2023-10-06/eda3c464dfdf4886a520331574b3818c.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Red leather recliner chair',
    12,
    299.99,
    'living room',
    'red',
    100.0,
    80.0,
    90.0,
    'modern',
    'leather',
    'https://pics.craiyon.com/2023-11-18/CJjUcd9zRKWjoiF4BUKvmQ.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Sleek black metal bar stool',
    20,
    79.99,
    'kitchen',
    'black',
    75.0,
    40.0,
    40.0,
    'sleek',
    'metal',
    'https://pics.craiyon.com/2023-11-04/2afb6cee2ae244a3a715c2fda7fa525f.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Yellow leather ottoman',
    15,
    149.99,
    'living room',
    'yellow',
    50.0,
    50.0,
    50.0,
    'modern',
    'leather',
    'https://pics.craiyon.com/2023-09-27/1d0d4f8e229b465880eb196e4390a9bc.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Pink velvet vanity chair',
    18,
    89.99,
    'bedroom',
    'pink',
    80.0,
    60.0,
    70.0,
    'elegant',
    'velvet',
    'https://pics.craiyon.com/2023-10-26/7a0922c320e34628b77b087bdffe46f3.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Turquoise fabric accent chair',
    22,
    119.99,
    'living room',
    'turquoise',
    95.0,
    70.0,
    80.0,
    'modern',
    'fabric',
    'https://pics.craiyon.com/2023-12-02/QndfTZA9TEGVJ0nRg9h7pg.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Wooden rocking chair in natural finish',
    10,
    179.99,
    'living room',
    'natural wood',
    100.0,
    80.0,
    120.0,
    'rustic',
    'wood',
    'https://pics.craiyon.com/2024-01-20/JouKiNLeSgqPHSez1QIQNg.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Teal plastic outdoor chair',
    18,
    69.99,
    'outdoor',
    'teal',
    85.0,
    60.0,
    70.0,
    'modern',
    'plastic',
    'https://pics.craiyon.com/2023-09-29/38b64dd910cd4443bba1624b950de08e.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Sunflower yellow fabric sofa',
    12,
    329.99,
    'living room',
    'yellow',
    120.0,
    90.0,
    150.0,
    'modern',
    'fabric',
    'https://pics.craiyon.com/2023-09-26/5d29b084a44c47ed9c96da8f71ffcce3.webp'
);
INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Abstract patterned throw pillow set',
    25,
    39.99,
    'living room',
    'multi-color',
    20.0,
    20.0,
    5.0,
    'modern',
    'fabric',
    'https://pics.craiyon.com/2023-12-04/aR-NR0xmT5CrWMjmJhB0OA.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Vintage floral patterned rug',
    15,
    129.99,
    'living room',
    'multi-color',
    160.0,
    230.0,
    1.0,
    'vintage',
    'fabric',
    'https://pics.craiyon.com/2023-09-21/72f5ba9052e7419fa2632d85bdc46bbb.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Geometric glass coffee table',
    8,
    299.99,
    'living room',
    'clear',
    40.0,
    120.0,
    70.0,
    'modern',
    'glass',
    'https://pics.craiyon.com/2023-09-28/2bfcecc7de534f16801261808ba8648c.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Abstract wall art with vibrant colors',
    20,
    89.99,
    'decor',
    'multi-color',
    80.0,
    120.0,
    3.0,
    'modern',
    'canvas',
    'https://pics.craiyon.com/2023-11-05/cacc2702ade243cbb0c9d500b4581a19.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Sleek black desk with gold accents',
    12,
    179.99,
    'office',
    'black',
    75.0,
    120.0,
    60.0,
    'modern',
    'wood',
    'https://pics.craiyon.com/2023-10-02/265695c0f72d47d0a97a0dd493355702.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Elegant chandelier with crystal accents',
    10,
    399.99,
    'lighting',
    'silver',
    60.0,
    40.0,
    40.0,
    'elegant',
    'crystal',
    'https://pics.craiyon.com/2023-11-04/65fbbb07ee3b4fc2b4323f69cb0a61c9.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Rustic wooden bookshelf',
    15,
    149.99,
    'office',
    'natural wood',
    180.0,
    80.0,
    30.0,
    'rustic',
    'wood',
    'https://pics.craiyon.com/2023-10-14/ae9a8710483f4dfbb7bd39414128596a.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Minimalistic black wall clock',
    22,
    29.99,
    'decor',
    'black',
    40.0,
    40.0,
    2.0,
    'minimalistic',
    'plastic',
    'https://pics.craiyon.com/2023-11-27/qRLNSerOTkGr0MpWWn1Q7g.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Round glass dining table',
    18,
    349.99,
    'dining room',
    'clear',
    75.0,
    150.0,
    150.0,
    'modern',
    'glass',
    'https://pics.craiyon.com/2023-11-27/qRLNSerOTkGr0MpWWn1Q7g.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Elegant gold-plated vase',
    10,
    69.99,
    'decor',
    'gold',
    30.0,
    15.0,
    15.0,
    'elegant',
    'metal',
    'https://pics.craiyon.com/2023-09-21/1969f855a5494510ab61284152ec5687.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Modern abstract wall mirror',
    12,
    129.99,
    'decor',
    'silver',
    90.0,
    60.0,
    2.0,
    'modern',
    'glass',
    'https://pics.craiyon.com/2023-12-02/yGCzEOJmRLaDOBbYR6TaMg.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Ceramic plant pot in pastel tones',
    20,
    49.99,
    'decor',
    'pastel',
    25.0,
    20.0,
    20.0,
    'modern',
    'ceramic',
    'https://pics.craiyon.com/2023-09-29/68fadc309ae147c492e228d23ea4eb01.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Modern pendant light with brass accents',
    15,
    89.99,
    'lighting',
    'brass',
    120.0,
    20.0,
    20.0,
    'modern',
    'metal',
    'https://pics.craiyon.com/2023-10-24/fbbfb054563d484d908e0994623f5c21.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Minimalistic white ceramic table lamp',
    18,
    59.99,
    'lighting',
    'white',
    50.0,
    30.0,
    30.0,
    'minimalistic',
    'ceramic',
    'https://pics.craiyon.com/2023-10-21/e4dd672bcc3b4fbc85d705f47f181191.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Abstract metal wall sculpture',
    22,
    79.99,
    'decor',
    'silver',
    60.0,
    40.0,
    3.0,
    'modern',
    'metal',
    'https://pics.craiyon.com/2023-10-20/04ce3811881b40a5a12e947f18404ad0.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Ceramic serving bowl set in earth tones',
    18,
    39.99,
    'kitchen',
    'earth tones',
    15.0,
    30.0,
    30.0,
    'modern',
    'ceramic',
    'https://pics.craiyon.com/2023-10-02/b68de58d2dba46a696251db13aa702f3.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Wooden console table with black metal legs',
    25,
    119.99,
    'living room',
    'natural wood',
    80.0,
    120.0,
    30.0,
    'modern',
    'wood',
    'https://pics.craiyon.com/2023-10-29/7dc49f90fc2e4178b0fa902212550b4d.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Glass vase with dried flower arrangement',
    15,
    69.99,
    'decor',
    'clear',
    40.0,
    20.0,
    20.0,
    'modern',
    'glass',
    'https://pics.craiyon.com/2023-10-12/57e0fbe1d5b14e4197f87ee8e1efe28d.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Abstract canvas wall art with gold accents',
    20,
    99.99,
    'decor',
    'multi-color',
    80.0,
    120.0,
    2.0,
    'modern',
    'canvas',
    'https://pics.craiyon.com/2023-11-13/ax6JdJKORzLazNyXVN2goQ.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Marble-patterned ceramic coasters set',
    10,
    19.99,
    'kitchen',
    'marble',
    5.0,
    5.0,
    0.5,
    'modern',
    'ceramic',
    'https://pics.craiyon.com/2023-09-22/fc6f5dd90c56459da624811b1ca68090.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Modern black and gold table lamp',
    12,
    49.99,
    'lighting',
    'black, gold',
    30.0,
    15.0,
    15.0,
    'modern',
    'metal',
    'https://pics.craiyon.com/2023-10-09/a803af17507b4cf480f1742990c06adb.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Abstract metal wall clock',
    18,
    79.99,
    'decor',
    'silver',
    60.0,
    40.0,
    2.0,
    'modern',
    'metal',
    'https://pics.craiyon.com/2023-11-13/GjcEycbkSk6KroAbBPQFdw.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Wooden wall shelf with hanging hooks',
    15,
    59.99,
    'decor',
    'natural wood',
    40.0,
    60.0,
    15.0,
    'rustic',
    'wood',
    'https://pics.craiyon.com/2023-10-25/c8694c0394ab4b68a5df2ab619a29500.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Modern ceramic planter with wooden stand',
    18,
    34.99,
    'decor',
    'white',
    30.0,
    20.0,
    20.0,
    'modern',
    'ceramic, wood',
    'https://pics.craiyon.com/2023-09-21/0cdd332ed9df4164a39a467294ece2b1.webp'
);

INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Abstract metal wall sculpture',
    22,
    89.99,
    'decor',
    'silver',
    60.0,
    40.0,
    3.0,
    'modern',
    'metal',
    'https://pics.craiyon.com/2023-10-14/fc6863f3bec94ef788008571d6a89c9d.webp'
);
-- Dodanie nowego produktu
INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Modern cylindrical-shaped chair in gray',
    15,
    179.99,
    'living room',
    'gray',
    95.0,
    65.0,
    75.0,
    'modern',
    'metal',
    'https://pics.craiyon.com/2023-10-28/81f4c38c419c44aebfb8475fd169d70c.webp'
);

-- Dodanie nowego produktu
INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Elegant white and gold coffee table',
    10,
    249.99,
    'living room',
    'white, gold',
    50.0,
    120.0,
    70.0,
    'elegant',
    'wood',
    'https://pics.craiyon.com/2023-09-21/e91b87d606dc415680052f5e33f98743.webp'
);

-- Dodanie nowego produktu
INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Sleek black leather recliner',
    8,
    299.99,
    'living room',
    'black',
    110.0,
    80.0,
    90.0,
    'modern',
    'leather',
    'https://pics.craiyon.com/2023-11-13/r_JZdQ_HQbCCstKK7wVlMg.webp'
);

-- Dodanie nowego produktu
INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Rustic wooden bookshelf with ladder',
    12,
    179.99,
    'office',
    'natural wood',
    180.0,
    80.0,
    30.0,
    'rustic',
    'wood',
    'https://pics.craiyon.com/2023-10-24/626c0bf265314b8aafc16c9c4a29af4d.webp'
);

-- Dodanie nowego produktu
INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Luxurious velvet armchair in burgundy',
    6,
    399.99,
    'living room',
    'burgundy',
    120.0,
    100.0,
    90.0,
    'luxury',
    'velvet',
    'https://pics.craiyon.com/2023-11-21/0XH1j669T-GHHR1FDbWy_g.webp'
);

-- Dodanie nowego produktu
INSERT INTO products (name, quantity, price, category, colour, height, width, depth, style, material, image)
VALUES (
    'Contemporary marble dining table',
    10,
    599.99,
    'dining room',
    'white, gray',
    75.0,
    150.0,
    90.0,
    'contemporary',
    'marble',
    'https://pics.craiyon.com/2023-11-13/Xf-uRFFLRn-oC-HSBz5sbg.webp'
);


--psql -d lkea