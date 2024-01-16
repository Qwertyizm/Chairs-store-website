const { error } = require('console');
var pg = require('pg');

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
        var result = await pool.query('SELECT * FROM users', []);
        return result.rows;
    }
    catch (error) {
        console.error('Error showing users:', error);
        throw error;
    }
}
// create new user and return his id
async function new_user(name, dob, mail, address, pwd) {
    try {
        var result = await pool.query('INSERT INTO users (name,dob,email,address) \
                                            values ($1,$2,$3,$4) RETURNING id',
            [name, dob, mail, address]);
        return result.rows[0].id;
    }
    catch (error) {
        console.error('Error creating new user:', error);
        throw error;
    }
}
// edit data of a user with given id
async function edit_user(id, name, dob, mail, address) {
    try {
        var result = await pool.query('UPDATE users \
                                        SET name=$1, \
                                        SET dob=$2, \
                                        SET email=$3, \
                                        SET address=$4 \
                                        WHERE users.id=$5',
            [name, dob, mail, address, id]);
        return result;
    }
    catch (error) {
        console.error("Error updating user's data:", error);
        throw error;
    }
}
// remove user of given id
async function delete_user(id) {
    try {
        const result = await pool.query('DELETE FROM users \
                                        WHERE users.id=$1',
            [id]);
        return result;
    }
    catch (error) {
        console.error('Error removing use from database:', error);
        throw error;
    }
}
//----PRODUCTS----------------------------
async function get_products() {
    const { rows } = await pool.query('SELECT * FROM products');
    return rows;
}

//----LOGINS----------------------------
async function correct_pwd(usr, pwd) {
    var user = await pool.query(`SELECT user FROM Logins where login = '${usr}' and password = '${pwd}'`);
    return user.rowCount > 0

}

async function is_admin(user) {
    var role = await pool.query(`SELECT role FROM Logins where login = '${user}'`);
    //console.log(role.rows[0].role);
    return role.rows[0].role == 'admin';
}


//----ORDERS---------------------------
async function get_orders(id) {
    try{
        const { rows } = await pool.query('SELECT * FROM Orders WHERE user_id = $1', 
            [id]);
        return rows;
    }
    catch (error) {
        console.error('Error showing order:', error);
        throw error;
    };
}

async function new_order(user_id, type) {
    try {
        await pool.query('INSERT INTO Orders(user_id, date, order_type) Values($1, $2, $3)', 
            [user_id, Date(Date.now()).toISOString().slice(0, 10), type]);
        return;
    }
    catch (error) {
        console.error('Error creating new order:', error);
        throw error;
    };
}

async function delete_order(order_id) {
    try {
        const result = await pool.query('DELETE FROM Orders \
                                        WHERE order.id=$1',
            [order_id]);
        return;
    }
    catch (error) {
        console.error('Error removing order from database:', error);
        throw error;
    }
}

//----ORDERED--------------------------
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

//----CART-----------------------------
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
            [order_id, product_id]);
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
                                        SET quantity = $1 \
                                        WHERE users.id = $2 \
                                        and product_id = $3',
            [user_id, product_id, quantity]);
        return result;
    }
    catch (error) {
        console.error("Error updating cart:", error);
        throw error;
    }
}

module.exports = { get_users, get_products, correct_pwd, is_admin };