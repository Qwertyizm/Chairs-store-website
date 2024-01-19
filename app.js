var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var db_api = require('./db_api');
var authorize = require('./authorize');
const { utimesSync } = require('fs');

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));
app.use(express.static('static'));
var port = 5000;


app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', async (req, res) => {
  res.render('index', { user_cookie: req.signedCookies.user });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  var username = req.body.txtUser;
  var pwd = req.body.txtPwd;
  try{
    if (await db_api.correct_pwd(username, pwd)) {
      res.cookie('user', username, { signed: true });
      res.cookie('id', await db_api.get_user_id(username), { signed: true });
      if (await db_api.is_admin(username)) {
        res.cookie('role', 'admin', { signed: true });
      }
      else {
        res.cookie('role', 'user', { signed: true });
      }
      var returnUrl = req.query.returnUrl;
      if (returnUrl) {
        res.redirect(returnUrl);
      }
      else {
        res.redirect('/');
      }
    } else {
      res.render('login', { message: "Zła nazwa logowania lub hasło" }
      );
    }
  }catch(error){
    res.render('error',{message: "Server "})
  }
});

app.get('/logout', authorize.authorize_user, (req, res) => {
  res.cookie('user', '', { maxAge: -1 });
  res.cookie('role', '', { maxAge: -1 });
  res.redirect('/')
});

app.get('/sign_up', async (req, res) => {
  res.render('sign_up', { user_cookie: req.signedCookies.user });
});

app.post('/sign_up', async (req, res) => {
  var username = req.body.txtUser;
  var email = req.body.txtEmail;
  var name = req.body.txtName;
  var dob = req.body.txtDOB;
  var address = req.body.txtAddress;
  var pwd = req.body.txtPwd;
  try {
    var id = await db_api.new_user(name, dob, email, address);
    await db_api.new_login(id, username, pwd);
  }
  catch (err) {
    res.render('error', { message: "Unable to add new user" });
  }
  res.redirect('/login');
});

app.get('/cart', authorize.authorize_user, async (req, res) => {
  try {
    var id = req.signedCookies.id;
    var products = await db_api.show_cart(id);
    console.log(products);
    res.render('user/cart', { products: products, user_cookie: req.signedCookies.user });
  } catch (err) {
    console.log(err);
  }
});

app.get('/cart/clear', authorize.authorize_user, async (req, res) => {
  try {
    var id = req.signedCookies.id;
    await db_api.clear_cart(id);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
});

app.get('/cart/add/:id', authorize.authorize_user, async (req, res) => {
  try {
    var product_id = req.params.id;
    var user_id = req.signedCookies.id;
    var quantity = await db_api.get_quantity_from_cart(user_id, product_id);

    if (quantity) {
      await db_api.edit_cart(user_id, product_id, quantity + 1);
    }
    else {
      await db_api.add_to_cart(user_id, product_id, 1);
    }
    var returnUrl = req.query.returnUrl;
    if (returnUrl) {
      res.redirect("" + returnUrl);
    }
    else {
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
});

app.get('/cart/delete/:id', authorize.authorize_user, async (req, res) => {
  try {
    var product_id = req.params.id;
    var user_id = req.signedCookies.id;
    await db_api.delete_from_cart(user_id, product_id);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
});

app.post('/cart/submit', authorize.authorize_user, async (req, res) => {
  try {
    var id = req.signedCookies.id;
    var date = Date(Date.now()).toISOString().slice(0, 10);
    var products = await db_api.show_cart(id);
    await db_api.new_order(id, date,)
    res.render('user/cart', { products: {}, user_cookie: req.signedCookies.user });
  } catch (err) {
    console.log(err);
  }
});

app.get('/cart/save',authorize.authorize_user, async (req, res) => {
  try{
    var user_id = req.signedCookies.id;
    var products = await db_api.show_cart(user_id);
    products.forEach(async (product) => {
      var name = "quantity_" + product.id;
      if (product.quantity != req.query[name]) {
        await db_api.edit_cart(user_id, product.id, req.query[name]);
      }
    });
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
});

app.get('/cart/submit', authorize.authorize_user, async (req, res) => {
  try {
    var id = req.signedCookies.id;
    var products = await db_api.show_cart(id);
    res.render('user/cart_submit', { cart: products, user_cookie: req.signedCookies.user });
  } catch (err) {
    console.log(err);
  }
});

app.get('/settings', authorize.authorize_user, async (req, res) => {
  res.render('user/settings');
});

app.get('/orders', authorize.authorize_admin, async (req, res) => {
  res.render('admin/orders');
});

app.get('/products', async (req, res) => {
  try {
    const products = await db_api.get_products();
    const colors = await db_api.get_colors();

    res.render('products', { products, colors, user_cookie: req.signedCookies.user });
  } catch (error) {
    console.error('Error fetching products or colors:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});
app.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.search; // Assuming you are getting the search term from the query parameter
    const searchResults = await db_api.searchProducts(searchTerm);

    res.render('search', { searchTerm, searchResults, user_cookie: req.signedCookies.user });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

app.get('/product/:id', async (req, res) => {
  try {
    const username = req.signedCookies.user;
    const productId = req.params.id;
    const rows = await db_api.get_product(productId);
    if (rows.length === 0) {
      return res.status(404).render('404', { message: 'Product not found', user_cookie: username });
    }
    res.render('product', { product: rows[0], user_cookie: username, url: req.url });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).render('error', { message: 'Internal Server Error', user_cookie: username });
  }
});

app.get('/users', authorize.authorize_admin, async (req, res) => {
  res.render('admin/users');
});



//order
app.get('/order', authorize.authorize_user, async (req, res) => {
  try {

    const id=req.signedCookies.id;
    const order = await db_api.get_order_details(id); // You should replace this with your actual method to fetch order details

    res.render('user/order', { order, user_cookie: req.signedCookies.user, delivery_form: req.query.delivery });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

app.get('/order_confirm', authorize.authorize_user, async (req, res) => {
  try {
    var id = req.signedCookies.id;
    var date = new Date().toISOString().split('T')[0];
    var type = req.query.delivery;
    var order_id = await db_api.new_order(id, date, type);
    var products = await db_api.show_cart(id);
    var price = 0;
    await db_api.clear_cart(id);
    products.forEach(async (product) => {
      await db_api.add_to_ordered(order_id, product.id, product.quantity);
      await db_api.decrease_product_quantity(product.id, product.quantity);
      price += product.price;
    });
    var order_details = await db_api.get_order_details(order_id);
    res.render('user/order', { totalPrice : price, order : order_details, products : products, user_cookie: req.signedCookies.user});
  } catch (err) {
    console.log(err);
  }
});

app.get('/add_product',authorize.authorize_admin, (req, res) => {
  res.render('admin/add_product', { user_cookie: req.cookies.user });
});



app.post('/add_product', authorize.authorize_admin, async (req, res) => {
  // Sprawdź, czy użytkownik jest administratorem
  
    // Pobierz dane z formularza
    var name = req.body.productName;
    var quantity = req.body.quantity;
    var price = req.body.price;
    var category = req.body.category;
    var colour = req.body.colour;
    var height = req.body.height;
    var width = req.body.width;
    var depth = req.body.depth;
    var style = req.body.style;
    var material = req.body.material;
    var image = req.body.image;

    try {
      // Dodaj nowy produkt do bazy danych
      await db_api.new_product(name, quantity, price, category, colour, height, width, depth, style, material, image);
      res.redirect('/products'); // Przekieruj na stronę z produktami po dodaniu produktu
    } catch (err) {
      console.error('Error adding product:', err);
      res.render('error', { message: 'Error adding product' });
    }
});

app.use(async (req, res, next) => {
  res.render('404', { url: req.url, user_cookie: req.signedCookies.user });
});

http.createServer(app).listen(3000);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});