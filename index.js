const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const dbConnection = require("./database");
const multer = require("multer");
const readXlsxFile = require("read-excel-file/node");
const { body, validationResult } = require("express-validator");
const { response } = require("express");
//const AWS = require("aws-sdk");
const { S3Client } = require("@aws-sdk/client-s3");

const multerS3 = require("multer-s3");
require("dotenv").config();

//const flash = require('req-flash');
//const session = require('express-session');
const app = express();
app.use(express.urlencoded({ extended: false }));

// Serve static files with explicit paths
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname)));

// AWS S3 CONFIGURATION

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const resumeUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "nexus-resumes",
    //acl: "public-read",
    key: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) return cb(null, true);
    cb("Error: Only PDF or DOC/DOCX files allowed!");
  },
});

// SET OUR VIEWS AND VIEW ENGINE
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//app.use(flash());
app.use("/css", express.static(__dirname + "/css"));
// APPLY COOKIE SESSION MIDDLEWARE
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 3600 * 1000, // 1hr
  })
);
//TPO module
// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.render("tpo/login");
  }
  next();
};

const ifLoggedin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/tpo/tpohome");
  }
  next();
};
// END OF CUSTOM MIDDLEWARE
// ROOT PAGE
app.get("/", function (req, res) {
  res.render("home");
});
// END OF ROOT PAGE
// REGISTER PAGE LOGIN page
app.get("/tpo/login", ifNotLoggedin, (req, res, next) => {
  dbConnection
    .promise()
    .execute("SELECT `tname` FROM `tpo` WHERE `tid`=?", [req.session.userID])
    .then(([rows]) => {
      // Check if rows array is not empty
      if (rows.length > 0) {
        // Render the page with tname
        res.render("tpo/tpohome", {
          tname: rows[0].tname,
        });
      } else {
        // Handle case where no TPO data is found
        res.status(404).send("TPO not found"); // You can also render a custom error page
      }
    })
    .catch((err) => {
      console.error("Database query error:", err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/tpo/signup", function (req, res) {
  res.render("tpo/signup");
});

app.post(
  "/tpo/signup",
  ifLoggedin,
  // post data validation(using express-validator)
  [
    body("user_email", "Invalid email address!")
      .isEmail()
      .custom((value) => {
        return dbConnection
          .promise()
          .execute("SELECT `temail` FROM `tpo` WHERE `temail`=?", [value])
          .then(([rows]) => {
            if (rows.length > 0) {
              return Promise.reject("This E-mail already in use!");
            }
            return true;
          });
      }),
    body("user_name", "TPOname is Empty!").trim().not().isEmpty(),
    body("user_pass", "The password must be of minimum length 6 characters")
      .trim()
      .isLength({ min: 6 }),
    body("collagename", "Collagename is Empty!").trim().not().isEmpty(),
  ], // end of post data validation
  (req, res, next) => {
    const validation_result = validationResult(req);
    const { user_name, user_pass, user_email, collagename } = req.body;
    // IF validation_result HAS NO ERROR
    if (validation_result.isEmpty()) {
      // password encryption (using bcryptjs)
      bcrypt
        .hash(user_pass, 12)
        .then((hash_pass) => {
          // INSERTING USER INTO DATABASE
          dbConnection
            .promise()
            .execute(
              "INSERT INTO `tpo`(`tname`,`temail`,`tpassword`,`collegename`) VALUES(?,?,?,?)",
              [user_name, user_email, hash_pass, collagename]
            )
            .then((result) => {
              me = "you add!";
              //res.render('tpo/signup',{message:me});
              res.redirect("/tpo/login");
            })
            .catch((err) => {
              // THROW INSERTING USER ERROR'S
              if (err) throw err;
            });
        })
        .catch((err) => {
          // THROW HASING ERROR'S
          if (err) throw err;
        });
    } else {
      // COLLECT ALL THE VALIDATION ERRORS
      let allErrors = validation_result.errors.map((error) => {
        return error.msg;
      });
      // REDERING login-register PAGE WITH VALIDATION ERRORS
      res.render("tpo/signup", {
        register_error: allErrors,
        old_data: req.body,
      });
    }
  }
);
// END OF REGISTER PAGE
app.post(
  "/tpo/login",
  ifLoggedin,
  [
    body("user_email").custom((value) => {
      return dbConnection
        .promise()
        .execute("SELECT `temail` FROM `tpo` WHERE `temail`=?", [value])
        .then(([rows]) => {
          if (rows.length == 1) {
            return true;
          }
          return Promise.reject("Invalid Email Address!");
        });
    }),
    body("user_pass", "Password is empty!").trim().not().isEmpty(),
  ],
  (req, res) => {
    const validation_result = validationResult(req);
    const { user_pass, user_email } = req.body;
    if (validation_result.isEmpty()) {
      dbConnection
        .promise()
        .execute("SELECT * FROM `tpo` WHERE `temail`=?", [user_email])
        .then(([rows]) => {
          bcrypt
            .compare(user_pass, rows[0].tpassword)
            .then((compare_result) => {
              if (compare_result === true) {
                req.session.isLoggedIn = true;
                req.session.userID = rows[0].tid;

                res.redirect("/tpo/tpohome");
              } else {
                res.render("tpo/login", {
                  login_errors: ["Invalid Password!"],
                });
              }
            })
            .catch((err) => {
              if (err) throw err;
            });
        })
        .catch((err) => {
          if (err) throw err;
        });
    } else {
      let allErrors = validation_result.errors.map((error) => {
        return error.msg;
      });
      // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
      res.render("tpo/login", {
        login_errors: allErrors,
      });
    }
  }
);
// END OF LOGIN PAGE
// CHANGE PASSWORD PAGE
app.get("/tpo/changepass", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `tpo` WHERE `tid`=?", [req.session.userID])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows);
        res.render("tpo/changepass", { res: rows[0], errs: [], success: [] });
      }
    });
});
app.post("/tpo/changepass", (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  dbConnection
    .promise()
    .execute("SELECT * FROM `tpo` WHERE `tid`=?", [req.session.userID])
    .then(([rows]) => {
      bcrypt.compare(oldPassword, rows[0].tpassword).then((comparresult) => {
        if (comparresult === true) {
          if (req.body.newPassword == req.body.confirmPassword) {
            bcrypt.hash(newPassword, 12).then((haspas) => {
              dbConnection.execute(
                "UPDATE tpo SET tpassword=? where tid=?",
                [haspas, req.session.userID],
                (result) => {
                  res.render("tpo/changepass", {
                    errs: [],
                    res: [],
                    success: [{ message: "Password changed successfully" }],
                  });
                }
              );
            });
          } else {
            res.render("tpo/changepass", {
              errs: [{ message: "Your new passwords don't match!" }],
              res: rows[0],
              success: [],
            });
          }
        } else {
          res.render("tpo/changepass", {
            errs: [{ message: "Your old passsword does not match!" }],
            res: rows[0],
            success: [],
          });
        }
      });
    });
});
//END CHANGE PASSWORD PAGE
//TPOHOME PAGE
app.get("/tpo/tpohome", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT `tname` FROM `tpo` WHERE `tid`=?", [req.session.userID])
    .then(([rows]) => {
      res.render("tpo/tpohome", {
        tname: rows[0].tname,
      });
    });
});
//END OF TPOHOME PAGE
//TPOVIEW DETAILS
app.get("/tpo/viewdetailst", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `tpo` WHERE `tid`=?", [req.session.userID])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows);
        res.render("tpo/viewdetailst", { res: rows[0] });
      }
    });
});
//END OF TPOVIEW DETAILS
//TPOEDIT DETAILS
app.post("/tpo/editdetailst", (req, res) => {
  const {
    tname,
    collegename,
    mobileno,
    city,
    website,
    nirf,
    nacc,
    ncte,
    aicte,
    ugc,
  } = req.body;

  // Validate each field and ensure no value is missing (null or undefined)
  const validatedData = {
    tname: tname || "", // Ensure tname is not null, use empty string if undefined
    collegename: collegename || "", // Ensure collegename is not null
    city: city || "", // Ensure city is not null
    mobileno: mobileno || "", // Ensure mobileno is not null
    website: website || "", // Ensure website is not null
    nirf: nirf || "", // Ensure nirf is not null
    nacc: nacc || "", // Ensure nacc is not null
    ncte: ncte || "", // Ensure ncte is not null
    aicte: aicte || "", // Ensure aicte is not null
    ugc: ugc || "", // Ensure ugc is not null
    userID: req.session.userID, // Use the session userID for the WHERE clause
  };

  // Execute the query with validated data
  dbConnection.execute(
    "UPDATE `tpo` SET `tname` = ?, `collegename` = ?, `city` = ?, `mobileno` = ?, `website` = ?, `nirf` = ?, `nacc` = ?, `ncte` = ?, `aicte` = ?, `ugc` = ? WHERE `tid` = ?",
    [
      validatedData.tname,
      validatedData.collegename,
      validatedData.city,
      validatedData.mobileno,
      validatedData.website,
      validatedData.nirf,
      validatedData.nacc,
      validatedData.ncte,
      validatedData.aicte,
      validatedData.ugc,
      validatedData.userID,
    ],
    (err, results) => {
      if (err) {
        console.error("Error updating details:", err);
        return res.status(500).send("Error updating details");
      }

      if (results.changedRows === 1) {
        console.log("Post Updated");
        res.redirect("/tpo/viewdetailst");
      } else {
        res.send("No changes were made");
      }
    }
  );
});

app.get("/tpo/editdetailst", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `tpo` WHERE `tid`=?", [req.session.userID])
    .then(([rows]) => {
      if (!rows || rows.length === 0) {
        res.send("Invalid user or details not found!");
      } else {
        console.log(rows);
        res.render("tpo/editdetailst", { res: rows[0] });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching user details");
    });
});

//END OF TPOEDIT DETAILS
//TPOVIEWCOMPANY DETAILS
app.get("/tpo/viewcompany", (req, res, next) => {
  //res.render("tpo/viewcompany");
  var sql = "SELECT * FROM company";
  dbConnection.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render("tpo/viewcompany", { title: "User List", userData: data });
  });
});
//END OF TPOVIEWCOMPANY DETAILS
//TPOVIEWSTUDENT DETAILS
//TPOVIEWSTUDENT DETAILS
//TPOVIEWSTUDENT DETAILS
app.get("/tpo/viewstudent", (req, res, next) => {
  // THE SQL QUERY IS UPDATED ON THE 3RD LINE:
  const sqlQuery = `
    SELECT 
      s.sid, s.sname, s.semail, s.collegename, s.age, s.city, 
      s.gender, s.smobileno, s.isverified, UPPER(s.dname) AS dname, 
      s.passingyear, s.result10, s.result12, s.avgcgpa, s.backlogs,
      s.resume_url,
      s.is_placed 
    FROM student s 
    INNER JOIN tpo t ON s.collegename = t.collegename 
    WHERE t.tid = ?
  `;

  dbConnection.query(
    sqlQuery, // Use the updated query
    [req.session.userID],
    function (err, data, fields) {
      if (err) throw err;
      res.render("tpo/viewstudent", { title: "User List", userData: data });
    }
  );
});
//END OF TPOVIEWSTUDENT DETAILS
//TPOEDIT DETAILS
app.get("/tpo/editstudent/:id", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `student` WHERE `sid`=?", [req.params.id])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows[0]);
        res.render("tpo/editstudent", { res: rows[0] });
      }
    });
});
app.post("/tpo/editstudent/", (req, res) => {
  const {
    user_id,
    sname,
    collegename,
    age,
    city,
    gender,
    smobileno,
    dname,
    passingyear,
    result10,
    result12,
    avgcgpa,
    backlogs,
    is_placed,
  } = req.body;
  console.log("updating student with ID:", user_id);
  dbConnection.execute(
    "UPDATE `student` SET sname=?,collegename=?,age=?,city=?,gender=?,smobileno=?,dname=?,passingyear=?,result10=?,result12=?,avgcgpa=?,backlogs=?,is_placed=? WHERE `sid` = ?",
    [
      sname,
      collegename,
      age,
      city,
      gender,
      smobileno,
      dname,
      passingyear,
      result10,
      result12,
      avgcgpa,
      backlogs,
      is_placed,
      user_id,
    ],
    (err, results) => {
      if (err) throw err;
      if (results.affectedRows === 1) {
        console.log("Post Updated");
        res.redirect("/tpo/viewstudent");
      }
      console.log(results);
    }
  );
});
//END OF TPOEDIT DETAILS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//TPO ADDSTUDENT
global.__basedir = __dirname;

// -> Multer Upload Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.get("/tpo/addstudent", (req, res) => {
  res.render("tpo/addstudent");
});
// -> Import Excel Data to MySQL database

async function importExcelData2MySQL(filePath) {
  try {
    const rows = await readXlsxFile(filePath);
    console.log("Excel rows read:", rows);

    // Remove header row
    const header = rows.shift();

    // Expected header columns
    const expectedHeaders = [
      "sname",
      "semail",
      "spass",
      "collegename",
      "age",
      "city",
      "gender",
      "smobileno",
      "isverified",
      "dname",
      "passingyear",
      "result10",
      "result12",
      "avgcgpa",
      "backlogs",
      "resume_url",
      "is_placed",
    ];

    // Validate column count
    if (header.length !== expectedHeaders.length) {
      throw new Error(
        `Excel column count mismatch. Expected ${expectedHeaders.length}, but got ${header.length}`
      );
    }

    // Prepare rows
    const studentRows = rows.map((row) => {
      return [
        row[0], // sname
        row[1], // semail
        row[2], // spass (already hashed in file, DO NOT rehash)
        row[3], // collegename
        row[4], // age
        row[5], // city
        row[6], // gender
        row[7], // smobileno
        row[8], // isverified
        row[9], // dname
        row[10], // passingyear
        row[11], // result10
        row[12], // result12
        row[13], // avgcgpa
        row[14], // backlogs
        row[15], // resume_url
        row[16], // is_placed
      ];
    });

    const sql = `
      INSERT INTO student 
      (sname, semail, spass, collegename, age, city, gender, smobileno, 
       isverified, dname, passingyear, result10, result12, avgcgpa, backlogs, 
       resume_url, is_placed)
      VALUES ?
    `;

    const [response] = await dbConnection.query(sql, [studentRows]);
    console.log("Data inserted successfully:", response);
  } catch (error) {
    console.error("Error during Excel import:", error);
    throw error;
  }
}
// -> Express Upload RestAPIs
app.post("/tpo/addstudent", upload.single("uploadfile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.render("tpo/addstudent", {
        message: "Please choose an Excel file!",
        status: "danger",
      });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext !== ".xls" && ext !== ".xlsx") {
      return res.render("tpo/addstudent", {
        message: "Uploaded file is not an Excel file!",
        status: "danger",
      });
    }
    console.log(
      "File uploaded:",
      path.join(__basedir, "uploads", req.file.filename)
    );
    const result = await importExcelData2MySQL(
      path.join(__basedir, "uploads", req.file.filename)
    );

    if (result === 5) {
      return res.render("tpo/addstudent", {
        message: "Excel format is incorrect. Required 15 columns.",
        status: "danger",
      });
    }

    res.render("tpo/addstudent", {
      message: "Data imported successfully!",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.render("tpo/addstudent", {
      message: "Error importing Excel file.",
      status: "danger",
    });
  }
});

//END OF TPO ADDSTUDENT
//TPO VIEW REQUEST OF COMPANY PAGE
app.get("/tpo/viewrequest", (req, res, next) => {
  dbConnection.query(
    'SELECT c.cname,j.jid,j.cid,j.place,j.salary,j.bondyears,j.jobtype,j.vacancy,j.lastdate,j.dateexam,j.dateinterview,j.college,j.department FROM jobdetail j INNER JOIN company c on j.cid=c.cid INNER JOIN tpo t on j.college=t.collegename WHERE j.request="yes" and j.accepted="no" and j.rejected="no" and t.tid=? ORDER BY j.jid DESC',
    [req.session.userID],
    function (err, data, fields) {
      if (err) throw err;
      console.log(data);
      res.render("tpo/viewrequest", { title: "User List", userData: data });
    }
  );
});
//END OF TPO VIEW REQUEST OF COMPANY PAGE
app.get("/tpo/acceptrequest/:id", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `jobdetail` WHERE `jid`=? ", [req.params.id])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows[0]);
        res.render("tpo/acceptrequest", { res: rows[0] });
      }
    });
});
app.post("/tpo/acceptrequest/:id", (req, res) => {
  const { lastdate, dateexam, dateinterview } = req.body;
  dbConnection.execute(
    "UPDATE `jobdetail` SET lastdate=?,dateexam=?,dateinterview=?,accepted=? WHERE `jid` = ?",
    [lastdate, dateexam, dateinterview, "yes", req.params.id],
    (err, results) => {
      if (err) throw err;
      if (results.changedRows === 1) {
        console.log("Post Updated");
        res.redirect("/tpo/viewrequest");
      }
    }
  );
});
app.get("/tpo/rejectrequest/:id", (req, res) => {
  var id = req.params.id;
  dbConnection.execute(
    "Update `jobdetail`set rejected=? where jid= ? ",
    ["yes", id],
    (err, results) => {
      if (err) {
        res.send("Invalid");
      } else {
        res.redirect("/tpo/viewrequest");
      }
    }
  );
});
//END OF TPO VIEW REQUEST OF COMPANY PAGE
//TPO ONCAMPUSJOB PAGE
app.get("/tpo/oncampusjob", (req, res, next) => {
  dbConnection.query(
    'SELECT c.cname,j.jid,j.cid,j.place,j.salary,j.bondyears,j.jobtype,j.vacancy,j.lastdate,j.dateexam,j.dateinterview,j.college,j.department FROM jobdetail j INNER JOIN company c on j.cid=c.cid INNER JOIN tpo t on j.college=t.collegename WHERE j.request="yes" and j.accepted="yes" and j.rejected="no" and t.tid=?',
    [req.session.userID],
    function (err, data, fields) {
      if (err) throw err;
      console.log(data);
      res.render("tpo/oncampusjob", { title: "User List", userData: data });
    }
  );
});
app.get("/tpo/editonjob/:id", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `jobdetail` WHERE `jid`=? ", [req.params.id])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows[0]);
        res.render("tpo/editonjob", { res: rows[0] });
      }
    });
});
app.post("/tpo/editonjob/:id", (req, res) => {
  const { lastdate, dateexam, dateinterview } = req.body;
  dbConnection.execute(
    "UPDATE `jobdetail` SET lastdate=?,dateexam=?,dateinterview=? WHERE `jid` = ?",
    [lastdate, dateexam, dateinterview, req.params.id],
    (err, results) => {
      if (err) throw err;
      if (results.changedRows === 1) {
        console.log("Post Updated");
        res.redirect("/tpo/oncampusjob");
      }
    }
  );
});
app.get("/tpo/removeonjob/:id", (req, res) => {
  var id = req.params.id;
  dbConnection.execute(
    "Update `jobdetail` set accepted=? where jid= ? ",
    ["no", id],
    (err, results) => {
      if (err) {
        res.send("Invalid");
      } else {
        res.redirect("/tpo/oncampusjob");
      }
    }
  );
});
app.get("/tpo/oncampapplied/:id", (req, res, next) => {
  dbConnection.query(
    "SELECT *,UPPER(dname)as dname FROM student s INNER JOIN applied a on s.sid=a.sid where a.jid=? ORDER BY a.aid desc ",
    [req.params.id],
    function (err, data, fields) {
      if (err) throw err;
      res.render("tpo/oncampapplied", { title: "User List", userData: data });
    }
  );
});
//END OF TPO ONCAMPUSJOB PAGE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Resume upload form
app.get("/student/upload", (req, res) => {
  res.render("student/upload", { message: null }); // Create views/student/upload.ejs
});
//Resume upload POST handler
//Resume upload POST handler
app.post("/student/upload", (req, res) => {
  // 1. Manually call the middleware so we can catch its specific errors
  resumeUpload.single("resume")(req, res, async function (err) {
    // 2. Handle errors from Multer/S3
    if (err) {
      console.error("Multer/S3 Error:", err);
      let message = "Error uploading file. Please try again.";

      // Check if it's the custom error from your fileFilter
      if (err === "Error: Only PDF or DOC/DOCX files allowed!") {
        message = err;
      }

      // Render the upload page again with the specific error
      return res.render("student/upload", { message: message });
    }

    // 3. Handle case where no file was selected
    if (!req.file) {
      return res.render("student/upload", {
        message: "Please select a file to upload.",
      });
    }

    // 4. If we get here, file upload was successful. Now, try the database.
    try {
      const resumeUrl = req.file.location;
      const studentId = req.session.sid; // assuming sid stored in session

      await dbConnection
        .promise()
        .execute("UPDATE student SET resume_url=? WHERE sid=?", [
          resumeUrl,
          studentId,
        ]);

      // Success! Render the success page
      res.render("student/uploadSuccess", { url: resumeUrl });
    } catch (dbErr) {
      // 5. Handle database errors
      console.error("Database Error:", dbErr);
      res.status(500).render("student/upload", {
        message:
          "File was uploaded, but we failed to save it to your profile. Please contact TPO.",
      });
    }
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//company module
// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedinc = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.render("company/login");
  }
  next();
};
const ifLoggedinc = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/company/companyhome");
  }
  next();
};
// END OF CUSTOM MIDDLEWARE
// COMPANY LOGIN AND SIGNUP PAGE
app.get("/company/login", ifNotLoggedinc, (req, res, next) => {
  dbConnection
    .promise()
    .execute("SELECT `hrname` FROM `company` WHERE `cid`=?", [
      req.session.userID,
    ])
    .then(([rows]) => {
      res.render("company/companyhome", {
        hrname: rows[0].hrname,
      });
    });
});
app.get("/company/signup", function (req, res) {
  res.render("company/signup");
});

app.post(
  "/company/signup",
  ifLoggedinc,
  // post data validation(using express-validator)
  [
    body("user_email", "Invalid email address!")
      .isEmail()
      .custom((value) => {
        return dbConnection
          .promise()
          .execute("SELECT `cemail` FROM `company` WHERE `cemail`=?", [value])
          .then(([rows]) => {
            if (rows.length > 0) {
              return Promise.reject("This E-mail already in use!");
            }
            return true;
          });
      }),
    body("user_name", "HRname is Empty!").trim().not().isEmpty(),
    body("user_pass", "The password must be of minimum length 6 characters")
      .trim()
      .isLength({ min: 6 }),
    body("companyname", "Companyname is Empty!").trim().not().isEmpty(),
  ], // end of post data validation
  (req, res, next) => {
    const validation_result = validationResult(req);
    const { user_name, user_pass, user_email, companyname } = req.body;
    // IF validation_result HAS NO ERROR
    if (validation_result.isEmpty()) {
      // password encryption (using bcryptjs)
      bcrypt
        .hash(user_pass, 12)
        .then((hash_pass) => {
          // INSERTING USER INTO DATABASE
          dbConnection
            .promise()
            .execute(
              "INSERT INTO `company`(`hrname`,`cemail`,`cpassword`,`cname`) VALUES(?,?,?,?)",
              [user_name, user_email, hash_pass, companyname]
            )
            .then((result) => {
              me = "you add!";
              // res.render('company/signup',{message:me});
              res.redirect("/company/login");
            })
            .catch((err) => {
              // THROW INSERTING USER ERROR'S
              if (err) throw err;
            });
        })
        .catch((err) => {
          // THROW HASING ERROR'S
          if (err) throw err;
        });
    } else {
      // COLLECT ALL THE VALIDATION ERRORS
      let allErrors = validation_result.errors.map((error) => {
        return error.msg;
      });
      // REDERING login-register PAGE WITH VALIDATION ERRORS
      res.render("company/signup", {
        register_error: allErrors,
        old_data: req.body,
      });
    }
  }
);
// LOGIN PAGE
app.post(
  "/company/login",
  ifLoggedin,
  [
    body("user_email").custom((value) => {
      return dbConnection
        .promise()
        .execute("SELECT `cemail` FROM `company` WHERE `cemail`=?", [value])
        .then(([rows]) => {
          if (rows.length == 1) {
            return true;
          }
          return Promise.reject("Invalid Email Address!");
        });
    }),
    body("user_pass", "Password is empty!").trim().not().isEmpty(),
  ],
  (req, res) => {
    const validation_result = validationResult(req);
    const { user_pass, user_email } = req.body;
    if (validation_result.isEmpty()) {
      dbConnection
        .promise()
        .execute("SELECT * FROM `company` WHERE `cemail`=?", [user_email])
        .then(([rows]) => {
          bcrypt
            .compare(user_pass, rows[0].cpassword)
            .then((compare_result) => {
              if (compare_result === true) {
                req.session.isLoggedIn = true;
                req.session.userID = rows[0].cid;

                res.redirect("/company/companyhome");
              } else {
                res.render("company/login", {
                  login_errors: ["Invalid Password!"],
                });
              }
            })
            .catch((err) => {
              if (err) throw err;
            });
        })
        .catch((err) => {
          if (err) throw err;
        });
    } else {
      let allErrors = validation_result.errors.map((error) => {
        return error.msg;
      });
      // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
      res.render("company/login", {
        login_errors: allErrors,
      });
    }
  }
);
// END OF COMPANY LOGIN AND SIGNUP PAGE
//COMPANY CHANGE PASSWORD
app.get("/company/changepass", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `company` WHERE `cid`=?", [req.session.userID])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows);
        res.render("company/changepass", {
          res: rows[0],
          errs: [],
          success: [],
        });
      }
    });
});
app.post("/company/changepass", (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  dbConnection
    .promise()
    .execute("SELECT * FROM `company` WHERE `cid`=?", [req.session.userID])
    .then(([rows]) => {
      bcrypt.compare(oldPassword, rows[0].cpassword).then((comparresult) => {
        if (comparresult === true) {
          if (req.body.newPassword == req.body.confirmPassword) {
            bcrypt.hash(newPassword, 12).then((haspas) => {
              dbConnection.execute(
                "UPDATE company SET cpassword=? where cid=?",
                [haspas, req.session.userID],
                (result) => {
                  res.render("company/changepass", {
                    errs: [],
                    res: [],
                    success: [{ message: "Password changed successfully" }],
                  });
                }
              );
            });
          } else {
            res.render("company/changepass", {
              errs: [{ message: "Your new passwords don't match!" }],
              res: rows[0],
              success: [],
            });
          }
        } else {
          res.render("company/changepass", {
            errs: [{ message: "Your old passsword does not match!" }],
            res: rows[0],
            success: [],
          });
        }
      });
    });
});
//END OF COMPANY CHANGE PASSWORD
//COMPANY HOME PAGE
app.get("/company/companyhome", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT `hrname` FROM `company` WHERE `cid`=?", [
      req.session.userID,
    ])
    .then(([rows]) => {
      res.render("company/companyhome", {
        hrname: rows[0].hrname,
      });
    });
});
//END OF COMPANY HOME PAGE
//COMPANY VIEWDETAILS
app.get("/company/viewdetailsc", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `company` WHERE `cid`=?", [req.session.userID])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows);
        res.render("company/viewdetailsc", { res: rows[0] });
      }
    });
});

//END OF COMPANY VIEWDETAILS
//COMPANY EDITDETAILS
app.get("/company/editdetailsc", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `company` WHERE `cid`=?", [req.session.userID])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows);
        res.render("company/editdetailsc", { res: rows[0] });
      }
    });
});
app.post("/company/editdetailsc", (req, res) => {
  const { hrname, cname, cwebsite, city, ctype, cinfo, cmobileno, empl } =
    req.body;
  dbConnection.execute(
    "UPDATE `company` SET `hrname` = ?,`cname`= ?, `cwebsite`= ?,`city`=?,`ctype`=?,`cinfo`=?,`cmobileno`=?,`empl`=? WHERE `cid` = ?",
    [
      hrname,
      cname,
      cwebsite,
      city,
      ctype,
      cinfo,
      cmobileno,
      empl,
      req.session.userID,
    ],
    (err, results) => {
      if (err) throw err;
      if (results.changedRows === 1) {
        console.log("Post Updated");
        res.redirect("/company/viewdetailsc");
      }
    }
  );
});
//END OF COMPANY EDITDETAILS
//COMPANY VIEW TPO PAGE
app.get("/company/viewtpo", (req, res, next) => {
  var sql = "SELECT * FROM tpo";
  dbConnection.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render("company/viewtpo", { title: "User List", userData: data });
  });
});
//END OF COMPANY VIEW TPO PAGE
//COMPANY VIEW STUDENT PAGE
app.get("/company/viewstudent", (req, res, next) => {
  dbConnection.query(
    "SELECT *, UPPER(dname) as dname FROM student",
    function (err, data, fields) {
      if (err) {
        console.error("Error fetching student data:", err);
        return next(err); // Ensures error handling if data fetching fails
      }
      console.log(data); // Debug to check the fetched data
      res.render("company/viewstudent", { title: "User List", userData: data });
    }
  );
});

//END OF COMPANY VIEW STUDENT PAGE
//COMPANY DIRECTJOBANNOUNCE PAGE
// COMPANY DIRECTJOBANNOUNCE PAGE
app.get("/company/jobannounce", (req, res, next) => {
  dbConnection
    .promise()
    .execute(
      "SELECT sid, sname, semail, spass, collegename, age, city, gender, smobileno, isverified, UPPER(dname) AS dname, passingyear, result10, result12, avgcgpa, backlogs FROM `student`"
    )
    .then(([rows]) => {
      if (!rows.length) {
        res.send("No records found!");
      } else {
        console.log("Fetched student data:", rows.length);
        res.render("company/jobannounce", {
          userData: rows,
          errs: [],
          success: [],
        });
      }
    })
    .catch((err) => {
      console.error("Database query error:", err.message);
      res.status(500).send("An error occurred while fetching data.");
    });
});

app.post("/company/jobannounce", (req, res) => {
  console.log("Job Post Request Body:", req.body);

  // Ensure user is logged in
  if (!req.session.userID) {
    console.error("Unauthorized: User not logged in.");
    return res.status(401).send("User not logged in.");
  }

  let department = req.body.department;

  // Convert department array to comma-separated string if needed
  if (Array.isArray(department)) {
    department = department.join(", ");
  }

  // Destructure form data
  const {
    place,
    salary,
    bondyears,
    servagree,
    jobtype,
    jobinfo,
    vacancy,
    minavgcp,
    minblog,
    lastdate,
    dateexam,
    dateinterview,
    college,
  } = req.body;

  // ✅ Validate required fields
  if (!place || !salary || !bondyears || !vacancy || !lastdate) {
    console.error("Missing required fields.");
    return res.status(400).send("All required fields must be provided.");
  }

  // Prepare values for insertion
  const params = [
    req.session.userID,
    place || null,
    salary || null,
    bondyears || null,
    servagree || null,
    jobtype || null,
    jobinfo || null,
    vacancy || null,
    minavgcp || null,
    minblog || null,
    lastdate || null,
    dateexam || null,
    dateinterview || null,
    college || null,
    department || null,
  ];

  // ✅ Corrected SQL (15 placeholders)
  const sql = `
    INSERT INTO jobdetail 
    (cid, place, salary, bondyears, servagree, jobtype, jobinfo, vacancy, 
    minavgcp, minblog, lastdate, dateexam, dateinterview, college, department)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  dbConnection
    .promise()
    .execute(sql, params)
    .then(([result]) => {
      console.log("Insert result:", result);
      if (result.affectedRows === 1) {
        console.log("✅ Job inserted successfully.");
        return dbConnection
          .promise()
          .execute(
            "SELECT sid, sname, semail, spass, collegename, age, city, gender, smobileno, isverified, UPPER(dname) AS dname, passingyear, result10, result12, avgcgpa, backlogs FROM `student`"
          );
      } else {
        throw new Error("Job insertion failed.");
      }
    })
    .then(([rows]) => {
      res.render("company/jobannounce", {
        userData: rows,
        errs: [],
        success: [{ message: "Job posted successfully!" }],
      });
    })
    .catch((err) => {
      console.error("Error during job posting:", err.message);
      res.status(500).send("An error occurred while posting the job.");
    });
});

// END OF COMPANY JOBANNOUNCE PAGE

// COMPANY VIEWJOB PAGE
app.get("/company/viewjob", (req, res, next) => {
  dbConnection.query(
    'SELECT j.jid, j.cid, j.place, j.salary, j.bondyears, j.jobtype, j.vacancy, j.lastdate, j.dateexam, j.dateinterview, j.college, j.department FROM jobdetail j INNER JOIN company c ON j.cid = c.cid WHERE c.cid = ? AND j.request = "no" AND j.accepted = "no" ORDER BY j.jid DESC',
    [req.session.userID],
    function (err, data, fields) {
      if (err) throw err;
      console.log(data);
      res.render("company/viewjob", { title: "User List", userData: data });
    }
  );
});

//END OF COMPANY VIEWJOB PAGE
//COMPANY EDITJOB PAGE
app.get("/company/editjob/:id", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `jobdetail` WHERE `jid`=? and cid=?", [
      req.params.id,
      req.session.userID,
    ])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows[0]);
        res.render("company/editjob", { res: rows[0] });
      }
    });
});
app.post("/company/editjob/:id", (req, res) => {
  const {
    place,
    salary,
    bondyears,
    servagree,
    jobtype,
    jobinfo,
    vacancy,
    minavgcp,
    minblog,
    lastdate,
    dateexam,
    dateinterview,
  } = req.body;
  dbConnection.execute(
    "UPDATE `jobdetail` SET place=?,salary=?,bondyears=?,servagree=?,jobtype=?,jobinfo=?,vacancy=?,minavgcp=?,minblog=?,lastdate=?,dateexam=?,dateinterview=? WHERE `jid` = ? and cid=?",
    [
      place,
      salary,
      bondyears,
      servagree,
      jobtype,
      jobinfo,
      vacancy,
      minavgcp,
      minblog,
      lastdate,
      dateexam,
      dateinterview,
      req.params.id,
      req.session.userID,
    ],
    (err, results) => {
      if (err) throw err;
      if (results.changedRows === 1) {
        console.log("Post Updated");
        res.redirect("/company/viewjob");
      }
    }
  );
});
app.get("/company/offcampapplied/:id", (req, res, next) => {
  dbConnection.query(
    "SELECT *,UPPER(dname)as dname FROM student s INNER JOIN applied a on s.sid=a.sid where a.jid=? ORDER BY a.aid desc",
    [req.params.id],
    function (err, data, fields) {
      if (err) throw err;
      res.render("company/offcampapplied", {
        title: "User List",
        userData: data,
      });
    }
  );
});
//END OF COMPANY EDITJOB PAGE
//COMPNAY DELETEJOB
app.get("/company/deletejob/:id", (req, res) => {
  var id = req.params.id;
  dbConnection.execute(
    "DELETE FROM `jobdetail` where jid= ? ",
    [id],
    (err, results) => {
      if (err) {
        res.send("Invalid");
      } else {
        res.redirect("/company/viewjob");
      }
    }
  );
});
//END OF COMPNAY DELETEJOB
//COMPANY REQUESTTPO PAGE
app.get("/company/requesttpo", (req, res, next) => {
  dbConnection
    .promise()
    .execute(
      "SELECT t.tid,t.tname,t.temail,t.tpassword,t.collegename,t.city,t.mobileno,t.website,t.nirf,t.nacc,t.ncte,t.aicte,t.ugc,upper(s.dname) as dname FROM `tpo` t inner join student s on t.collegename=s.collegename"
    )
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows);
        res.render("company/requesttpo", {
          userData: rows,
          errs: [],
          success: [],
        });
      }
    });
});
app.post("/company/requesttpo", (req, res) => {
  var department;
  for (department in req.body.department) {
    if (req.body.department) {
      var items = req.body.department;
      department = JSON.stringify(items).replace(/]|[[]|"/g, "");
      //console.log(items);
    }
  }
  const {
    place,
    salary,
    bondyears,
    servagree,
    jobtype,
    jobinfo,
    vacancy,
    minavgcp,
    minblog,
    college,
  } = req.body;
  console.log(req.body);
  const request = "yes";
  dbConnection
    .promise()
    .execute(
      "INSERT INTO `jobdetail`(cid,place,salary,bondyears,servagree,jobtype,jobinfo,vacancy,minavgcp,minblog,college,department,request) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        req.session.userID,
        place,
        salary,
        bondyears,
        servagree,
        jobtype,
        jobinfo,
        vacancy,
        minavgcp,
        minblog,
        college,
        department,
        request,
      ]
    )
    .then((results) => {
      console.log(results);
      if (results[0].affectedRows === 1) {
        console.log("request job");
        dbConnection
          .promise()
          .execute(
            "SELECT t.tid,t.tname,t.temail,t.tpassword,t.collegename,t.city,t.mobileno,t.website,t.nirf,t.nacc,t.ncte,t.aicte,t.ugc,upper(s.dname) as dname FROM `tpo` t inner join student s on t.collegename=s.collegename"
          )
          .then(([rows]) => {
            if (!rows) {
              res.send("invalid!");
            } else {
              console.log(rows);
              res.render("company/requesttpo", {
                userData: rows,
                errs: [],
                success: [
                  {
                    message: "Request sent to tpo for job assign successfully",
                  },
                ],
              });
            }
          });
      }
    });
});
//END OF COMPANY REQUESTTPO PAGE
//COMPANY VIEWREQUEST PAGE
app.get("/company/viewrequest", (req, res, next) => {
  dbConnection.query(
    'SELECT j.jid,j.cid,j.place,j.salary,j.bondyears,j.jobtype,j.jobinfo,j.vacancy,j.college,j.department FROM jobdetail j INNER JOIN company c on j.cid=c.cid WHERE c.cid=? and j.request="yes" and j.accepted="no" and j.rejected="no" ORDER BY j.jid DESC',
    [req.session.userID],
    function (err, data, fields) {
      if (err) throw err;
      console.log(data);
      res.render("company/viewrequest", { title: "User List", userData: data });
    }
  );
});
app.get("/company/editrequest/:id", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `jobdetail` WHERE `jid`=? and cid=?", [
      req.params.id,
      req.session.userID,
    ])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows[0]);
        res.render("company/editrequest", { res: rows[0] });
      }
    });
});
app.post("/company/editrequest/:id", (req, res) => {
  const {
    place,
    salary,
    bondyears,
    servagree,
    jobtype,
    jobinfo,
    vacancy,
    minavgcp,
    minblog,
  } = req.body;
  dbConnection.execute(
    "UPDATE `jobdetail` SET place=?,salary=?,bondyears=?,servagree=?,jobtype=?,jobinfo=?,vacancy=?,minavgcp=?,minblog=? WHERE `jid` = ? and cid=?",
    [
      place,
      salary,
      bondyears,
      servagree,
      jobtype,
      jobinfo,
      vacancy,
      minavgcp,
      minblog,
      req.params.id,
      req.session.userID,
    ],
    (err, results) => {
      if (err) throw err;
      if (results.changedRows === 1) {
        console.log("Post Updated");
        res.redirect("/company/viewrequest");
      }
    }
  );
});
app.get("/company/deleterequest/:id", (req, res) => {
  var id = req.params.id;
  dbConnection.execute(
    "DELETE FROM `jobdetail` where jid= ? ",
    [id],
    (err, results) => {
      if (err) {
        res.send("Invalid");
      } else {
        res.redirect("/company/viewrequest");
      }
    }
  );
});
//END OF COMPANY VIEWREQUEST PAGE
//COMPANY ACCEPTED REQUEST PAGE
app.get("/company/acceptedrequest", (req, res, next) => {
  dbConnection.query(
    'SELECT j.jid,j.cid,j.place,j.salary,j.bondyears,j.jobtype,j.vacancy,j.lastdate,j.dateexam,j.dateinterview,j.college,j.department FROM jobdetail j INNER JOIN company c on j.cid=c.cid WHERE c.cid=? and j.request="yes" and j.accepted="yes" and j.rejected="no"',
    [req.session.userID],
    function (err, data, fields) {
      if (err) throw err;
      console.log(data);
      res.render("company/acceptedrequest", {
        title: "User List",
        userData: data,
      });
    }
  );
});
app.get("/company/editacceptedjob/:id", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `jobdetail` WHERE `jid`=? ", [req.params.id])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows[0]);
        res.render("company/editacceptedjob", { res: rows[0] });
      }
    });
});
app.post("/company/editacceptedjob/:id", (req, res) => {
  const {
    place,
    salary,
    bondyears,
    servagree,
    jobtype,
    jobinfo,
    vacancy,
    minavgcp,
    minblog,
    lastdate,
    dateexam,
    dateinterview,
  } = req.body;
  dbConnection.execute(
    "UPDATE `jobdetail` SET place=?,salary=?,bondyears=?,servagree=?,jobtype=?,jobinfo=?,vacancy=?,minavgcp=?,minblog=?,lastdate=?,dateexam=?,dateinterview=? WHERE `jid` = ? ",
    [
      place,
      salary,
      bondyears,
      servagree,
      jobtype,
      jobinfo,
      vacancy,
      minavgcp,
      minblog,
      lastdate,
      dateexam,
      dateinterview,
      req.params.id,
    ],
    (err, results) => {
      if (err) throw err;
      if (results.changedRows === 1) {
        console.log("Post Updated");
        res.redirect("/company/acceptedrequest");
      }
    }
  );
});
app.get("/company/deleteacceptedjob/:id", (req, res) => {
  var id = req.params.id;
  dbConnection.execute(
    "DELETE FROM `jobdetail` where jid= ? ",
    [id],
    (err, results) => {
      if (err) {
        res.send("Invalid");
      } else {
        res.redirect("/company/acceptedrequest");
      }
    }
  );
});
app.get("/company/oncampapplied/:id", (req, res, next) => {
  dbConnection.query(
    "SELECT *,UPPER(dname)as dname FROM student s INNER JOIN applied a on s.sid=a.sid where a.jid=? ORDER BY a.aid DESC",
    [req.params.id],
    function (err, data, fields) {
      if (err) throw err;
      res.render("company/oncampapplied", {
        title: "User List",
        userData: data,
      });
    }
  );
});
app.get("/company/rejectedrequest", (req, res, next) => {
  dbConnection.query(
    'SELECT j.jid,j.cid,j.place,j.salary,j.bondyears,j.jobtype,j.vacancy,j.lastdate,j.dateexam,j.dateinterview,j.college,j.department FROM jobdetail j INNER JOIN company c on j.cid=c.cid WHERE c.cid=? and j.request="yes" and j.accepted="no" and j.rejected="yes" ORDER BY j.jid DESC',
    [req.session.userID],
    function (err, data, fields) {
      if (err) throw err;
      console.log(data);
      res.render("company/rejectedrequest", {
        title: "User List",
        userData: data,
      });
    }
  );
});
app.get("/company/deleterejectedjob/:id", (req, res) => {
  var id = req.params.id;
  dbConnection.execute(
    "DELETE FROM `jobdetail` where jid= ? ",
    [id],
    (err, results) => {
      if (err) {
        res.send("Invalid");
      } else {
        res.redirect("/company/rejectedrequest");
      }
    }
  );
});
//END OF COMPANY ACCEPTED REQUEST PAGE
//Student Module
const ifNotLoggedins = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.render("student/login");
  }
  next();
};

const ifLoggedins = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/student/studenthome");
  }
  next();
};
// END OF CUSTOM MIDDLEWARE
// STUDENT LOGIN SIGNUP PAGE
app.get("/student/login", ifNotLoggedins, (req, res, next) => {
  dbConnection
    .promise()
    .execute("SELECT `sname` FROM `student` WHERE `sid`=?", [
      req.session.userID,
    ])
    .then(([rows]) => {
      // Check if rows is not empty
      if (rows.length > 0) {
        // If student found, render the page with the student's name
        res.render("student/studenthome", {
          sname: rows[0].sname,
        });
      } else {
        // Handle the case where no student is found
        res.status(404).send("Student not found");
      }
    })
    .catch((err) => {
      console.error("Database query error:", err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/student/signup", function (req, res) {
  res.render("student/signup");
});
// REGISTER PAGE
app.post(
  "/student/signup",
  ifLoggedins,
  // post data validation(using express-validator)
  [
    body("user_email", "Invalid email address!")
      .isEmail()
      .custom((value) => {
        return dbConnection
          .promise()
          .execute("SELECT `semail` FROM `student` WHERE `semail`=?", [value])
          .then(([rows]) => {
            if (rows.length > 0) {
              return Promise.reject("This E-mail already in use!");
            }
            return true;
          });
      }),
    body("user_name", "Studentname is Empty!").trim().not().isEmpty(),
    body("user_pass", "The password must be of minimum length 6 characters")
      .trim()
      .isLength({ min: 6 }),
    body("collagename", "Collagename is Empty!").trim().not().isEmpty(),
  ], // end of post data validation
  (req, res, next) => {
    const validation_result = validationResult(req);
    const { user_name, user_pass, user_email, collagename } = req.body;
    // IF validation_result HAS NO ERROR
    if (validation_result.isEmpty()) {
      // password encryption (using bcryptjs)
      bcrypt
        .hash(user_pass, 12)
        .then((hash_pass) => {
          // INSERTING USER INTO DATABASE
          dbConnection
            .promise()
            .execute(
              "INSERT INTO `student`(`sname`, `semail`, `spass`, `collegename`, `isverified`) VALUES(?,?,?,?,?)",
              [user_name, user_email, hash_pass, collagename, 0]
            ) // 0 means unverified

            //dbConnection.promise().execute("INSERT INTO `academicdetail`(sid,collegename) SELECT a.sid a.collegename FROM student s INNER JOIN academicdetail a ON a.sid=s.sid ")
            .then((result) => {
              me = "you add!";
              // res.render('student/signup',{message:me});
              res.redirect("/student/login");
            })
            .catch((err) => {
              // THROW INSERTING USER ERROR'S
              if (err) throw err;
            });
        })
        .catch((err) => {
          // THROW HASING ERROR'S
          if (err) throw err;
        });
    } else {
      // COLLECT ALL THE VALIDATION ERRORS
      let allErrors = validation_result.errors.map((error) => {
        return error.msg;
      });
      // REDERING login-register PAGE WITH VALIDATION ERRORS
      res.render("student/signup", {
        register_error: allErrors,
        old_data: req.body,
      });
    }
  }
); // END OF REGISTER PAGE
// LOGIN PAGE
app.post(
  "/student/login",
  ifLoggedins,
  [
    body("user_email").custom((value) => {
      return dbConnection
        .promise()
        .execute("SELECT `semail` FROM `student` WHERE `semail`=?", [value])
        .then(([rows]) => {
          if (rows.length == 1) {
            return true;
          }
          return Promise.reject("Invalid Email Address!");
        });
    }),
    body("user_pass", "Password is empty!").trim().not().isEmpty(),
  ],
  (req, res) => {
    const validation_result = validationResult(req);
    const { user_pass, user_email } = req.body;

    if (validation_result.isEmpty()) {
      dbConnection
        .promise()
        .execute("SELECT * FROM `student` WHERE `semail`=?", [user_email])
        .then(([rows]) => {
          if (rows.length === 0) {
            return res.render("student/login", {
              login_errors: ["Email not found!"],
            });
          }

          bcrypt
            .compare(user_pass, rows[0].spass)
            .then((compare_result) => {
              if (compare_result === true) {
                // ✅ Store login session info
                req.session.isLoggedIn = true;
                req.session.userID = rows[0].sid;
                req.session.sid = rows[0].sid; // ✅ Store student ID for resume upload

                // Redirect to student home
                res.redirect("/student/studenthome");
              } else {
                res.render("student/login", {
                  login_errors: ["Invalid Password!"],
                });
              }
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send("Internal Server Error");
            });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Internal Server Error");
        });
    } else {
      let allErrors = validation_result.errors.map((error) => error.msg);
      res.render("student/login", { login_errors: allErrors });
    }
  }
);

// END OF STUDENT LOGIN SIGNUP PAGE
//STUDENT CHANGEPASSWORD PAGE
app.get("/student/changepass", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `student` WHERE `sid`=?", [req.session.userID])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows);
        res.render("student/changepass", {
          res: rows[0],
          errs: [],
          success: [],
        });
      }
    });
});
app.post("/student/changepass", (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  dbConnection
    .promise()
    .execute("SELECT * FROM `student` WHERE `sid`=?", [req.session.userID])
    .then(([rows]) => {
      bcrypt.compare(oldPassword, rows[0].spass).then((comparresult) => {
        if (comparresult === true) {
          if (req.body.newPassword == req.body.confirmPassword) {
            bcrypt.hash(newPassword, 12).then((haspas) => {
              dbConnection.execute(
                "UPDATE student SET spass=? where sid=?",
                [haspas, req.session.userID],
                (result) => {
                  res.render("student/changepass", {
                    errs: [],
                    res: [],
                    success: [{ message: "Password changed successfully" }],
                  });
                }
              );
            });
          } else {
            res.render("student/changepass", {
              errs: [{ message: "Your new passwords don't match!" }],
              res: rows[0],
              success: [],
            });
          }
        } else {
          res.render("student/changepass", {
            errs: [{ message: "Your old passsword does not match!" }],
            res: rows[0],
            success: [],
          });
        }
      });
    });
});
//END OF STUDENT CHANGEPASSWORD PAGE
//STUDENT HOME PAGE
app.get("/student/studenthome", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT `sname` FROM `student` WHERE `sid`=?", [
      req.session.userID,
    ])
    .then(([rows]) => {
      res.render("student/studenthome", {
        sname: rows[0].sname,
      });
    });
});
//END OF STUDENT HOME PAGE
//STUDENT VIEWDETAILS PAGE
app.get("/student/viewdetailss", (req, res) => {
  const sql = "SELECT * FROM student WHERE sid=?";

  dbConnection
    .promise()
    .execute(sql, [req.session.userID])
    .then(([rows]) => {
      if (rows.length === 0) {
        console.log("No student found");
        return res.send("Student not found!");
      }

      res.render("student/viewdetailss", { res: rows[0] });
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.send("Error loading details");
    });
});
//END OF STUDENT VIEWDETAILS PAGE
//STUDENT EDITDETAILS PAGE
app.get("/student/editdetailss", function (req, res) {
  dbConnection
    .promise()
    .execute("SELECT * FROM `student` WHERE `sid`=?", [req.session.userID])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows);
        res.render("student/editdetailss", { res: rows[0] });
      }
    });
});
app.post("/student/editdetailss", (req, res) => {
  const {
    sname,
    collegename,
    age,
    city,
    gender,
    smobileno,
    dname,
    passingyear,
    result10,
    result12,
    avgcgpa,
    backlogs,
    is_placed,
  } = req.body;

  const sqlQuery =
    "UPDATE `student` SET sname=?, collegename=?, age=?, city=?, gender=?, smobileno=?, dname=?, passingyear=?, result10=?, result12=?, avgcgpa=?, backlogs=?, is_placed = ? WHERE `sid` = ?";

  dbConnection.execute(
    sqlQuery,
    [
      sname,
      collegename,
      age,
      city,
      gender,
      smobileno,
      dname,
      passingyear,
      result10,
      result12,
      avgcgpa,
      backlogs,
      is_placed, // 3. ADDED 'is_placed' TO THE PARAMETERS ARRAY
      req.session.userID, // This is your existing student ID variable
    ],
    (err, results) => {
      if (err) throw err;
      if (results.changedRows === 1) {
        console.log("Post Updated, Placed Status: " + is_placed);
        res.redirect("/student/studenthome");
      } else {
        // This handles cases where "Update" was clicked but no data changed
        console.log("Post unchanged, but redirecting.", err);
      }
    }
  );
});
//END OF STUDENT EDITDETAILS PAGE
//STUDENT VIEWCOMPANY PAGE//END OF STUDENT EDITDETAILS PAGE
//STUDENT VIEWCOMPANY PAGE
app.get("/student/viewcompany", (req, res, next) => {
  var sql = "SELECT * FROM company";
  dbConnection.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render("student/viewcompany", { title: "User List", userData: data });
  });
});
//END OF STUDENT VIEWCOMPANY PAGE
//STUDENT VIEW TPO PAGE
app.get("/student/viewtpo", (req, res, next) => {
  var sql = `SELECT DISTINCT 
    t.tname, t.temail, t.mobileno, t.city, t.website, 
    t.nirf, t.nacc, t.ncte, t.aicte, t.ugc 
FROM 
    tpo t 
INNER JOIN 
    student s ON t.collegename = s.collegename 
LIMIT 1;  -- Ensures only one unique row is returned
;
`; // Corrected the spelling

  dbConnection.query(sql, [req.session.userID], function (err, data, fields) {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .send("An error occurred while retrieving TPO details.");
    }
    res.render("student/viewtpo", { title: "User List", userData: data });
  });
});

//END OF STUDENT VIEW TPO PAGE
//STUDENT VIEW OFFCAMPUS JOB
app.get("/student/offcampjob", (req, res, next) => {
  var sql =
    'SELECT c.cname,j.jid,j.cid,j.place,j.salary,j.bondyears,j.servagree,j.jobtype,j.jobinfo,j.vacancy,j.minavgcp,j.minblog,j.lastdate,j.dateexam,j.dateinterview,j.department,s.sname,s.dname FROM jobdetail j INNER JOIN student s ON j.college=s.collegename or j.college="all"  INNER JOIN company c ON j.cid=c.cid WHERE s.sid=? and j.request="no" and j.accepted="no" and j.rejected="no" ORDER BY j.jid DESC';
  dbConnection.query(sql, [req.session.userID], function (err, data, fields) {
    if (err) throw err;
    var sql1 = "select jid,cid,sid from applied where sid=?";
    var n;
    dbConnection
      .promise()
      .execute(sql1, [req.session.userID])
      .then(([rows]) => {
        //console.log(rows);
        //console.log(data)

        console.log(data);
        res.render("student/offcampjob", {
          title: "User List",
          userData: data,
        });
      });
  });
});
app.get("/student/applyjoboff/:id", (req, res) => {
  var sql =
    'SELECT c.cname,j.jid,j.cid,j.place,j.salary,j.bondyears,j.servagree,j.jobtype,j.jobinfo,j.vacancy,j.minavgcp,j.minblog,j.lastdate,j.dateexam,j.dateinterview,j.department,s.sname,s.dname FROM jobdetail j INNER JOIN student s ON j.college=s.collegename or j.college="all"  INNER JOIN company c ON j.cid=c.cid WHERE s.sid=? and j.jid=? and j.request="no" and j.accepted="no"';
  dbConnection
    .promise()
    .execute(sql, [req.session.userID, req.params.id])
    .then(([rows]) => {
      if (!rows) {
        res.send("invalid!");
      } else {
        console.log(rows[0]);
        res.render("student/applyjoboff", {
          res: rows[0],
          errs: [],
          success: [],
        });
      }
    });
});
app.post("/student/applyjoboff/:id", (req, res) => {
  const { cid, minavgcp, minblog } = req.body;
  console.log(req.body);
  var sql1 = "select jid,cid,sid from applied where sid=? and jid=?";
  dbConnection
    .promise()
    .execute(sql1, [req.session.userID, req.params.id])
    .then(([rows]) => {
      console.log(rows);
      if (rows == 0) {
        var s = "select avgcgpa,backlogs from student where sid=?";
        dbConnection
          .promise()
          .execute(s, [req.session.userID])
          .then(([rows]) => {
            console.log(rows[0]);
            if (
              (rows[0].avgcgpa >= minavgcp || minavgcp == 0) &&
              (rows[0].backlogs <= minblog || minblog == 0)
            ) {
              dbConnection.execute(
                "INSERT INTO `applied` (jid,cid,sid,iseligible) VALUES(?,?,?,?)",
                [req.params.id, cid, req.session.userID, "yes"],
                (err, results) => {
                  //if (err) throw err;
                  console.log(results);
                  if (results.affectedRows === 1) {
                    console.log("Post Updated with eligible");
                    res.redirect("/student/appliedoffjob");
                  }
                }
              );
            } else {
              dbConnection.execute(
                "INSERT INTO `applied` (jid,cid,sid,iseligible) VALUES(?,?,?,?)",
                [req.params.id, cid, req.session.userID, "no"],
                (err, results) => {
                  //if (err) throw err;
                  console.log(results);
                  if (results.affectedRows === 1) {
                    console.log("Post Updated with not eligible");
                    res.redirect("/student/appliedoffjob");
                  }
                }
              );
            }
          });
      } else {
        var sql =
          'SELECT c.cname,j.jid,j.cid,j.place,j.salary,j.bondyears,j.jobtype,j.jobinfo,j.vacancy,j.lastdate,j.dateexam,j.dateinterview,j.department,s.sname,s.dname FROM jobdetail j INNER JOIN student s ON j.college=s.collegename or j.college="all"  INNER JOIN company c ON j.cid=c.cid WHERE s.sid=? and j.jid=? and j.request="no" and j.accepted="no"';
        dbConnection
          .promise()
          .execute(sql, [req.session.userID, req.params.id])
          .then(([rows]) => {
            if (!rows) {
              res.send("invalid!");
            } else {
              console.log(rows[0]);
              res.render("student/applyjoboff", {
                res: rows[0],
                errs: [{ message: "Your already applied for job" }],
                res: rows[0],
                success: [],
              });
            }
          });
      }
    });
});
app.get("/student/appliedoffjob", (req, res, next) => {
  dbConnection.query(
    'SELECT a.aid,a.iseligible,c.cname,j.place,j.salary,j.bondyears,j.jobtype,j.jobinfo,j.vacancy,j.lastdate,j.dateexam,j.dateinterview,j.college,j.department FROM jobdetail j INNER JOIN applied a on j.jid=a.jid INNER JOIN company c on j.cid=c.cid where a.sid=? and j.request="no" and j.accepted="no" and j.rejected="no" ORDER BY a.aid DESC',
    [req.session.userID],
    function (err, data, fields) {
      if (err) throw err;
      console.log(data);
      res.render("student/appliedoffjob", {
        title: "User List",
        userData: data,
      });
    }
  );
});
//END OF STUDENT VIEW OFFCAMPUS JOB
//STUDENT VIEW ONCAMPUS JOB
app.get("/student/oncampjob", (req, res, next) => {
  const userId = req.session.userID; // Get user ID from session

  // Simplified SQL query to debug
  dbConnection.query(
    `SELECT 
    c.cname, 
    j.jid, 
    j.cid, 
    j.place, 
    j.salary, 
    j.bondyears, 
    j.servagree, 
    j.jobtype, 
    j.jobinfo, 
    j.vacancy, 
    j.minavgcp, 
    j.minblog, 
    j.lastdate, 
    j.dateexam, 
    j.dateinterview, 
    j.college, 
    j.department 
FROM 
    jobdetail j 
INNER JOIN 
    company c ON j.cid = c.cid 
INNER JOIN 
    student s ON j.college = s.collegename OR j.college = "all" 
WHERE 
    j.request = "yes" 
    AND j.accepted = "yes" 
    AND j.rejected = "no" 
ORDER BY 
    j.jid DESC 
LIMIT 0, 25;
`,
    [userId],
    function (err, data, fields) {
      if (err) {
        console.error("Error executing query:", err);
        return res
          .status(500)
          .send("An error occurred while retrieving job details.");
      }

      // Check if data is returned
      if (data.length === 0) {
        console.log("No results found for the given user ID:", userId);
        return res.render("student/oncampjob", {
          title: "User List",
          userData: [],
        }); // Render empty data
      }

      console.log("Retrieved data:", data); // Log retrieved data for debugging
      res.render("student/oncampjob", { title: "User List", userData: data });
    }
  );
});

// APPLY JOB (GET)
app.get("/student/applyjobon/:id", (req, res) => {
  const sql = `
    SELECT 
      c.cname, j.jid, j.cid, j.place, j.salary, j.bondyears, 
      j.servagree, j.jobtype, j.jobinfo, j.vacancy, j.minavgcp, 
      j.minblog, j.lastdate, j.dateexam, j.dateinterview, j.department, 
      s.sname, s.dname 
    FROM jobdetail j 
    INNER JOIN student s 
      ON j.college = s.collegename OR j.college = "all"
    INNER JOIN company c 
      ON j.cid = c.cid 
    WHERE 
      s.sid = ? 
      AND j.jid = ? 
      AND j.request = "yes" 
      AND j.accepted = "yes" 
      AND j.rejected = "no"
  `;

  dbConnection
    .promise()
    .execute(sql, [req.session.userID, req.params.id])
    .then(([rows]) => {
      if (!rows || rows.length === 0) {
        console.log("No job found or unauthorized access.");
        return res.render("student/applyjobon", {
          res: {}, // prevent crash in EJS
          errs: [
            { message: "No job found for this ID or you are not authorized." },
          ],
          success: [],
        });
      }

      console.log(rows[0]);
      res.render("student/applyjobon", {
        res: rows[0],
        errs: [],
        success: [],
      });
    })
    .catch((err) => {
      console.error("Error executing job query:", err);
      res.status(500).send("An error occurred while retrieving job details.");
    });
});

// APPLY JOB (POST)
app.post("/student/applyjobon/:id", (req, res) => {
  const { cid, minavgcp, minblog } = req.body;

  console.log(req.body);

  const checkAppliedSQL =
    "SELECT jid, cid, sid FROM applied WHERE sid = ? AND jid = ?";

  dbConnection
    .promise()
    .execute(checkAppliedSQL, [req.session.userID, req.params.id])
    .then(([rows]) => {
      if (rows.length === 0) {
        // Student has not applied yet
        const studentSQL =
          "SELECT avgcgpa, backlogs FROM student WHERE sid = ?";

        dbConnection
          .promise()
          .execute(studentSQL, [req.session.userID])
          .then(([studentRows]) => {
            const student = studentRows[0];

            if (
              (student.avgcgpa >= minavgcp || minavgcp == 0) &&
              (student.backlogs <= minblog || minblog == 0)
            ) {
              dbConnection.execute(
                "INSERT INTO applied (jid, cid, sid, iseligible) VALUES (?, ?, ?, ?)",
                [req.params.id, cid, req.session.userID, "yes"],
                (err, results) => {
                  if (err) return console.error(err);
                  if (results.affectedRows === 1) {
                    console.log("Applied: Eligible");
                    res.redirect("/student/appliedonjob");
                  }
                }
              );
            } else {
              dbConnection.execute(
                "INSERT INTO applied (jid, cid, sid, iseligible) VALUES (?, ?, ?, ?)",
                [req.params.id, cid, req.session.userID, "no"],
                (err, results) => {
                  if (err) return console.error(err);
                  if (results.affectedRows === 1) {
                    console.log("Applied: Not eligible");
                    res.redirect("/student/appliedonjob");
                  }
                }
              );
            }
          });
      } else {
        // Already applied for this job
        const sql = `
          SELECT 
            c.cname, j.jid, j.cid, j.place, j.salary, j.bondyears, j.jobtype, 
            j.jobinfo, j.vacancy, j.lastdate, j.dateexam, j.dateinterview, j.department, 
            s.sname, s.dname 
          FROM jobdetail j 
          INNER JOIN student s 
            ON j.college = s.collegename OR j.college = "all"  
          INNER JOIN company c 
            ON j.cid = c.cid 
          WHERE 
            s.sid = ? 
            AND j.jid = ? 
            AND j.request = "yes" 
            AND j.accepted = "yes" 
            AND j.rejected = "no"
        `;

        dbConnection
          .promise()
          .execute(sql, [req.session.userID, req.params.id])
          .then(([rows]) => {
            if (!rows || rows.length === 0) {
              return res.render("student/applyjobon", {
                res: {},
                errs: [{ message: "Invalid Job ID or not authorized" }],
                success: [],
              });
            }

            res.render("student/applyjobon", {
              res: rows[0],
              errs: [{ message: "You have already applied for this job" }],
              success: [],
            });
          });
      }
    })
    .catch((err) => {
      console.error("Error checking applied jobs:", err);
      res.status(500).send("Server error during job application.");
    });
});

app.get("/student/appliedonjob", (req, res, next) => {
  dbConnection.query(
    'SELECT a.aid,a.iseligible,c.cname,j.place,j.salary,j.bondyears,j.jobtype,j.jobinfo,j.vacancy,j.lastdate,j.dateexam,j.dateinterview,j.college,j.department FROM jobdetail j INNER JOIN applied a on j.jid=a.jid INNER JOIN company c on j.cid=c.cid where a.sid=? and j.request="yes" and j.accepted="yes" and j.rejected="no" ORDER BY a.aid DESC',
    [req.session.userID],
    function (err, data, fields) {
      if (err) throw err;
      console.log(data);
      res.render("student/appliedonjob", {
        title: "User List",
        userData: data,
      });
    }
  );
});
//END OF STUDENT VIEW ONCAMPUS JOB
// LOGOUT
app.get("/logout", (req, res) => {
  //session destroy
  req.session = null;
  res.redirect("/");
});
// END OF LOGOUT
//PORT OF LISTEN 8000
app.listen(8080, () => console.log("Server is Running...at 8080"));
