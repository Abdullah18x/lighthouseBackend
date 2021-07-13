const express = require('express');
const sql = require('../config/mysqlConfig')
const token = require('../methods/generateToken')
const auth = require('../middleware/adminAuth')
const auth2 = require('../middleware/lecturerAuth')
const auth3 = require('../middleware/studentAuth')

const router = new express.Router()

//Login
router.post('/login', async (req,res) => {
    let userName = req.body.userName
    let password = req.body.password
    let query = 'Select * from student where userName = ? and password = ?'
     try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[userName,password])
        console.log(data)
        if(data.length === 0 || data === undefined){
            res.status(400).send('Invalid login')
        }
        let getToken = await token.generateToken(data[0].studentId,3,data[0].userName)
        let data2 = {...data[0], token: getToken}
        console.log(data2)
        res.send(data2)

    } catch (error) {
        res.status(400).send('error here')
    }
})

//Get all Students
router.post('/getAll', auth, async (req,res) => {
    let query = 'SELECT * FROM student'
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query)
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/getStudent', auth3, async (req,res) => {
    let studentId = req.body.studentId
    let query = 'SELECT * FROM student LEFT JOIN studentsection ON student.studentId = studentsection.studentId LEFT JOIN studentsubject ON student.studentId = studentsubject.studentId WHERE student.studentId = ?'
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[studentId])
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/fetchStudent', auth2, async (req,res) => {
    let lecturerId = req.body.lecturerId
    let studentId = req.body.studentId
    let query = 'SELECT student.studentId, name, rollNo,email, section, subject, atRisk FROM lecturerassigned LEFT JOIN registeration ON lecturerassigned.assignId = registeration.assignId LEFT JOIN student ON student.studentId = registeration.studentId LEFT JOIN section ON section.sectionId = lecturerassigned.sectionId LEFT JOIN subject ON subject.subjectId = lecturerassigned.subjectId LEFT JOIN atriskstatus ON atriskstatus.studentId = student.studentId AND atriskstatus.assignId = lecturerassigned.assignId WHERE lecturerassigned.lecturerId = ? AND student.studentId = ?'
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[lecturerId, studentId])
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/fetchStudentA', auth, async (req,res) => {
    let studentId = req.body.studentId
    let query = 'SELECT * FROM student INNER JOIN registeration ON student.studentId = registeration.studentId INNER JOIN lecturerassigned ON registeration.assignId = lecturerassigned.assignId INNER JOIN subject ON subject.subjectId = lecturerassigned.subjectId INNER JOIN section ON section.sectionId = lecturerassigned.sectionId WHERE student.studentId = ?'
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[studentId])
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Get Lecturer Students
router.post('/getLecturerStudents',auth, async (req,res) => {
    let assignId = req.body.assignId
    let lecturerId = req.body.lecturerId
    let query = 'SELECT student.studentId, name, email, rollNo, atRisk FROM lecturerassigned LEFT JOIN section ON section.sectionId = lecturerassigned.sectionId LEFT JOIN subject ON subject.subjectId = lecturerassigned.subjectId LEFT JOIN registeration on registeration.assignId = lecturerassigned.assignId LEFT JOIN student ON registeration.studentId = student.studentId LEFT JOIN atriskstatus ON atriskstatus.studentId = student.studentId AND atriskstatus.assignId = lecturerassigned.assignId WHERE lecturerassigned.lecturerId = ? AND lecturerassigned.assignId = ?'
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query, [lecturerId,assignId])
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Get Lecturer Students 2
router.post('/fetchStudents',auth2, async (req,res) => {
    let lecturerId = req.body.lecturerId
    let query = 'SELECT student.studentId, name, rollNo, email, section, subject, atRisk FROM lecturerassigned LEFT JOIN registeration ON lecturerassigned.assignId = registeration.assignId LEFT JOIN student ON student.studentId = registeration.studentId LEFT JOIN section ON section.sectionId = lecturerassigned.sectionId LEFT JOIN subject ON subject.subjectId = lecturerassigned.subjectId LEFT JOIN atriskstatus ON atriskstatus.assignId = lecturerassigned.assignId AND atriskstatus.studentId = student.studentId WHERE lecturerId = ?'
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query, [lecturerId])
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Add a student
router.post('/addS',auth, async (req,res) => {
    let userName = req.body.userName
    let password = req.body.password
    let email = req.body.email
    let name = req.body.name
    let rollNo = req.body.rollNo
    let query = 'Select * from student where username = ?'
    
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[userName])
        if(data.length === 0 || data === undefined){
            let query2 = 'INSERT INTO student (userName, password, name, rollNo, email) VALUES (?, ?, ?, ?, ?)'
            try {
                await conn.execute(query2,[userName,password,name,rollNo,email])
                res.send('Inserted')
            } catch (error) {
                res.status(400).send(error)
            }
        }else{
            res.status(400).send('Username Taken')
        }
        
    } catch (error) {
        res.status(401).send(error)
    } 
})

//get at risk students
router.post('/getAtRiskStudents',auth, async (req,res) => {
    let query = 'SELECT student.studentId, name, rollNo, email, section, subject FROM student LEFT JOIN registeration ON registeration.studentId = student.studentId LEFT JOIN lecturerassigned ON lecturerassigned.assignId = registeration.assignId LEFT JOIN section ON section.sectionId = lecturerassigned.sectionId LEFT JOIN subject ON subject.subjectId = lecturerassigned.subjectId LEFT JOIN atriskstatus ON atriskstatus.assignId = lecturerassigned.assignId AND student.studentId = atriskstatus.studentId WHERE riskId IS NOT NULL'
    
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query)
        res.send(data)
    } catch (error) {
        res.status(401).send(error)
    } 
})

router.post('/getLecturerAtRiskStudents',auth2, async (req,res) => {
    let lecturerId = req.body.lecturerId
    let query = 'SELECT student.studentId, name, rollNo, email, section, subject FROM lecturerassigned LEFT JOIN registeration ON lecturerassigned.assignId = registeration.assignId LEFT JOIN student ON student.studentId = registeration.studentId LEFT JOIN section ON section.sectionId = lecturerassigned.sectionId LEFT JOIN subject ON subject.subjectId = lecturerassigned.subjectId LEFT JOIN atriskstatus ON atriskstatus.assignId = lecturerassigned.assignId AND atriskstatus.studentId = student.studentId WHERE lecturerId = ? and atriskstatus.riskId IS NOT NULL ORDER BY riskId DESC'
    
    try {
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[lecturerId])
        res.send(data)
    } catch (error) {
        res.status(401).send(error)
    } 
})


//Update a student profile(Admin and lecturer authority)
router.patch('/updateS', async (req,res) => {
    let userName = req.body.userName
    let newUserName = req.body.newUserName
    let password = req.body.password
    let name = req.body.name
    let rollNo = req.body.rollNo
    let email = req.body.email
    let sectionId = req.body.sectionId

    try {
        let conn = await sql.getDBConnection();
        if(newUserName === userName){
            let query = 'UPDATE student SET userName = ?, password = ?, name = ?, rollNo = ?, email = ?, sectionId = ? WHERE student.userName = ?'
            try {
                await conn.execute(query,[userName,password,name,rollNo,email,sectionId,userName])
                res.status(200).send('Updated1')
            } catch (error) {
                res.status(400).send(error)
            }
        }else{
            let query = 'Select * from student where username = ?'
            try {
                let[data,fields] = await conn.execute(query, [newUserName])
                if(data.length === 0 || data.length === undefined){
                    let query2 = 'UPDATE student SET userName = ?, password = ?, name = ?, rollNo = ?, email = ?, sectionId = ? WHERE student.userName = ?'
                    try {
                        await conn.execute(query2,[newUserName,password,name,rollNo,email,sectionId,userName])
                        res.send('Updated2')
                    } catch (error) {
                        res.status(400).send(error)
                    }
                }
                else{
                    res.status(400).send('Username Taken')
                }
            } catch (error) {
                res.status(400).send(error)
            }
        }
    } catch (error) {
        res.status(400).send(error)
    }

})

//Update a student(Restricted Router for students)
router.patch('/restrictedUpdateS', async (req,res) => {
    let userName = req.body.userName
    let password = req.body.password
    let email = req.body.email
    let query = 'UPDATE student SET password = ?, email = ? WHERE student.userName = ?'

    try {
        let conn = await sql.getDBConnection();
        await conn.execute(query,[password,email,userName])
        res.status(200).send('Updated')
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/removeStudentFromSection', async (req,res) => {
    let studentId = req.body.studentId
    let query = 'DELETE FROM studentsection WHERE studentId = ?'
    let query2 = 'DELETE FROM studentsubject WHERE studentId = ?'
    try {
        let conn = await sql.getDBConnection();
        await conn.execute(query,[studentId])
        await conn.execute(query2,[studentId])
        res.status(200).send('Student Removed')
    } catch (error) {
        res.status(400).send(error)
    }
})

//Delete Student
router.delete('/deleteS', async (req,res) => {
    let studentId = req.body.studentId
    let query = 'DELETE FROM student WHERE student.studentId = ?'
    try {
        let conn = await sql.getDBConnection();
        await conn.execute(query,[studentId])
        res.status(200).send('Student Deleted')
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router