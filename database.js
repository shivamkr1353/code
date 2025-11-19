const mysql = require("mysql2");

const dbConnection = mysql.createPool({
  host: "localhost", // BACK TO LOCALHOST
  user: "root",
  password: "",
  database: "placement",
  multipleStatements: true,
});

module.exports = dbConnection;
