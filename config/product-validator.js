import Joi from 'joi';

const ProductSchema = Joi.object({
    product_name: Joi.string().min(3).max(50).required(),
    price: Joi.number().positive().min(0).required(),
})

function validateProduct(product) {
    return ProductSchema.validateAsync(product);
}

export default validateProduct;