const express = require('express')
var cors = require('cors')
// const session = require('express-session')

const adminRouter = require('./src/routers/admin')
const lecturerRouter = require('./src/routers/lecturer')
const studentRouter = require('./src/routers/student')
const assignmentRouter = require('./src/routers/assignment')
const dataSetRouter = require('./src/routers/dataSet')
const logoutRouter = require('./src/routers/logout')
const sectionRouter = require('./src/routers/sections')
const subjectRouter = require('./src/routers/subjects')
const feddbackRouter = require('./src/routers/feedback')
const verifyUserToken = require('./src/routers/verifyUserToken')


const app = express()
const port = 3010
app.use(cors())

app.set('trsut proxy', 1)
// app.use(session({
//     secret:'abcd',
//     resave:false,
//     saveUninitialized:true,
//     cookie:{
//         secure:false
//     }
// }))

app.use(express.json())
app.use('/admin',adminRouter)
app.use('/lecturer',lecturerRouter)
app.use('/student',studentRouter)
app.use('/assignment',assignmentRouter)
app.use('/dataSet',dataSetRouter)
app.use('/logout',logoutRouter)
app.use('/sections',sectionRouter)
app.use('/subjects',subjectRouter)
app.use('/feedback',feddbackRouter)
app.use('/verifyUserToken',verifyUserToken)

app.listen(port, () => {
    console.log('Server running at port ' + port)
})