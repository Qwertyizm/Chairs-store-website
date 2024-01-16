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
async function get_users(){
    try{
        var result=await pool.query('SELECT * FROM users',[]);        
        return result.rows;
    }
    catch (error){
        console.error('Error showing users:', error);
        throw error;
    }
}
// create new user and return his id
async function new_user(name,dob,mail,address){
    try{
        var result=await pool.query('INSERT INTO users (name,dob,email,address) \
                                            values ($1,$2,$3,$4) RETURNING id',
                        [name,dob,mail,address]);
        return result.rows[0].id;
    }
    catch (error){
        console.error('Error crating new user:', error);
        throw error;
    }
}
// edit data of a user with given id
async function edit_user(id,name,dob,mail,address){
    try{
        var result=await pool.query('UPDATE users \
                                        SET name=$1, \
                                        SET dob=$2, \
                                        SET email=$3, \
                                        SET address=$4 \
                                        WHERE users.id=$5',
                                    [name,dob,mail,address,id]);
        return result;
    }
    catch (error){
        console.error("Error updating user's data:", error);
        throw error;
    }
}
// remove user of given id
async function delete_user(id){
    try{
        const result=await pool.query('DELETE FROM users \
                                        WHERE users.id=$1',
                                        [id]);
        return result;
    }
    catch (error){
        console.error('Error removing use from database:', error);
        throw error;
    }
}
//----PRODUCTS----------------------------
async function get_products(){
    const {rows} = await pool.query('SELECT * FROM products');
    return rows;
}

//----LOGINS----------------------------
async function correct_pwd(usr,pwd){
    var user = await pool.query(`SELECT user FROM Logins where login = '${usr}' and password = '${pwd}'`);
    return user.rowCount>0
    
}

async function is_admin(user){
    var role = await pool.query(`SELECT role FROM Logins where login = '${user}'`);
    //console.log(role.rows[0].role);
    return role.rows[0].role == 'admin';
}

// show all logins in database
async function get_logins(){
    try{
        await pool.query('SELECT * FROM logins',[]);
    }
    catch (error){
        console.error('Error showing logins:', error);
        throw error;
    }
}
// create new login
async function new_login(id,usr,pwd){
    try{
        await pool.query('INSERT INTO logins (user_id,login,password,role) \
                                        values ($1,$2,$3,$4)',
                        [id,usr,pwd,'user']);
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
        return;
    }
    catch (error){
        console.error("Error updating user's login data:", error);
        throw error;
    }
}
// remove login of given id
async function delete_login(id){
    try{
        const result=await pool.query('DELETE FROM logins \
                                        WHERE logins.user_id=$1',
                                        [id]);
        return result;
    }
    catch (error){
        console.error("Error removing user's login from database:", error);
        throw error;
    }
}


//----ORDERS----------------------------
//----ORDERED----------------------------
//----CART----------------------------












module.exports = {get_users, get_products, correct_pwd, is_admin};