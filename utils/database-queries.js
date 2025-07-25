import pool from '../config/db.js'



function addUsers(username,password){
    const addQuery = `
    INSERT INTO usertable(username,password)
    VALUES ($1, $2) RETURNING *
    `
    return pool.query(addQuery, [username,password])
}



function searchUsernameDB(username){
    const searchQuery = `
    SELECT * FROM usertable 
    WHERE username = $1 LIMIT 1
    `
    return pool.query(searchQuery, [username])
}



function showSellerProducts(id){
    const query = `
    SELECT product_id, product_name, price, star FROM products
    WHERE seller_id = $1
    ORDER BY star DESC
    `
    return pool.query(query, [id])
}



function showShop() {
    const query = `
    SELECT username, product_name, price, star
    FROM usertable INNER JOIN products
    ON usertable.id = products.seller_id
    ORDER BY RANDOM()
    LIMIT 10
    `
    return pool.query(query)
}



function addProduct(product_name, price, seller_id) {
    const query = `
    INSERT INTO products (product_name, price, seller_id)
    VALUES ($1, $2, $3) RETURNING *
    `
    return pool.query(query, [product_name, price, seller_id])
}



function deleteProduct(productId, sellerId) {
    const query = `
    DELETE FROM products WHERE product_id = $1 AND seller_id = $2 RETURNING *
    `
    return pool.query(query, [productId, sellerId])
}
















export {
    addUsers,
    searchUsernameDB, 
    showSellerProducts,
    showShop,
    addProduct,
    deleteProduct
    }