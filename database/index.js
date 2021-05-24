const mysql = require("mysql");

const db = mysql.createConnection({
  user: "GAxffOi9al",
  host: "remotemysql.com:3306",
  password: "H5FFDlMIhr",
  database: "busmanagement",
});

module.exports = db;
