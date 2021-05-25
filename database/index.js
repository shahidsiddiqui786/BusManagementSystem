const mysql = require("mysql");

const db = mysql.createConnection({
  user: process.env.DATABASE_USER,
  host: "remotemysql.com",
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_USER,
});

setInterval(function () {
  db.query('SELECT 1');
  console.log("Database alive");
}, 5000);


module.exports = db;
