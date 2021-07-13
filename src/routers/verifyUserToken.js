const express = require('express');
const sql = require('../config/mysqlConfig')

const router = new express.Router()

router.post('/', async (req,res) => {
    let userId = req.body.userId
    let userType = req.body.userType
    let token = req.body.token
    let query = 'SELECT * FROM tokens WHERE userId = ? AND userType = ? AND token = ?'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[userId,userType,token])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/validToken', async (req,res) => {
    let userType = req.body.userType
    let token = req.body.token
    let query = 'SELECT * FROM tokens WHERE userType = ? AND token = ?'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[userType,token])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router