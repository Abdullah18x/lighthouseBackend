const express = require("express");
const sql = require("../config/mysqlConfig");
const auth = require("../middleware/adminAuth");
const auth2 = require("../middleware/lecturerAuth");
const auth3 = require("../middleware/studentAuth");
const multer = require("multer");
var path = require("path");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });
const router = new express.Router();

router.post(
  "/createDataSet",
  auth,
  upload.single("resourceMaterial"),
  async (req, res) => {
    let title = req.body.title;
    let totalMarks = req.body.totalMarks;
    let timeNeeded = req.body.timeNeeded;
    let ifC = req.body.ifC;
    let switchC = req.body.switchC;
    let whileL = req.body.whileL;
    let dowhileL = req.body.dowhileL;
    let forL = req.body.forL;
    let multipleClasses = req.body.multipleClasses;
    let methods = req.body.methods;
    let arrays = req.body.arrays;
    let expectedAnsType = req.body.expectedAnsType;
    let subjectId = req.body.subjectId;
    let resourceMaterial = req.file.filename;
    let details = req.body.details;
    let resourceLinks = req.body.resourceLinks;
    let expectedAns = req.body.expectedAns;
    let solution = req.body.solution;

    let query =
      "INSERT INTO datasets(title, totalMarks, timeNeeded, ifC, switchC, whileL, dowhileL, forL, multipleClasses, methods, arrays, expectedAnsType, subjectId, resourceMaterial, details, resourceLinks,expectedAns, solution) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    try {
      // if (!file) {
      //     const error = new Error('Please upload a file')
      //     error.httpStatusCode = 400
      //     console.log(error)
      //   }
      let conn = await sql.getDBConnection();
      await conn.execute(query, [
        title,
        totalMarks,
        timeNeeded,
        ifC,
        switchC,
        whileL,
        dowhileL,
        forL,
        multipleClasses,
        methods,
        arrays,
        expectedAnsType,
        subjectId,
        resourceMaterial,
        details,
        resourceLinks,
        expectedAns,
        solution,
      ]);
      res.status(200).send("Inserted assignment");
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  }
);

router.post("/getDataSets", auth, async (req, res) => {
  let query =
    "SELECT * FROM datasets LEFT JOIN subject ON datasets.subjectId = subject.subjectId";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getDataSets2", auth2, async (req, res) => {
  let query =
    "SELECT * FROM datasets LEFT JOIN subject ON datasets.subjectId = subject.subjectId";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getDataSet", auth, async (req, res) => {
  let datasetId = req.body.datasetId;
  let query = "SELECT * FROM datasets WHERE datasetId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [datasetId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getDataSet2", auth2, async (req, res) => {
  let datasetId = req.body.datasetId;
  let query =
    "SELECT * FROM datasets LEFT JOIN subject ON datasets.subjectId = subject.subjectId WHERE datasetId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [datasetId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getDataSet3", auth3, async (req, res) => {
  let datasetId = req.body.datasetId;
  let query =
    "SELECT * FROM datasets LEFT JOIN subject ON datasets.subjectId = subject.subjectId WHERE datasetId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [datasetId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getMarkedDataSets", auth3, async (req, res) => {
  let studentId = req.body.studentId;
  let query =
    "SELECT * FROM studentsubmissionsD LEFT JOIN assignedDataSet ON studentsubmissionsD.assignedSId = assignedDataSet.assignedSId LEFT JOIN datasets ON assignedDataSet.datasetId = datasets.datasetId LEFT JOIN section ON assignedDataSet.sectionId = section.sectionId LEFT JOIN subject ON assignedDataSet.subjectId = subject.subjectId WHERE studentsubmissionsD.studentId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [studentId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getDataSets3", auth3, async (req, res) => {
  let studentId = req.body.studentId;
  let query =
    "SELECT datasets.datasetId, title, totalMarks, section, subject, assigned, due, assignedSId, assignmentType FROM student LEFT JOIN registeration ON registeration.studentId = student.studentId LEFT JOIN lecturerassigned ON registeration.assignId = lecturerassigned.assignId LEFT JOIN assignedDataSet ON assignedDataSet.lecturerId = lecturerassigned.lecturerId AND assignedDataSet.sectionId = lecturerassigned.sectionId AND assignedDataSet.subjectId = lecturerassigned.subjectId LEFT JOIN datasets ON datasets.datasetId = assignedDataSet.datasetId LEFT JOIN section ON section.sectionId = lecturerassigned.sectionId LEFT JOIN subject ON subject.subjectId = lecturerassigned.subjectId WHERE student.studentId = ? AND assignedSId IS NOT NULL";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [studentId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getAssignedDataSets", auth2, async (req, res) => {
  let lecturerId = req.body.lecturerId;
  let query =
    "SELECT * FROM assignedDataSet LEFT JOIN datasets ON datasets.datasetId = assignedDataSet.datasetId LEFT JOIN section ON section.sectionId = assignedDataSet.sectionId LEFT JOIN subject ON subject.subjectId = assignedDataSet.subjectId WHERE lecturerId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [lecturerId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getAssignedDataSet", auth2, async (req, res) => {
  let assignedSId = req.body.assignedSId;
  let query =
    "SELECT * FROM assignedDataSet LEFT JOIN datasets ON datasets.datasetId = assignedDataSet.datasetId LEFT JOIN section ON section.sectionId = assignedDataSet.sectionId LEFT JOIN subject ON subject.subjectId = assignedDataSet.subjectId WHERE assignedSId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [assignedSId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getAssignedDataSet2", auth3, async (req, res) => {
  let assignedSId = req.body.assignedSId;
  let query =
    "SELECT * FROM assignedDataSet LEFT JOIN datasets ON datasets.datasetId = assignedDataSet.datasetId LEFT JOIN section ON section.sectionId = assignedDataSet.sectionId LEFT JOIN subject ON subject.subjectId = assignedDataSet.subjectId WHERE assignedSId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [assignedSId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getSubmittedDataSets", auth2, async (req, res) => {
  let assignedSId = req.body.assignedSId;
  let query =
    "SELECT submissionSId, datasetId, student.studentId, name, rollNo, section, subject, assignedDataSet.assignedSId, submittedAt, marksObtained, checked FROM lecturerassigned LEFT JOIN registeration ON lecturerassigned.assignId = registeration.assignId LEFT JOIN student ON student.studentId = registeration.studentId LEFT JOIN assignedDataSet ON assignedDataSet.lecturerId = lecturerassigned.lecturerId AND assignedDataSet.sectionId = lecturerassigned.sectionId AND assignedDataSet.subjectId = lecturerassigned.subjectId LEFT JOIN studentsubmissionsD ON studentsubmissionsD.assignedSId = assignedDataSet.assignedSId AND studentsubmissionsD.studentId = registeration.studentId LEFT JOIN section ON section.sectionId = lecturerassigned.sectionId LEFT JOIN subject ON subject.subjectId = lecturerassigned.subjectId WHERE assignedDataSet.assignedSId = ? AND studentsubmissionsD.submissionSId IS NOT NULL";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [assignedSId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getStudentSubmissionS", auth3, async (req, res) => {
  let assignedSId = req.body.assignedSId;
  let studentId = req.body.studentId;
  let query =
    "SELECT * FROM `studentsubmissionsD` INNER JOIN student ON studentsubmissionsD.studentId = student.studentId WHERE assignedSId = ? AND studentsubmissionsD.studentId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [assignedSId, studentId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/studentSubmission", auth3, async (req, res) => {
  let assignedSId = req.body.assignedSId;
  let studentId = req.body.studentId;
  let solution = req.body.solution;
  let errorsList = req.body.errorsList;
  let errors = req.body.errors;
  let timeTaken = req.body.timeTaken;

  console.log(assignedSId);
  console.log(studentId);
  console.log(solution);
  console.log(errorsList);
  console.log(errors);
  console.log(timeTaken);

  let query = "SELECT due FROM assignedDataSet WHERE assignedSId = ?";
  let query2 =
    "INSERT INTO studentsubmissionsD(assignedSId, studentId, solution, errorList, timeTaken, errorsNo) VALUES (?,?,?,?,?,?)";
  let query3 =
    "SELECT submissionSId, submittedAt FROM studentsubmissionsD WHERE studentId = ? ORDER BY submissionSId DESC LIMIT 1";
  let query4 =
    "UPDATE studentsubmissionsD SET late = 1 WHERE studentsubmissionsD.submissionSId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [assignedSId]);
    let [data2, fields2] = await conn.execute(query2, [
      assignedSId,
      studentId,
      solution,
      errorsList,
      timeTaken,
      errors,
    ]);
    let [data3, fields3] = await conn.execute(query3, [studentId]);

    let due = new Date(data[0].due);
    let submitted = new Date(data3[0].submittedAt);
    if (due.getTime() < submitted.getTime()) {
      let [data4, fields4] = await conn.execute(query4, [
        data3[0].submissionId,
      ]);
    }
    res.status(200).send("Inserted");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getPendingStudents", auth2, async (req, res) => {
  let assignedSId = req.body.assignedSId;
  let query =
    "SELECT student.studentId, name, rollNo, section, subject, assignedDataSet.assignedSId FROM lecturerassigned LEFT JOIN registeration ON lecturerassigned.assignId = registeration.assignId LEFT JOIN student ON student.studentId = registeration.studentId LEFT JOIN assignedDataSet ON assignedDataSet.lecturerId = lecturerassigned.lecturerId AND assignedDataSet.sectionId = lecturerassigned.sectionId AND assignedDataSet.subjectId = lecturerassigned.subjectId LEFT JOIN studentsubmissionsD ON studentsubmissionsD.assignedSId = assignedDataSet.assignedSId AND studentsubmissionsD.studentId = registeration.studentId LEFT JOIN section ON section.sectionId = lecturerassigned.sectionId LEFT JOIN subject ON subject.subjectId = lecturerassigned.subjectId WHERE assignedDataSet.assignedSId = ? AND studentsubmissionsD.submissionSId IS NULL";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [assignedSId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getStudentSubmissionA", auth, async (req, res) => {
  let assignedSId = req.body.assignedSId;
  let studentId = req.body.studentId;
  console.log(assignedSId);
  console.log(studentId);
  let query =
    "SELECT * FROM studentsubmissionsD INNER JOIN student on studentsubmissionsD.studentId = student.studentId WHERE studentsubmissionsD.assignedSId = ? AND student.studentId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [assignedSId, studentId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getStudentSubmission", auth2, async (req, res) => {
  let assignedSId = req.body.assignedSId;
  let studentId = req.body.studentId;
  let query =
    "SELECT * FROM studentsubmissionsD INNER JOIN student on studentsubmissionsD.studentId = student.studentId WHERE studentsubmissionsD.assignedSId = ? AND student.studentId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [assignedSId, studentId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/gradeAssignment", auth2, async (req, res) => {
  let submissionSId = req.body.submissionSId;
  let marksObtained = req.body.marksObtained;
  let query =
    "UPDATE studentsubmissionsD SET marksObtained=?,checked=1 WHERE submissionSId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [
      marksObtained,
      submissionSId,
    ]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/deleteStudentSubmission", auth2, async (req, res) => {
  let submissionSId = req.body.submissionSId;
  let query = "DELETE FROM studentsubmissionsD WHERE submissionSId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [submissionSId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getRecentStudentSubmissions", auth, async (req, res) => {
  let studentId = req.body.studentId;
  let query =
    "SELECT * FROM studentsubmissionsD INNER JOIN assignedDataSet ON assignedDataSet.assignedSId = studentsubmissionsD.assignedSId INNER JOIN subject ON assignedDataSet.subjectId = subject.subjectId WHERE studentId = ? ORDER BY submissionSId DESC";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [studentId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getAssignedDataSetssStats", auth2, async (req, res) => {
  let lecturerId = req.body.lecturerId;
  let sectionId = req.body.sectionId;
  let subjectId = req.body.subjectId;
  let query =
    "SELECT COUNT(assignedSId) AS totalAssigned, COALESCE(SUM(timeNeeded),0) AS totalTime, COALESCE (SUM(totalMarks),0) AS totalMarks FROM (SELECT DISTINCT assignedSId, timeNeeded, totalMarks FROM lecturerassigned INNER JOIN assignedDataSet ON lecturerassigned.lecturerId = assignedDataSet.lecturerId AND assignedDataSet.sectionId = lecturerassigned.sectionId AND assignedDataSet.subjectId = lecturerassigned.subjectId INNER JOIN datasets ON datasets.datasetId = assignedDataSet.datasetId WHERE lecturerassigned.lecturerId = ? AND assignedDataSet.sectionId = ? AND assignedDataSet.subjectId = ? ) A";
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

router.patch("/uopdateDataSetWOF", auth, async (req, res) => {
  let datasetId = req.body.datasetId;
  let title = req.body.title;
  let totalMarks = req.body.totalMarks;
  let timeNeeded = req.body.timeNeeded;
  let ifC = req.body.ifC;
  let switchC = req.body.switchC;
  let whileL = req.body.whileL;
  let dowhileL = req.body.dowhileL;
  let forL = req.body.forL;
  let multipleClasses = req.body.multipleClasses;
  let methods = req.body.methods;
  let arrays = req.body.arrays;
  let expectedAnsType = req.body.expectedAnsType;
  let subjectId = req.body.subjectId;
  let details = req.body.details;
  let resourceLinks = req.body.resourceLinks;
  let expectedAns = req.body.expectedAns;
  let solution = req.body.solution;

  // console.log(datasetId)
  // console.log(title)
  // console.log(totalMarks)
  // console.log(timeNeeded)
  // console.log(ifC)
  // console.log(switchC)
  // console.log(whileL)
  // console.log(dowhileL)
  // console.log(forL)
  // console.log(multipleClasses)
  // console.log(methods)
  // console.log(arrays)
  // console.log(expectedAnsType)
  // console.log(subjectId)
  // console.log(details)
  // console.log(resourceLinks)
  // console.log(expectedAns)
  // console.log(solution)

  let query =
    "UPDATE datasets SET title=?, totalMarks=?, timeNeeded=?, ifC=?, switchC=?, whileL=?, dowhileL=?, forL=?, multipleClasses=?, methods=?, arrays=?, expectedAnsType=?, subjectId=?, details=?, resourceLinks=?, expectedAns=?, solution=? WHERE datasetId =?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [
      title,
      totalMarks,
      timeNeeded,
      ifC,
      switchC,
      whileL,
      dowhileL,
      forL,
      multipleClasses,
      methods,
      arrays,
      expectedAnsType,
      subjectId,
      details,
      resourceLinks,
      expectedAns,
      solution,
      datasetId,
    ]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch(
  "/uopdateDataSetWF",
  auth,
  upload.single("resourceMaterial"),
  async (req, res) => {
    let datasetId = req.body.datasetId;
    let title = req.body.title;
    let totalMarks = req.body.totalMarks;
    let timeNeeded = req.body.timeNeeded;
    let ifC = req.body.ifC;
    let switchC = req.body.switchC;
    let whileL = req.body.whileL;
    let dowhileL = req.body.dowhileL;
    let forL = req.body.forL;
    let multipleClasses = req.body.multipleClasses;
    let methods = req.body.methods;
    let arrays = req.body.arrays;
    let expectedAnsType = req.body.expectedAnsType;
    let subjectId = req.body.subjectId;
    let resourceMaterial = req.file.filename;
    let details = req.body.details;
    let resourceLinks = req.body.resourceLinks;
    let expectedAns = req.body.expectedAns;
    let solution = req.body.solution;

    let query =
      "UPDATE datasets SET title=?, totalMarks=?, timeNeeded=?, ifC=?, switchC=?, whileL=?, dowhileL=?, forL=?, multipleClasses=?, methods=?, arrays=?, expectedAnsType=?, subjectId=?,resourceMaterial=?, details=?, resourceLinks=?, expectedAns=?, solution=? WHERE datasetId =?";

    try {
      let conn = await sql.getDBConnection();
      let [data, fields] = await conn.execute(query, [
        title,
        totalMarks,
        timeNeeded,
        ifC,
        switchC,
        whileL,
        dowhileL,
        forL,
        multipleClasses,
        methods,
        arrays,
        expectedAnsType,
        subjectId,
        resourceMaterial,
        details,
        resourceLinks,
        expectedAns,
        solution,
        datasetId,
      ]);
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

router.post("/checkAssigned", auth2, async (req, res) => {
  let datasetId = req.body.datasetId;
  let sectionId = req.body.sectionId;
  let subjectId = req.body.subjectId;
  let query =
    "SELECT * FROM assignedDataSet WHERE datasetId = ? AND sectionId = ? AND subjectId =?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [
      datasetId,
      sectionId,
      subjectId,
    ]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/assignDataSet", auth2, async (req, res) => {
  let lecturerId = req.body.lecturerId;
  let datasetId = req.body.datasetId;
  let sectionId = req.body.sectionId;
  let subjectId = req.body.subjectId;
  let due = req.body.due;
  let assignmentType = 2;
  let query =
    "INSERT INTO assignedDataSet(lecturerId, datasetId, sectionId, subjectId, due, assignmentType) VALUES (?,?,?,?,?,?)";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [
      lecturerId,
      datasetId,
      sectionId,
      subjectId,
      due,
      assignmentType,
    ]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getRecentSubmissions", auth2, async (req, res) => {
  let lecturerId = req.body.lecturerId;
  let query =
    "SELECT * FROM lecturerassigned LEFT JOIN registeration ON registeration.assignId = lecturerassigned.assignId LEFT JOIN student ON student.studentId = registeration.studentId LEFT JOIN assignedDataSet ON assignedDataSet.lecturerId = lecturerassigned.lecturerId LEFT JOIN datasets ON datasets.datasetId = assignedDataSet.datasetId LEFT JOIN studentsubmissionsD ON studentsubmissionsD.assignedSId = assignedDataSet.assignedSId AND studentsubmissionsD.studentId = registeration.studentId LEFT JOIN section ON section.sectionId = lecturerassigned.sectionId LEFT JOIN subject ON subject.subjectId = lecturerassigned.subjectId WHERE lecturerassigned.lecturerId = ? AND studentsubmissionsD.submissionSId IS NOT NULL ORDER BY studentsubmissionsD.submissionSId DESC LIMIT 5";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [lecturerId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getRecentSTDSubmissions", auth2, async (req, res) => {
  let lecturerId = req.body.lecturerId;
  let studentId = req.body.studentId;
  let query =
    "SELECT datasets.datasetId, assignedDataSet.assignedSId, title, student.studentId, name, rollNo, section, subject, submittedAt,marksObtained, due, checked, marksObtained FROM lecturerassigned LEFT JOIN registeration ON lecturerassigned.assignId = registeration.assignId LEFT JOIN student ON student.studentId = registeration.studentId LEFT JOIN section ON section.sectionId = lecturerassigned.sectionId LEFT JOIN subject ON subject.subjectId = lecturerassigned.subjectId LEFT JOIN assignedDataSet ON assignedDataSet.lecturerId = lecturerassigned.lecturerId AND assignedDataSet.sectionId = lecturerassigned.sectionId AND assignedDataSet.subjectId = lecturerassigned.subjectId LEFT JOIN datasets ON datasets.datasetId = assignedDataSet.datasetId LEFT JOIN studentsubmissionsD ON studentsubmissionsD.studentId = student.studentId AND studentsubmissionsD.assignedSId = assignedDataSet.assignedSId WHERE lecturerassigned.lecturerId = ? AND student.studentId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [lecturerId, studentId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/deleteAssignedAssignment", auth2, async (req, res) => {
  let datasetId = req.body.datasetId;
  let assignedSId = req.body.assignedSId;
  let query = "DELETE FROM assignedDataSet WHERE assignedSId = ?";
  let query2 = "DELETE FROM studentsubmissionsD WHERE assignedSId = ?";
  try {
    let conn = await sql.getDBConnection();
    await conn.execute(query, [assignedSId]);
    await conn.execute(query2, [assignedSId]);
    res.status(200).send("Deleted");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/deleteDs", auth, async (req, res) => {
  let datasetId = req.body.datasetId;
  let query =
    "DELETE datasets, assignedDataSet, studentsubmissionsD FROM datasets LEFT JOIN assignedDataSet ON assignedDataSet.datasetId = datasets.datasetId LEFT JOIN studentsubmissionsD ON studentsubmissionsD.assignedSId = assignedDataSet.assignedSId WHERE datasets.datasetId = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [datasetId]);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
