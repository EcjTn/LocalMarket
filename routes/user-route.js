import { Router } from "express"

import { verifyToken } from "../utils/jwt-auth.js"
import { showShop } from "../utils/database-queries.js"

const router = Router()


router.get('/profile', verifyToken, (req, res) => {
    res.send(req.userInfo)
})



router.post('/logout', verifyToken, (req, res) => {
    res.clearCookie('TOKEN')
    res.send("OK")
})



router.get('/shop', async(req,res) => {
    const leaderBoard = await showShop()
    res.send(leaderBoard.rows)
})
























export default router