const express = require("express");
const sql = require("../config/mysqlConfig");
const token = require("../methods/generateToken");
const auth = require("../middleware/adminAuth");

const router = new express.Router();

//Login
router.post("/login", async (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  let query = "Select * from admin where userName = ? and password = ?";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [userName, password]);

    if (data.length === 0 || data === undefined) {
      res.status(400).send("Invalid login");
    }
    let getToken = await token.generateToken(
      data[0].adminId,
      1,
      data[0].userName
    );
    let data2 = { ...data[0], token: getToken };
    res.send(data2);
  } catch (error) {
    res.status(400).send("error here");
  }
});

//Fetch Admin
router.post("/fetchAdmin", auth, async (req, res) => {
  let adminId = req.body.adminId;
  let query = "Select * from admin where adminId = ?";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [adminId]);
    res.send(data);
  } catch (error) {
    res.status(400).send("error fetching Admin");
  }
});

//Add and Admin
router.post("/addA", auth, async (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  let email = req.body.email;
  let query = "Select * from admin where username = ?";

  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [userName]);
    if (data.length === 0 || data === undefined) {
      let query2 =
        "INSERT INTO admin (email, userName, password) VALUES ( ? , ? , ?)";
      try {
        await conn.execute(query2, [email, userName, password]);
        res.send("Inserted");
      } catch (error) {
        res.status(400).send(error);
      }
    } else {
      res.status(400).send("Username Taken");
    }
  } catch (error) {
    res.status(401).send(error);
  }
});

//Update Admin
router.patch("/updateA", auth, async (req, res) => {
  let userName = req.body.userName;
  let newUserName = req.body.newUserName;
  let email = req.body.email;
  let password = req.body.password;

  try {
    let conn = await sql.getDBConnection();
    if (newUserName === userName) {
      let query =
        "UPDATE admin SET email = ? , userName = ?, password = ? WHERE admin.userName = ?";
      try {
        await conn.execute(query, [email, userName, password, userName]);
        res.status(200).send("Updated");
      } catch (error) {
        res.status(400).send(error);
      }
    } else {
      let query = "Select * from admin where username = ?";
      try {
        let [data, fields] = await conn.execute(query, [newUserName]);
        if (data.length === 0 || data.length === undefined) {
          let query2 =
            "UPDATE admin SET email = ? , userName = ?, password = ? WHERE admin.userName = ?";
          try {
            await conn.execute(query2, [
              email,
              newUserName,
              password,
              userName,
            ]);
            res.send("Updated");
          } catch (error) {
            res.status(400).send(error);
          }
        } else {
          res.status(400).send("Username Taken");
        }
      } catch (error) {
        res.status(400).send(error);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getStats", auth, async (req, res) => {
  let query = "Select * from section";
  let query2 = "SELECT * FROM student";
  let query3 = "SELECT * FROM subject";
  let query4 = "SELECT * FROM lecturer";
  let query5 = "SELECT * FROM datasets";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query);
    let [data2, fields2] = await conn.execute(query2);
    let [data3, fields3] = await conn.execute(query3);
    let [data4, fields4] = await conn.execute(query4);
    let [data5, fields5] = await conn.execute(query5);
    let sectionsL = data.length;
    let studentsL = data2.length;
    let subjectsL = data3.length;
    let lecturersL = data4.length;
    let dataSetsL = data5.length;
    res.send({
      sections: sectionsL,
      students: studentsL,
      subjects: subjectsL,
      lecturers: lecturersL,
      dataSets: dataSetsL,
    });
  } catch (error) {
    res.status(400).send("error fetching Admin");
  }
});

router.patch("/updateEmail", auth, async (req, res) => {
  let adminId = req.body.id;
  let newEmail = req.body.email;
  let query = "UPDATE admin SET email=? WHERE adminId = ?";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [newEmail, adminId]);
    res.send(data);
  } catch (error) {
    res.status(400).send("error fetching Admin");
  }
});

router.patch("/updatePassword", auth, async (req, res) => {
  let adminId = req.body.id;
  let newPassword = req.body.password;
  let query = "UPDATE admin SET password=? WHERE adminId = ?";
  try {
    let conn = await sql.getDBConnection();
    let [data, fields] = await conn.execute(query, [newPassword, adminId]);
    res.send(data);
  } catch (error) {
    res.status(400).send("error fetching Admin");
  }
});

//Delete Admin
router.delete("/deleteA", auth, async (req, res) => {
  let userName = req.body.userName;
  let query = "DELETE FROM admin WHERE admin.userName = ?";

  try {
    let conn = await sql.getDBConnection();
    await conn.execute(query, [userName]);
    res.status(200).send("Admin Deleted");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
