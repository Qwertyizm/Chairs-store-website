const { error } = require('console');
var pg = require('pg');
var bcrypt = require('bcrypt');

var pool = new pg.Pool({
    host: 'localhost',
    database: 'lkea',
    user: 'pg',
    password: 'pg'
});


//----USERS----------------------------
// show all users in database
async function get_users() {
    try {
        const {rows} = await pool.query('SELECT * FROM users', []);
        return rows;
    }
    catch (error) {
        console.error('Error showing users:', error);
        throw error;
    }
}
// create new user and return his id
async function new_user(name, dob, mail, address, pwd) {
    try {
        const {rows} = await pool.query('INSERT INTO users (name,dob,email,address) \
                                            VALUES ($1,$2,$3,$4) RETURNING id',
                        [name,dob,mail,address]);
        if(rows.length<=0){
            throw "Brak miejsca w bazie";
        }
        return rows[0].id;
    }
    catch (error){
        console.error('Error creating new user:', error);
        throw error;
    }
}
// edit data of a user with given id
async function edit_user(id,name,dob,mail,address){
    try{
        await pool.query('UPDATE users \
                            SET name=$1, \
                            SET dob=$2, \
                            SET email=$3, \
                            SET address=$4 \
                            WHERE users.id=$5',
                        [name,dob,mail,address,id]);
    }
    catch (error) {
        console.error("Error updating user's data:", error);
        throw error;
    }
}
// remove user of given id
async function delete_user(id){
    try{
        await pool.query('DELETE FROM users \
                            WHERE users.id=$1',
                            [id]);
    }
    catch (error) {
        console.error('Error removing user from database:', error);
        throw error;
    }
}

//----PRODUCTS----------------------------
// show all products in database
async function get_products(){
    try{
        const {rows} = await pool.query('SELECT * FROM products');
        return rows;
    }
    catch(error){
        console.error('Error showing products:',error);
        throw error;
    }
}

//get all available colours
async function get_colors() {
    try {
      const {rows} = await pool.query('SELECT DISTINCT colour FROM products');
      return rows.map(row => row.colour);
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw error;
    }
  }
  
// show product of given id
async function get_product(id){
    try{
        const {rows} = await pool.query('SELECT * FROM products \
                                        WHERE products.id=$1',
                                        [id]);
        return rows;
    }
    catch (error){
        console.error('Error showing product',error);
        throw error;
    }
}
// create new product 
async function new_product(name,quantity,price,category,colour,height,width,depth,style,material,image){
    try{
        await pool.query('INSERT INTO products \
                            (name,quantity,price,category,colour,height,width,depth,style,material,image) \
                            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
                        [name,quantity,price,category,colour,height,width,depth,style,material,image]);
    }
    catch (error){
        console.error('Error creating new product:', error);
        throw error;
    }
}
// edit data of a product with given id
async function edit_product(id,name,quantity,price,category,colour,height,width,depth,style,material,image){
    try{
        await pool.query('UPDATE products \
                            SET name=$1, \
                            SET quantity=$2, \
                            SET price=$3, \
                            SET category=$4, \
                            SET colour=$5, \
                            SET height=$6, \
                            SET wodth=$7, \
                            SET depth=$8, \
                            SET style=$9, \
                            SET material=$10, \
                            SET image=$11, \
                            WHERE products.id=$12',
                        [name,quantity,price,category,colour,height,width,depth,style,material,image,id]);
    }
    catch (error){
        console.error("Error updating product's data:", error);
        throw error;
    }
}

async function decrease_product_quantity(id, delta){
    try{
        await pool.query('UPDATE products \
                            SET quantity = quantity - $2 \
                            WHERE id=$1',
                        [id, delta]);
    }
    catch (error){
        console.error("Error updating product's data:", error);
        throw error;
    }
}
// remove product of given id
async function delete_product(id){
    try{
        await pool.query('DELETE FROM products \
                          WHERE products.id=$1',
                          [id]);
    }
    catch (error){
        console.error('Error removing product from database:', error);
        throw error;
    }
}

// search products
async function searchProducts(searchTerm) {
    try {
      const query = {
        text: 'SELECT * FROM products WHERE name ILIKE $1',
        values: [`%${searchTerm}%`],  // Adding '%' for wildcard matching
      };
  
      const {rows} = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
  
  

//----LOGINS----------------------------
// check password of given login
async function correct_pwd(user,pwd){
    try{
        const {rows} = await pool.query(`SELECT password FROM Logins where login = $1`,[user]);
        if(rows.length<=0){
            return false;
        }
        return await bcrypt.compare(pwd,rows[0].password);
    }catch(error){
        console.error("Error while logging in:",error);
        throw error;
    }
}
// check role of user
async function is_admin(user){
    try{
        const {rows} = await pool.query(`SELECT role FROM Logins where login = $1`,[user]);
        if(rows.length<=0){
            return false;
        }
        return rows[0].role == 'admin';
    }catch(error){
        console.error("Error while checking priveleges:",error);
        throw error;
    }
}

// show all logins in database
async function get_logins(){
    try{
        const {rows} = await pool.query('SELECT * FROM logins',[]);
        return rows;
    }
    catch (error){
        console.error('Error getting logins:', error);
        throw error;
    }
}
// create new login
async function new_login(id,usr,pwd){
    try{
        const hash= await bcrypt.hash(pwd,12);
        await pool.query('INSERT INTO logins (user_id,login,password,role) \
                                        values ($1,$2,$3,$4)',
                        [id,usr,hash,'user']);
    }
    catch (error){
        console.error('Error crating new login:', error);
        throw error;
    }
}
// edit data of a login with given id
async function edit_login(id,usr,pwd){
    try{
        await pool.query('UPDATE logins \
                            SET login=$1, \
                            SET password=$2, \
                            WHERE logins.id=$3',
                        [id,usr,pwd]);
    }
    catch (error){
        console.error("Error updating user's login data:", error);
        throw error;
    }
}
// remove login of given id
async function delete_login(id){
    try{
        await pool.query('DELETE FROM logins \
                          WHERE logins.user_id=$1',
                          [id]);
    }
    catch (error){
        console.error("Error removing user's login from database:", error);
        throw error;
    }
}



//----ORDERS---------------------------
//show orders of a user
async function get_orders(user_id) {
    try{
        const { rows } = await pool.query('SELECT * FROM Orders \
                                           WHERE user_id = $1', 
                                           [user_id]);
        return rows;
    }
    catch (error) {
        console.error('Error showing orders:', error);
        throw error;
    };
}

// make new order and return it's id
async function new_order(user_id, date, type) {
    try {
        const {rows} = await pool.query('INSERT INTO Orders(user_id, date, order_type) \
                                        Values($1, $2, $3) Returning id', 
                                        [user_id, date, type]);
        return rows[0].id;
    }
    catch (error) {
        console.error('Error creating new order:', error);
        throw error;
    };
}
// remove order by id
async function delete_order(order_id) {
    try {
        await pool.query('DELETE FROM Orders \
                          WHERE order.id=$1',
                          [order_id]);
    }
    catch (error) {
        console.error('Error removing order from database:', error);
        throw error;
    }
}

async function get_order_details(order_id) {
    try{
        const { rows } = await pool.query('SELECT * FROM Orders\
                                            WHERE id = $1',
                                            [order_id]);
        if (rows.length > 0){
            return rows[0];
        } 
        return null;
    }
    catch  (error) {
        console.error('Error getting order details:', error);
        throw error;
    }
}

//----ORDERED--------------------------
//
async function add_to_ordered(order_id, product_id, quantity) {
    try{
        const { rows } = await pool.query('INSERT INTO Ordered Values($1, $2, $3)', 
                                            [order_id, product_id, quantity]);
        return rows;
    }
    catch  (error) {
        console.error('Error adding product to order:', error);
        throw error;
    }
}

async function delete_from_ordered(order_id) {
    try{
        await pool.query('DELETE FROM Ordered where order_id = $1', 
            [order_id]);
        return;
    }
    catch  (error) {
        console.error('Error removing from order:', error);
        throw error;
    }
}

async function ordered_products(order_id) {
    try{
        await pool.query('SELECT * FROM Ordered where order_id = $1', 
            [order_id]);
        return;
    }
    catch  (error) {
        console.error('Error getting from ordered:', error);
        throw error;
    }
}

//-----------------------------


//----CART-----------------------------
async function show_cart(user_id){
    try{
        const {rows} = await pool.query('SELECT cart.quantity, products.id, products.name, products.image, products.price \
                                        FROM cart, products\
                                        WHERE user_id=$1\
                                        and cart.product_id=products.id',
                                        [user_id]);
        return rows;
    }
    catch (error){
        console.error('Error showing cart:', error);
        throw error;
    }
}

async function get_quantity_from_cart(user_id, product_id) {
    try{
        const { rows } = await pool.query('SELECT quantity FROM Cart\
                                            WHERE user_id = $1\
                                            and product_id = $2',
                                            [user_id, product_id]);
        if (rows.length > 0){
            return rows[0].quantity;
        } 
        return 0;
    }
    catch  (error) {
        console.error('Error adding product to cart:', error);
        throw error;
    }
}

async function add_to_cart(user_id, product_id, quantity) {
    try{
        const { rows } = await pool.query('INSERT INTO Cart Values($1, $2, $3)', 
            [user_id, product_id, quantity]);
        return rows;
    }
    catch  (error) {
        console.error('Error adding product to cart:', error);
        throw error;
    }
}

async function delete_from_cart(user_id, product_id) {
    try{
        await pool.query('DELETE FROM Cart where user_id = $1 and product_id = $2', 
            [user_id, product_id]);
        return;
    }
    catch  (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}
async function clear_cart(user_id) {
    try{
        await pool.query('DELETE FROM Cart where user_id = $1', 
            [user_id]);
        return;
    }
    catch  (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}
async function edit_cart(user_id, product_id, quantity) {
    try {
        var result = await pool.query('UPDATE Cart \
                                        SET quantity = $3 \
                                        WHERE user_id = $1 \
                                        and product_id = $2',
            [user_id, product_id, quantity]);
        return result;
    }
    catch (error) {
        console.error("Error updating cart:", error);
        throw error;
    }
}

module.exports = { 
    get_users,
    new_user,
    edit_user,
    delete_user,
    get_products,
    get_product,
    new_product,
    edit_product,
    delete_product,
    decrease_product_quantity,
    correct_pwd,
    is_admin,
    new_login,
    edit_login,
    delete_login,
    get_orders,
    new_order,
    delete_order,
    add_to_ordered,
    delete_from_ordered,
    ordered_products,
    get_order_details,
    get_quantity_from_cart,
    add_to_cart,
    show_cart,
    delete_from_cart,
    clear_cart,
    edit_cart,
    get_colors,
    searchProducts,
 };