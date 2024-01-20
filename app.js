var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var db_api = require('./db_api');
var authorize = require('./authorize');

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));
app.use(express.static('static'));
var port = 5000;


app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', async (req, res) => {
  res.render('index', { user_cookie: req.signedCookies.user, role:req.signedCookies.role, role:req.signedCookies.role });
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
      res.render('login', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Incorrect username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'An error occurred during login. Please try again.' });
  }
});

app.get('/logout', (req, res) => {
  res.cookie('user', '', { maxAge: -1 });
  res.cookie('role', '', { maxAge: -1 });
  res.cookie('id','',{maxAge: -1});
  res.redirect('/')
});

app.get('/sign_up', async (req, res) => {
  res.render('sign_up', { user_cookie: req.signedCookies.user, role:req.signedCookies.role, role:req.signedCookies.role });
});

app.post('/sign_up', async (req, res) => {
  var username = req.body.txtUser;
  var email = req.body.txtEmail;
  var name = req.body.txtName;
  var dob = req.body.txtDOB;
  var address = req.body.txtAdr;
  var pwd = req.body.txtPwd;
  try {
    var id = await db_api.new_user(name, dob, email, address);
    await db_api.new_login(id, username, pwd);
  }
  catch (err) {
    console.error('Error during sign up:', err);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: "Unable to add new user" });
  }
  res.redirect('/login');
});

app.get('/cart', authorize.authorize_user, async (req, res) => {
  try {
    var id = req.signedCookies.id;
    var products = await db_api.show_cart(id);
    res.render('user/cart', { products: products, user_cookie: req.signedCookies.user, role:req.signedCookies.role, role:req.signedCookies.role });
  } catch (err) {
    console.error('Error showing cart:', err);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Unable to show cart' });
  }
});

app.get('/cart/clear', authorize.authorize_user, async (req, res) => {
  try {
    var id = req.signedCookies.id;
    await db_api.clear_cart(id);
    res.redirect('/cart');
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Unable to clear cart. Please try again.' });
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
    console.error('Error adding to cart:', err);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Unable to add to cart. Please try again.' });
  }
});

app.get('/cart/delete/:id', authorize.authorize_user, async (req, res) => {
  try {
    var product_id = req.params.id;
    var user_id = req.signedCookies.id;
    await db_api.delete_from_cart(user_id, product_id);
    res.redirect('/cart');
  } catch (err) {
    console.error('Error deleting from cart:', err);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Unable to delete from cart. Please try again.' });
  }
});


app.get('/cart/save',authorize.authorize_user, async (req, res) => {
  try{
    var user_id = req.signedCookies.id;
    var products = await db_api.show_cart(user_id);
    for (const product of products) {
      var name = "quantity_" + product.id;
      if (product.quantity != req.query[name]) {
        await db_api.edit_cart(user_id, product.id, req.query[name]);
      }
    }
    res.redirect('/cart');
  } catch (err) {
    console.error('Error saving cart:', err);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Unable to save cart. Please try again.' });
  }
});

app.get('/cart/submit', authorize.authorize_user, async (req, res) => {
  try {
    var id = req.signedCookies.id;
    var products = await db_api.show_cart(id);
    res.render('user/cart_submit', { cart: products, user_cookie: req.signedCookies.user, role:req.signedCookies.role, role:req.signedCookies.role });
  } catch (err) {
    console.error('Error rendering cart submission page:', err);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Unable to render cart submission page. Please try again.' });
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

    res.render('products', { products, colors, user_cookie: req.signedCookies.user, role:req.signedCookies.role, role:req.signedCookies.role, url: req.url, role:req.signedCookies.role });
  } catch (error) {
    console.error('Error fetching products or colors:', error);
    res.status(500).render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Internal Server Error' });
  }
});
app.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.search; // Assuming you are getting the search term from the query parameter
    const searchResults = await db_api.searchProducts(searchTerm);

    res.render('search', { searchTerm, searchResults, user_cookie: req.signedCookies.user, role:req.signedCookies.role, role:req.signedCookies.role });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Internal Server Error' });
  }
});

app.get('/product/:id', async (req, res) => {
  try {
    const username = req.signedCookies.user;
    const productId = req.params.id;
    const rows = await db_api.get_product(productId);
    if (!rows) {
      return res.status(404).render('404', { role:req.signedCookies.role,message: 'Product not found', user_cookie: username });
    }
    res.render('product', { product: rows, user_cookie: username, url: req.url, role:req.signedCookies.role  });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).render('error', { role:req.signedCookies.role,message: 'Internal Server Error', user_cookie: username });
  }
});

//order
app.get('/order/:id', authorize.authorize_user, async (req, res) => {
  try {
    const user_id = req.signedCookies.id;
    const order_id = req.params.id;
    var products = await db_api.ordered_products(order_id);
    var price = 0;
    products.forEach(async (product) => {
      price += parseFloat(product.price);
    });
    var order_details = await db_api.get_order_details(order_id);
    res.render('user/order', { totalPrice : price, order : order_details, products : products, user_cookie: req.signedCookies.user, role:req.signedCookies.role, role:req.signedCookies.role});
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Internal Server Error' });
  }
});

app.get('/order_confirm', authorize.authorize_user, async (req, res) => {
  try {
    var id = req.signedCookies.id;
    var date = new Date().toISOString().split('T')[0];
    var type = req.query.delivery;
    var order_id = await db_api.new_order(id, date, type);
    var products = await db_api.show_cart(id);
    await db_api.clear_cart(id);
    for (const product of products) {
      await db_api.add_to_ordered(order_id, product.id, product.quantity);
      await db_api.decrease_product_quantity(product.id, product.quantity);
    }
    res.redirect('/order/' + order_id)
  } catch (err) {
    console.error('Error processing order:', err);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Unable to process the order. Please try again.' });
  }
});

// Dodaj poniższy kod do pliku app.js

app.get('/user/orders', authorize.authorize_user, async (req, res) => {
  try {
    const userId = req.signedCookies.id;
    const orders = await db_api.get_orders(userId);

    // Dla każdego zamówienia, pobierz szczegóły zamówienia oraz produkty zamówione w tym zamówieniu
    for (const order of orders) {
      order.details = await db_api.get_order_details(order.id);
      order.products = await db_api.ordered_products(order.id);
      
    }

    res.render('user/orders', { user_cookie: req.signedCookies.user, role: req.signedCookies.role, orders: orders });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.render('error', { user_cookie: req.signedCookies.user, role: req.signedCookies.role, message: 'Error fetching user orders' });
  }
});


app.get('/add_product',authorize.authorize_admin, (req, res) => {
  res.render('admin/add_product', { user_cookie: req.signedCookies.user, role:req.signedCookies.role });
});

app.post('/add_product', authorize.authorize_admin, async (req, res) => {
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
      await db_api.new_product(name, quantity, price, category, colour, height, width, depth, style, material, image);
      res.redirect('/products');
    } catch (err) {
      console.error('Error adding product:', err);
      res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Error adding product' });
    }
});

app.get('/admin/modify/:id',authorize.authorize_admin, async (req, res) => {
  try {
    var product_id = req.params.id;
    var product = await db_api.get_product(product_id);
    res.render('admin/modify', { user_cookie: req.signedCookies.user, role:req.signedCookies.role, product: product});
  } catch (err) {
  console.error('Error modifying product:', err);
  res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Error modifying product' });
}
});

app.get('/admin/delete/:id',authorize.authorize_admin, async (req, res) => {
  try{
    var product_id = req.params.id;
    await db_api.delete_product(product_id);
    res.redirect('/products');
  } catch (err) {
    console.error('Error deleting product:', err);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Error deleting product' });
  }
});

app.get('/users',authorize.authorize_admin, async (req, res) => {
  try{
    var users = await db_api.get_users();
    res.render('admin/users', { user_cookie: req.signedCookies.user, role:req.signedCookies.role, role:req.signedCookies.role, users: users });
  } catch (err) {
    console.error('Error showing users:', err);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Error showing users' });
  }
});

app.get('/admin/orders',authorize.authorize_admin, async (req, res) => {
  try{
    var orders = await db_api.get_all_orders();
    for (const order of orders) {
      order.products = await db_api.ordered_products(order.id);
    }
    res.render('admin/orders', { user_cookie: req.signedCookies.user, role:req.signedCookies.role, role:req.signedCookies.role, orders : orders });
  } catch (err) {
    console.error('Error showing orders:', err);
    res.render('error', { user_cookie:req.signedCookies.user,role:req.signedCookies.role, message: 'Error showing orders' });
  }
});


app.use(async (req, res, next) => {
  res.render('404', { url: req.url, user_cookie: req.signedCookies.user, role:req.signedCookies.role, role:req.signedCookies.role });
});

http.createServer(app).listen(3000);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});