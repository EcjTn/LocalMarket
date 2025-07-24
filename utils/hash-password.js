import bcrypt from 'bcrypt'
import pool from '../config/db.js'

pool.connect()

function hashPasswordFuntion(password){
    return bcrypt.hash(password,10)
}

function verifyPassword(plainPassword, hashPassword){
    return bcrypt.compare(plainPassword, hashPassword)
}

export { hashPasswordFuntion, verifyPassword }