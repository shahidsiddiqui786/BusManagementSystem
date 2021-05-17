const express = require("express");
const router = express.Router();
const db = require("../database/index");

router.get("/passanger", (req, res) => {
  res.render("passangers/add", {
    auth: "",
    greeting: "Register here",
  });
});

router.get("/conductor", (req, res) => {
  db.query("select * from driver", (err, drivers) => {
    if (err) {
      res.render("index", {
        errorMessage: "can't get the page",
      });
    } else {
      res.render("conductors/add", {
        drivers: drivers,
        auth: "",
        greeting: "Register as conductor here",
      });
    }
  });
});

module.exports = router;
