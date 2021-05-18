const mysql = require("mysql");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "busmanagement",
});

module.exports = db;
