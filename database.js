const mysql = require("mysql2");

const dbConnection = mysql.createPool({
  host: "localhost", // BACK TO LOCALHOST
  user: "root",
  password: process.env.DB_PASS || "root",
  database: "placement",
  multipleStatements: true,
});

module.exports = dbConnection;
