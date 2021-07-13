const express = require('express');
const sql = require('../config/mysqlConfig')
const auth = require('../middleware/adminAuth')

const router = new express.Router()

//Get All Subjects
router.post('/getSubjects', auth, async (req,res) => {
    let query = 'SELECT * FROM subject'
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query)
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/insertSubject', auth, async (req,res) => {
    let subject = req.body.subject
    let query = 'INSERT INTO subject(subject) VALUES (?)'
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[subject])
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch('/updateSubject', auth, async (req,res) => {
    let subject = req.body.subject
    let subjectId = req.body.subjectId
    let query = 'UPDATE subject SET subject=? WHERE subjectId = ?'
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[subject,subjectId])
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router