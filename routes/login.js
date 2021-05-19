const express = require("express");
const router = express.Router();
const db = require("../database/index");

router.get("/admin", (req, res) => {
  res.render("login/admin", {
  });
});

router.get("/logout", (req, res) => {
  res.render("index", {
    greeting: "Successfully log out from system",
  });
});


router.post("/admin", (req, res) => {
  const user = req.body.name;
  const pass = req.body.password;

  if (user === "admin" && pass === "12345") {
    console.log("passed");
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== "") {
      searchOptions.name = req.query.name;
    }
    db.query(
      "select * from bus where name LIKE ?",
      [searchOptions.name === undefined ? "%" : searchOptions.name + "%"],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.render("buses/index", {
            buses: result,
            searchOptions: req.query,
            greeting: "Successfully logged in as Admin",
          });
        }
      }
    );
  } else if (user === "admin" && pass !== "12345") {
    res.render("login/admin", {
      errorMessage: "password incorreect",
      greeting: "",
    });
  } else if (user !== "admin") {
    res.render("login/admin", {
      errorMessage: "user doesn't exist",
      greeting: "",
    });
  } else {
    res.render("login/admin", {
      errorMessage: "make sure u r authorised to this system",
      greeting: "",
    });
  }
});

module.exports = router;
