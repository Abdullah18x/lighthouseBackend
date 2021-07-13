const express = require("express");
const sql = require("../config/mysqlConfig");
const auth = require("../middleware/adminAuth");
const auth2 = require("../middleware/lecturerAuth");

const router = new express.Router();

router.post("/addSection", auth, async (req, res) => {
  let section = req.body.section;
  let query = "INSERT INTO section(section) VALUES (?)";
  try {
    let conn = await sql.getDBConnection();
    await conn.execute(query, [section]);
    res.status(200);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getSections", auth, async (req, res) => {
  let query =
    "SELECT section.sectionId, section.section, COUNT(DISTINCT lecturerId) AS totalLecturers, COUNT(DISTINCT studentId) AS students FROM section LEFT JOIN lecturerassigned ON section.sectionId = lecturerassigned.sectionId LEFT JOIN registeration ON registeration.assignId = lecturerassigned.assignId GROUP BY sectionId";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getSection", auth, async (req, res) => {
  let sectionId = req.body.sectionId;
  console.log(sectionId);
  let query = "SELECT * FROM section WHERE sectionId=? ";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [sectionId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getRecentSections", auth, async (req, res) => {
  let query =
    "SELECT section.sectionId AS sectionId,section.section, COUNT(DISTINCT lecturerassigned.lecturerId) AS totalLecturers, COUNT(DISTINCT studentsection.studentId) AS students FROM section LEFT JOIN lecturerassigned ON section.sectionId = lecturerassigned.sectionId LEFT JOIN studentsection ON section.sectionId = studentsection.sectionId GROUP BY sectionId ORDER BY section.sectionId DESC LIMIT 8";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getlecturerAtRiskStudents", auth, async (req, res) => {
  let query =
    "SELECT lecturer.lecturerId AS id, lecturer.name, COUNT(DISTINCT lecturerassigned.sectionId) AS totalSections, COUNT(DISTINCT atriskstatus.studentId) AS totalStudents FROM lecturer INNER JOIN lecturerassigned on lecturer.lecturerId = lecturerassigned.lecturerId INNER JOIN registeration ON registeration.assignId = lecturerassigned.assignId left JOIN atriskstatus ON registeration.assignId = atriskstatus.assignId GROUP BY lecturer.lecturerId HAVING COUNT(DISTINCT atriskstatus.studentId) > 0 ORDER BY lecturerassigned.assignId DESC LIMIT 8";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getAlllecturerAtRiskStudents", auth, async (req, res) => {
  let query =
    "SELECT lecturer.lecturerId AS id, lecturer.name, COUNT(DISTINCT lecturerassigned.sectionId) AS totalSections, COUNT(DISTINCT atriskstatus.studentId) AS totalStudents FROM lecturer INNER JOIN lecturerassigned on lecturer.lecturerId = lecturerassigned.lecturerId INNER JOIN registeration ON registeration.assignId = lecturerassigned.assignId left JOIN atriskstatus ON registeration.assignId = atriskstatus.assignId GROUP BY lecturer.lecturerId HAVING COUNT(DISTINCT atriskstatus.studentId) > 0 ORDER BY lecturerassigned.assignId DESC";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getAssignedLecturers", auth, async (req, res) => {
  let sectionId = req.body.sectionId;
  let query =
    "SELECT lecturerassigned.assignId, lecturer.lecturerId, name, email, subject, COUNT(DISTINCT registeration.studentId) AS totalStudents, COUNT(DISTINCT riskId) AS totalAtRisk FROM section LEFT JOIN lecturerassigned ON lecturerassigned.sectionId = section.sectionId LEFT JOIN lecturer ON lecturer.lecturerId = lecturerassigned.lecturerId LEFT JOIN subject ON subject.subjectId = lecturerassigned.subjectId LEFT JOIN registeration ON registeration.assignId = lecturerassigned.assignId LEFT JOIN atriskstatus ON atriskstatus.studentId = registeration.studentId AND atriskstatus.assignId = lecturerassigned.assignId WHERE section.sectionId = ? GROUP BY lecturerassigned.assignId";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [sectionId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getSectionStudents", auth, async (req, res) => {
  let sectionId = req.body.sectionId;
  let query =
    "SELECT student.studentId, name, email, rollNo FROM lecturerassigned LEFT JOIN section ON section.sectionId = lecturerassigned.sectionId LEFT JOIN registeration ON registeration.assignId = lecturerassigned.assignId LEFT JOIN student on student.studentId = registeration.studentId WHERE section.sectionId = ?";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [sectionId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getSectionStudents2", auth2, async (req, res) => {
  let assignId = req.body.assignId;
  let query =
    "SELECT student.studentId, name, email, rollNo, atRisk FROM lecturerassigned INNER JOIN registeration ON lecturerassigned.assignId = registeration.assignId INNER JOIN student ON student.studentId = registeration.studentId LEFT JOIN atriskstatus ON atriskstatus.studentId = student.studentId WHERE lecturerassigned.assignId = ?";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [assignId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getAssignedAssignmentsStats", auth2, async (req, res) => {
  let lecturerId = req.body.lecturerId;
  let sectionId = req.body.sectionId;
  let subjectId = req.body.subjectId;
  let query =
    "SELECT COUNT(assignedId) AS totalAssigned, COALESCE(SUM(timeNeeded),0) AS totalTime, COALESCE(SUM(totalMarks),0) AS totalMarks FROM (SELECT DISTINCT assignedId, timeNeeded, totalMarks FROM lecturerassigned INNER JOIN assignment ON lecturerassigned.lecturerId = assignment.lecturerId INNER JOIN assignedassignment ON assignedassignment.assignmentId = assignment.assignmentId WHERE lecturerassigned.lecturerId = ? AND assignedassignment.sectionId = ? AND assignedassignment.subjectId = ? ) A";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [
      lecturerId,
      sectionId,
      subjectId,
    ]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getStudentsStats", auth2, async (req, res) => {
  let lecturerId = req.body.lecturerId;
  let sectionId = req.body.sectionId;
  let subjectId = req.body.subjectId;
  // let query = 'SELECT registeration.studentId, COUNT(submissionId) AS totalSubmissions,COALESCE(SUM(timetaken),0) AS totalTime, COALESCE(SUM(marksObtained),0) AS totalMarks, COUNT(CASE WHEN late > 0 THEN 1 END) AS timesLate  FROM lecturerassigned LEFT JOIN registeration ON lecturerassigned.assignId = registeration.assignId LEFT JOIN assignment ON assignment.lecturerId = lecturerassigned.lecturerId LEFT JOIN assignedassignment ON assignedassignment.assignmentId = assignment.assignmentId AND assignedassignment.sectionId = lecturerassigned.sectionId LEFT JOIN studentsubmissions ON studentsubmissions.assignedId = assignedassignment.assignedId AND studentsubmissions.studentId = registeration.studentId WHERE lecturerassigned.lecturerId = ? AND lecturerassigned.sectionId = ? AND lecturerassigned.subjectId = ? GROUP BY registeration.studentId'
  let query = `SELECT studentId, COUNT(submissionId) AS totalSubmissions,COALESCE(SUM(timetaken),0) AS totalTime, COALESCE(SUM(marksObtained),0) AS totalMarks, COUNT(CASE WHEN late > 0 THEN 1 END) AS timesLate  FROM (SELECT registeration.studentId, submissionId, timetaken, marksObtained, late FROM lecturerassigned LEFT JOIN registeration ON lecturerassigned.assignId = registeration.assignId LEFT JOIN assignment ON assignment.lecturerId = lecturerassigned.lecturerId LEFT JOIN assignedassignment ON assignedassignment.assignmentId = assignment.assignmentId AND assignedassignment.sectionId = lecturerassigned.sectionId LEFT JOIN studentsubmissions ON studentsubmissions.assignedId = assignedassignment.assignedId AND studentsubmissions.studentId = registeration.studentId WHERE lecturerassigned.lecturerId = ? AND lecturerassigned.sectionId = ? AND lecturerassigned.subjectId = ? UNION ALL SELECT registeration.studentId, submissionSId AS submissionId, timetaken, marksObtained, late FROM lecturerassigned LEFT JOIN registeration ON lecturerassigned.assignId = registeration.assignId LEFT JOIN assignedDataSet ON assignedDataSet.lecturerId = lecturerassigned.lecturerId AND assignedDataSet.sectionId = lecturerassigned.sectionId AND assignedDataSet.subjectId = lecturerassigned.subjectId LEFT JOIN datasets ON datasets.datasetId = assignedDataSet.datasetId LEFT JOIN studentsubmissionsD ON studentsubmissionsD.assignedSId = assignedDataSet.assignedSId AND studentsubmissionsD.studentId = registeration.studentId WHERE lecturerassigned.lecturerId = ? AND lecturerassigned.sectionId = ? AND lecturerassigned.subjectId = ? ) A GROUP BY studentId`;
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [
      lecturerId,
      sectionId,
      subjectId,
      lecturerId,
      sectionId,
      subjectId,
    ]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/saveAtRiskStudents", auth2, async (req, res) => {
  let dataSTD = req.body.dataSTD;
  dataSTD = JSON.parse(dataSTD);
  let assignId = req.body.assignId;
  let query = "DELETE FROM atriskstatus WHERE assignId = ?";
  let query2 =
    "INSERT INTO atriskstatus(assignId ,studentId, atRisk) VALUES (?,?,?)";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [assignId]);
    for (let i = 0; i < dataSTD.length; i++) {
      let [data2, fields2] = await conn.execute(query2, [
        dataSTD[i].assignId,
        dataSTD[i].studentId,
        dataSTD[i].atRisk,
      ]);
    }

    res.status(200).send("Set");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getLecturerSections", auth2, async (req, res) => {
  let lecturerId = req.body.lecturerId;
  let query =
    "SELECT * FROM lecturerassigned INNER JOIN section ON lecturerassigned.sectionId = section.sectionId INNER JOIN subject ON lecturerassigned.subjectId = subject.subjectId WHERE lecturerassigned.lecturerId = ?";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [lecturerId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/updateSection", auth, async (req, res) => {
  let section = req.body.section;
  let sectionId = req.body.sectionId;
  let query = "UPDATE section SET section=? WHERE sectionId = ?";
  try {
    let conn = await sql.getDBConnection();
    await conn.execute(query, [section, sectionId]);
    res.status(200).send("updated");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/removeSection", auth, async (req, res) => {
  let sectionId = req.body.sectionId;
  console.log(sectionId);
  let query = "DELETE FROM section WHERE sectionId=?";
  let query2 = "DELETE FROM studentsection WHERE sectionId=?";
  let query3 = "SELECT * FROM lecturerassigned WHERE sectionId =?";
  let query4 = "SELECT * FROM lecturerassigned WHERE lecturerId =?";
  let query5 = "UPDATE lecturer SET status=0 WHERE lecturerId = ?";
  let query6 = "DELETE FROM lecturerassigned WHERE sectionId=?";
  try {
    let conn = await sql.getDBConnection();
    console.log("here");
    let [data, fields] = await conn.execute(query3, [sectionId]);
    console.log(data.length);
    if (data.length) {
      console.log("here");
      for (let i = 0; i < data.length; i++) {
        console.log("here");
        let [data2, fields] = await conn.execute(query4, [data[i].lecturerId]);
        if (data2.length <= 1) {
          console.log("here");
          await conn.execute(query5, [data[i].lecturerId]);
        }
      }
      await conn.execute(query6, [sectionId]);
    }
    await conn.execute(query, [sectionId]);
    await conn.execute(query2, [sectionId]);

    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
