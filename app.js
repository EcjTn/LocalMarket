import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import helmet from 'helmet'

import userAuth from './routes/auth-routes.js'
import userRoute from './routes/user-route.js'
import adminRoute from './routes/admin-route.js'
import sellerRoute from './routes/seller-route.js'

const app = express()
console.clear()

//Middlewares
app.use(helmet())
app.use(express.json({limit: '5kb'}))
app.use(cookieParser())
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))

//endpoints
app.get('/', (req,res) => {
    res.send("Main")
    console.log(req.ip)
})
app.use('/api', userAuth)
app.use('/api', userRoute)
app.use('/api/seller', sellerRoute)

app.use('/api/admin', adminRoute)
















//ERROR HANDLER
app.use((err,req,res,next) => {
    console.log("Error handler:",err.message)
    res.status(400).json({
        message: "Error handler occured",
        details: "Internal Server Error",
    })
})






app.listen(8000,() => console.log("--- Server is running on port 8000 ---"))