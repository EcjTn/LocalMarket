import jwt from 'jsonwebtoken'

const jwtKey = process.env.JWT_SECRET

function signToken(data){
    return jwt.sign(data, jwtKey, {expiresIn: '50s'})
}


// Middleware that verifies token, also used for retreiving user info
async function verifyToken(req,res,next){
    const userToken = req.cookies['TOKEN']
    if(!userToken) return res.status(406).json({message: "No token provided."})

    try{
        const decodedJwt = jwt.verify(userToken, jwtKey)
        const responseData = {
            id: decodedJwt.id,
            username: decodedJwt.username,
            role: decodedJwt.role
        }
        req.userInfo = responseData

        next()
    }
    catch(e) {
        res.status(401).json({
            message: "Invalid token",
            details: e.message,
        })
    }
}











export {signToken, verifyToken}