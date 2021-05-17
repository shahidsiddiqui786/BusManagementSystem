const express = require("express");
const router = express.Router();
const db = require("../database/index");

////////////..............Passanger routes......................//////////////////

router.get("/add", (req, res) => {
  res.render("passangers/add");
});

router.get("", (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = req.query.name;
  }
  fetchPassangersAndRenderIndex(res, searchOptions);
});

router.get("/:idpassanger", (req, res) => {
  fetchPassanger(req.params.idpassanger)
    .then((result) => {
      fetchPassangerTickets(req.params.idpassanger)
        .then((result1) => {
          renderPassangerPage(res, result, result1);
        })
        .catch((err) => {
          fetchPassangersAndRenderIndex(res, "", err);
        });
    })
    .catch((err) => {
      fetchPassangersAndRenderIndex(res, "", err);
    });
});

router.post("/add", (req, res) => {
  postPassanger(req.body.name)
    .then((result) => {
      fetchPassangersAndRenderIndex(
        res,
        "",
        "",
        "successfully Passanger added"
      );
    })
    .catch((err) => {
      res.render("passangers/add");
    });
});

router.get("/:idpassanger/edit", (req, res) => {
  fetchPassanger(req.params.idpassanger)
    .then((result) => {
      res.render("passangers/edit", {
        passanger: result,
      });
    })
    .catch((err) => {
      fetchPassangersAndRenderIndex(res, "", err);
    });
});

router.put("/:idpassanger", (req, res) => {
  const passanger = [req.body.name, req.params.idpassanger];
  updatePassanger(passanger)
    .then((result) => {
      fetchPassangersAndRenderIndex(
        res,
        "",
        "",
        "successfully Passanger Updated!"
      );
    })
    .catch((err) => {
      fetchPassangersAndRenderIndex(res, "", err);
    });
});

router.delete("/:idpassanger", (req, res) => {
  deletePassanger(req.params.idpassanger)
    .then((result) => {
      fetchPassangersAndRenderIndex(
        res,
        "",
        "",
        "successfully passanger deleted from record"
      );
    })
    .catch((err) => {
      fetchPassangersAndRenderIndex(res, "", err);
    });
});

////////////..............Helper functions......................//////////////////

function renderIndexPage(
  res,
  passangers,
  searchOptions,
  errorMessage = "",
  greeting = ""
) {
  res.render("passangers/index", {
    passangers: passangers,
    searchOptions: searchOptions,
    errorMessage: errorMessage,
    greeting: greeting,
  });
}

function renderPassangerPage(
  res,
  passanger,
  tickets,
  errorMessage = "",
  greeting = ""
) {
  res.render("passangers/show", {
    passanger: passanger,
    tickets: tickets,
    errorMessage: errorMessage,
    greeting: greeting,
  });
}

function fetchPassanger(idpassanger) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM passanger WHERE idpassanger = ?",
      idpassanger,
      (err, passanger) => {
        if (err) {
          reject(err.sqlMessage);
        } else {
          resolve(passanger[0]);
        }
      }
    );
  });
  return my;
}

function fetchPassangers(searchOptions = "") {
  const my = new Promise((resolve, reject) => {
    db.query(
      "select * from passanger where name LIKE ?",
      [searchOptions.name === undefined ? "%" : searchOptions.name + "%"],
      (err, result) => {
        if (err) {
          reject(err.sqlMessage);
        } else {
          resolve(result);
        }
      }
    );
  });
  return my;
}

function fetchPassangerTickets(idpassanger) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM transact WHERE pid = ?",
      idpassanger,
      (err, passanger) => {
        if (err) {
          reject(err.sqlMessage);
        } else {
          resolve(passanger);
        }
      }
    );
  });
  return my;
}

function postPassanger(passanger) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO passanger (`name`) VALUES (?)",
      passanger,
      (err, result) => {
        if (err) {
          reject(err.sqlMessage);
        } else {
          resolve(result);
        }
      }
    );
  });
  return my;
}

function updatePassanger(passanger) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "UPDATE passanger SET `name` = ? WHERE `idpassanger` = ?",
      passanger,
      (err, result) => {
        if (err) {
          reject(err.sqlMessage);
        } else {
          resolve(result);
        }
      }
    );
  });
  return my;
}

function deletePassanger(idpassanger) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM passanger WHERE idpassanger = ?",
      idpassanger,
      (err, result) => {
        if (err) {
          reject(err.sqlMessage);
        } else {
          resolve(result);
        }
      }
    );
  });
  return my;
}

function fetchPassangersAndRenderIndex(
  res,
  searchOptions,
  errorMessage = "",
  greeting = ""
) {
  fetchPassangers(searchOptions)
    .then((result) => {
      renderIndexPage(res, result, searchOptions, errorMessage, greeting);
    })
    .catch((err) => {
      renderIndexPage(res, "", searchOptions, err, "");
    });
}

module.exports = router;
