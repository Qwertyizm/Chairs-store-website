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
async function get_users(){try{
    var result=await pool.query('SELECT * FROM users',
                    [],
                    (error, results) => {
                        if (error) {
                            throw error
                        }
                    });
    
    return result.rows;
}
catch (error){
    console.error('Error showing users:', error);
    throw error;
}
}
// create new user and return his id
async function new_user(name,dob,mail,address,pwd){
    try{
        var result=await pool.query('INSERT INTO users (name,dob,email,address) \
                                            values ($1,$2,$3,$4) RETURNING id',
                        [name,dob,mail,address],
                        (error, results) => {
                            if (error) {
                                throw error
                            }
                        });
        
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
                        [name,dob,mail,address,id],
                        (error, results) => {
                            if (error) {
                                throw error
                            }
                        });
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
                        [id],
                        (error, results) => {
                            if (error) {
                                throw error
                            }
                        });
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


//----ORDERS----------------------------
//----ORDERED----------------------------
//----CART----------------------------












module.exports = {get_users, get_products, correct_pwd, is_admin};