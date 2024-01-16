var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var db_api = require('./db_api');
var authorize = require('./authorize');
const { utimesSync } = require('fs');

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));
var port = 5000;


app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', async (req, res) => {
  res.render('index', {user_cookie:req.signedCookies.user});

});

app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/sign_up', (req, res) => {
  res.render('sign_up');
});

app.post( '/login', async (req, res) => {
  var username = req.body.txtUser;
  var pwd = req.body.txtPwd;
  if (await db_api.correct_pwd(username, pwd) ) {
    res.cookie('user',username,{signed:true});
    if( await db_api.is_admin(username)){
      res.cookie('role','admin',{signed:true});
    }
    else{
      res.cookie('role','user',{signed:true});
    }
    var returnUrl = req.query.returnUrl;
    if(returnUrl){
      res.redirect(returnUrl);
    }
    else{
      res.redirect('/');
    }
  } else {
    res.render( 'login', { message : "Zła nazwa logowania lub hasło" }
    );
  }
});

app.get( '/logout', authorize.authorize_user, (req, res) => {
  res.cookie('user', '', { maxAge: -1 } );
  res.cookie('role', '', { maxAge: -1 } );
  res.redirect('/')
});

app.get('/sign_up', async (req, res) => {
  res.render('sign_up');
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
  }
  res.redirect('/login');
});

app.get('/search', async (req, res) => {
  res.render('search');
});

app.get('/cart',authorize.authorize_user, async (req, res) => {
  res.render('user/cart');
});

app.get('/settings',authorize.authorize_user, async (req, res) => {
    res.render('user/settings');
});

app.get('/orders', authorize.authorize_admin, async (req, res) => {
  res.render('admin/orders');
});

app.get('/products',authorize.authorize_admin, async (req, res) => {
  res.render('products',{products:await db_api.get_products()});
});

app.get('/users', authorize.authorize_admin, async (req, res) => {
  res.render('admin/users');
});

http.createServer(app).listen(3000);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
