const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 5000;

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
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('Witaj na mojej stronie!');
});


// Serwer nasłuchujący na porcie 3000
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
