var pg = require('pg');

var pool = new pg.Pool({
    host: 'localhost',
    database: 'lkea',
    user: 'kornelia',
    password: 'pg'
});

async function get_users(){
    const {rows} = await pool.query('SELECT * FROM users');
    return rows;
}

async function get_products(){
    const {rows} = await pool.query('SELECT * FROM products');
    return rows;
}

async function correct_pwd(usr,pwd){
    var user = await pool.query(`SELECT user FROM Logins where login = '${usr}' and password = '${pwd}'`);
    return user.rowCount>0
    
}

async function is_admin(user){
    var role = await pool.query(`SELECT role FROM Logins where login = '${user}'`);
    //console.log(role.rows[0].role);
    return role.rows[0].role == 'admin';
}

module.exports = {get_users, get_products, correct_pwd, is_admin};