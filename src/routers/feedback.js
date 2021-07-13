const express = require('express');
const sql = require('../config/mysqlConfig')
const auth = require("../middleware/adminAuth");
const auth2 = require("../middleware/lecturerAuth");
const auth3 = require("../middleware/studentAuth");
const router = new express.Router()

router.post('/getFeedbacks',auth, async (req,res) => {
    let query = 'SELECT * FROM feedback WHERE resolved = 0 ORDER BY fbId DESC'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query)
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/getFeedbacksL',auth2, async (req,res) => {
    let query = 'SELECT * FROM feedback WHERE resolved = 0 ORDER BY fbId DESC'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query)
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/getFeedbacksS',auth3, async (req,res) => {
    let query = 'SELECT * FROM feedback WHERE resolved = 0 ORDER BY fbId DESC'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query)
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/getFeedback',auth, async (req,res) => {
    let fbId = req.body.fbId
    let query = 'SELECT * FROM feedback WHERE fbId = ?'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[fbId])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/getFeedbackL',auth2, async (req,res) => {
    let fbId = req.body.fbId
    let query = 'SELECT * FROM feedback WHERE fbId = ?'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[fbId])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/getFeedbackSt',auth3, async (req,res) => {
    let fbId = req.body.fbId
    let query = 'SELECT * FROM feedback WHERE fbId = ?'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[fbId])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/giveFeedback',auth, async (req,res) => {
    let userId = req.body.userId
    let userType = req.body.userType
    let title = req.body.title
    let userDetails = req.body.userDetails
    let feedback = req.body.feedback
    let query = 'INSERT INTO feedback(userId, userType,title, userDetails, feedback) VALUES (?,?,?,?,?)'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[userId, userType, title,userDetails,feedback])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/giveFeedbackL',auth2, async (req,res) => {
    let userId = req.body.userId
    let userType = req.body.userType
    let title = req.body.title
    let userDetails = req.body.userDetails
    let feedback = req.body.feedback
    let query = 'INSERT INTO feedback(userId, userType,title, userDetails, feedback) VALUES (?,?,?,?,?)'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[userId, userType, title,userDetails,feedback])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/giveFeedbackS',auth3, async (req,res) => {
    let userId = req.body.userId
    let userType = req.body.userType
    let title = req.body.title
    let userDetails = req.body.userDetails
    let feedback = req.body.feedback
    let query = 'INSERT INTO feedback(userId, userType,title, userDetails, feedback) VALUES (?,?,?,?,?)'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[userId, userType, title,userDetails,feedback])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/comment',auth, async (req,res) => {
    let fbId = req.body.fbId
    let userDetails = req.body.userDetails
    let comment = req.body.comment
    let query = 'INSERT INTO comments(fbId, userDetails, comment) VALUES (?,?,?)'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[fbId,userDetails,comment])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/commentL',auth2, async (req,res) => {
    let fbId = req.body.fbId
    let userDetails = req.body.userDetails
    let comment = req.body.comment
    let query = 'INSERT INTO comments(fbId, userDetails, comment) VALUES (?,?,?)'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[fbId,userDetails,comment])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/commentSt',auth3, async (req,res) => {
    let fbId = req.body.fbId
    let userDetails = req.body.userDetails
    let comment = req.body.comment
    let query = 'INSERT INTO comments(fbId, userDetails, comment) VALUES (?,?,?)'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[fbId,userDetails,comment])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/comments',auth, async (req,res) => {
    let fbId = req.body.fbId
    let query = 'SELECT * FROM comments WHERE fbId = ?'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[fbId])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/commentsL',auth2, async (req,res) => {
    let fbId = req.body.fbId
    let query = 'SELECT * FROM comments WHERE fbId = ?'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[fbId])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/commentsS',auth3, async (req,res) => {
    let fbId = req.body.fbId
    let query = 'SELECT * FROM comments WHERE fbId = ?'

    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[fbId])
        res.send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router