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
        var result = await pool.query('SELECT * FROM users',[]);        
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
        var result = await pool.query('INSERT INTO users (name,dob,email,address) \
                                            VALUES ($1,$2,$3,$4) RETURNING id',
                        [name,dob,mail,address]);
        return result.rows[0].id;
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
    catch (error){
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
    catch (error){
        console.error('Error removing use from database:', error);
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
// show product of given id
async function get_product(id){
    try{
        const {rows} = await pool.query('SELECT * FROM products \
                                        WHERE products.id=$1',
                                        [id]);
        return rows[0];
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
                            (name,quanitty,price,category,colour,height,width,depth,style,material,image) \
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
// remove product of given id
async function delete_product(id){
    try{
        const result = await pool.query('DELETE FROM products \
                                        WHERE products.id=$1',
                                        [id]);
        return result;
    }
    catch (error){
        console.error('Error removing product from database:', error);
        throw error;
    }
}

//----LOGINS----------------------------
async function correct_pwd(usr,pwd){
    var user = await pool.query('SELECT user \
                                FROM logins \
                                WHERE login = $1 \
                                AND password = $2',
                                [usr,pwd]);
    return user.rowCount>0
    
}

async function is_admin(user){
    var role = await pool.query('SELECT role \
                                FROM Logins \
                                WHERE login = $1',
                                [user]);
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
        await pool.query('INSERT INTO \
                            logins (user_id,login,password,role) \
                            VALUES ($1,$2,$3,$4)',
                        [id,usr,pwd,'user']);
    }
    catch (error){
        console.error('Error creating new login:', error);
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