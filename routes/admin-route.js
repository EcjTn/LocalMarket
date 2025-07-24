import { Router } from "express"

import { verifyToken } from "../utils/jwt-auth.js"
import pool from "../config/db.js"

const router = Router()



import Joi from "joi"
const idSchema = Joi.number().integer().positive().min(1).required()

router.delete('/product/:id', verifyToken, async(req, res, next) => {
    try {
        const productId = await idSchema.validateAsync(req.params.id)

        // Check if user is a admin
        if (req.userInfo.role !== 'admin') {
            return res.status(403).json({ 
                message: "You are not authorized to delete products",
                your_role: req.userInfo.role
             });
        }

        const deleteQuery = `DELETE FROM products WHERE product_id = $1 RETURNING *`;
        
        const result = await pool.query(deleteQuery, [productId]);

        if (!result.rows[0]) {
            console.error(`Admin ${req.userInfo.id} failed to delete product ${productId}: NOT FOUND`);
            return res.status(404).json({ message: "Product not found" });
        }

        // Passed all checks, proceed to delete the product
        res.status(204).send(); // No content to send back

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            details: error.message
        })
    }
})
























export default router