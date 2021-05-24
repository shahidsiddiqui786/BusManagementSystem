const mysql = require("mysql");

const db = mysql.createConnection({
  user: process.env.DATABASE_USER,
  host: "remotemysql.com",
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_USER,
});

module.exports = db;
