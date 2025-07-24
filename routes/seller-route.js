import { Router } from "express"

import { verifyToken } from "../utils/jwt-auth.js"
import { showSellerProducts, addProduct, deleteProduct } from "../utils/database-queries.js"
import validateProduct from "../config/product-validator.js"
import recaptchaMiddleware from "../utils/recaptcha-check.js"

import Joi from "joi"
const idSchema = Joi.number().integer().positive().min(1).required()

const router = Router()




// Show Seller Products
router.get('/me/products', verifyToken, async(req,res) => {
    try{
        const userInfo = req.userInfo

        if(!userInfo || userInfo.role === 'buyer') return res.status(403).json({message: "You are not authorized to view products"})

        const products = await showSellerProducts(userInfo.id)
        res.send(products.rows)
    }
    catch(e) {
        return res.status(500).json({message: "Error fetching products", details: e.message})
    }
})




// Add Product
router.post('/product', verifyToken, recaptchaMiddleware, async(req, res) => {

    try{
        // Check if user is a member. if so, return error
        if(req.userInfo.role == 'member') {
            return res.status(403).json({message: "You are not authorized to add products"})
        }

        // passed all checks, validate product data
        const isValid = await validateProduct(req.body)
        if(!isValid) return res.status(400).json({message: "Invalid product data"})
        
        const productData = {
            product_name: isValid.product_name,
            price: isValid.price,
            seller_id: req.userInfo.id
        }

        const addProductDB = await addProduct(productData.product_name, productData.price, productData.seller_id)
        res.send(addProductDB.rows[0])
    }
    catch(e){
        res.status(400).json({
            message: "Error in product route",
            details: e.message,
        })
    }

})



// Delete Product
router.delete('/product/:id', verifyToken, async (req, res, next) => {
    try {
        const userId = req.userInfo.id;
        const productId = await idSchema.validateAsync(req.params.id);

        if (req.userInfo.role == 'member') {
            return res.status(403).json({ message: "You are not authorized to delete products" });
        }

        const deleteProductDB = await deleteProduct(productId, userId);

        if(!deleteProductDB.rows[0]) {
            return res.status(404).json({ 
                message: "Product not found or you are not the seller",
                details: "Ensure the product ID is correct and you are the seller of this product.",
                your_id: userId,
            });
        }

        // Passed all checks, proceed to delete the product
        res.status(204).send(); // No content to send back
    }
    catch (error) {
        res.status(500).json({
            message: "Error deleting product",
            details: error.message,
        });
    }
})




export default router