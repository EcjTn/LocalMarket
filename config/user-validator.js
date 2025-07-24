import Joi  from 'joi'

const UserSchema = Joi.object({
    username: Joi.string().min(5).max(24).required(),
    password: Joi.string().min(5).max(50).required()
}).unknown()



function validateInput(data){
    return UserSchema.validateAsync(data)
}

export default validateInput