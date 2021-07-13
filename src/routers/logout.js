const express = require('express');
const sql = require('../config/mysqlConfig')
const auth = require('../middleware/adminAuth')
const auth2 = require('../middleware/lecturerAuth')
const auth3 = require('../middleware/studentAuth')

const router = new express.Router()

router.delete('/admin',auth, async (req,res) => {
    let userId = req.body.userId
    let userType = req.body.userType
    let query = 'DELETE FROM tokens WHERE userId = ? AND userType = ?'

    try {
        let conn = await sql.getDBConnection();
        await conn.execute(query,[userId,userType])
        res.send('Logged Out')
    } catch (error) {
        
    }
})

router.delete('/lecturer',auth2, async (req,res) => {
    let userId = req.body.userId
    let userType = req.body.userType
    let query = 'DELETE FROM tokens WHERE userId = ? AND userType = ?'

    try {
        let conn = await sql.getDBConnection();
        await conn.execute(query,[userId,userType])
        res.send('Logged Out')
    } catch (error) {
        
    }
})

router.delete('/student',auth3, async (req,res) => {
    let userId = req.body.userId
    let userType = req.body.userType
    let query = 'DELETE FROM tokens WHERE userId = ? AND userType = ?'

    try {
        let conn = await sql.getDBConnection();
        await conn.execute(query,[userId,userType])
        res.send('Logged Out')
    } catch (error) {
        
    }
})

module.exports = router