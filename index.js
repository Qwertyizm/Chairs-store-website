// Importuj Express i EJS
const express = require('express');
const { Pool } = require('pg');
const ejs = require('ejs');


const app = express();
const port = 3000;

// Konfiguracja silnika widoku EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

// Konfiguracja połączenia do bazy danych PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lkea',
  password: '1',
  port: 5432,
});

// Endpoint do pobierania produktów z bazy danych
app.get('/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.render('products', { products: rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Zmieniona ścieżka endpointu
app.get('/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
    // Jeżeli nie znaleziono produktu, możesz obsłużyć to dowolnym sposobem, np. przekierowanie na stronę błędu.
    if (rows.length === 0) {
      return res.status(404).render('error', { message: 'Product not found' });
    }
    res.render('product', { product: rows[0] });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});


app.get('/', (req, res) => {
  res.send('Witaj na mojej stronie!');
});


// Serwer nasłuchujący na porcie 3000
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
