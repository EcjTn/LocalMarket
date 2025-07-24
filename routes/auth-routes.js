import { Router } from 'express'

import validateUser from "../config/user-validator.js"
import { hashPasswordFuntion, verifyPassword} from "../utils/hash-password.js"
import { signToken } from "../utils/jwt-auth.js"
import { addUsers, searchUsernameDB } from '../utils/database-queries.js'
import recaptchaMiddleware from '../utils/recaptcha-check.js'

const router = Router()



router.post('/register', recaptchaMiddleware, async(req,res,next) => {
    try{
        const isValidated = await validateUser(req.body)
        if(!isValidated) return res.send("Invalid username or password.")

        const hashingPassword = await hashPasswordFuntion(isValidated.password)
        const registerUser = await addUsers(isValidated.username, hashingPassword)

        res.send(registerUser.rows)
    }
    catch(e){
        next(e)
    }
})




router.post('/login', async(req,res,next) => {
    try{
        const isValidated = await validateUser(req.body)
        if(!isValidated) return res.send("Invalid username or password.")

        const searchUserDB = await searchUsernameDB(isValidated.username)
        if(searchUserDB.rows.length === 0) return res.status(406).json({error: "Invalid username or password."})

        const validatePassword = await verifyPassword(isValidated.password, searchUserDB.rows[0].password)
        if(!validatePassword) return res.status(406).json({error: "Invalid username or password."})

        const userData = {
            id: searchUserDB.rows[0].id,
            username: isValidated.username,
            role: searchUserDB.rows[0].role
            }
        const token = signToken(userData)

        res.cookie('TOKEN', token, {httpOnly: true, sameSite: 'none'})
        res.send("OK")
    }
    catch(e){
        next(e)
    }
})































export default router