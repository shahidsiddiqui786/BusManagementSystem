const express = require("express");
const router = express.Router();
const db = require("../database/index");

////////////..............Driver routes......................//////////////////

router.get("/add", (req, res) => {
  res.render("drivers/add");
});

router.get("", (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = req.query.name;
  }
  fetchDriversAndRenderIndex(res, searchOptions);
});

router.get("/:iddriver", (req, res) => {
  fetchDriver(req.params.iddriver)
    .then((result) => {
      renderDriverPage(res, result);
    })
    .catch((err) => {
      fetchDriversAndRenderIndex(res, "", err);
    });
});

router.post("/add", (req, res) => {
  postDriver(req.body.name)
    .then((result) => {
      fetchDriversAndRenderIndex(res, "", "", "successfully Driver added");
    })
    .catch((err) => {
      res.render("drivers/add");
    });
});

router.get("/:iddriver/edit", (req, res) => {
  fetchDriver(req.params.iddriver)
    .then((result) => {
      res.render("drivers/edit", {
        driver: result,
      });
    })
    .catch((err) => {
      fetchDriversAndRenderIndex(res, "", err);
    });
});

router.put("/:iddriver", (req, res) => {
  const driver = [req.body.name, req.params.iddriver];
  updateDriver(driver)
    .then((result) => {
      fetchDriversAndRenderIndex(res, "", "", "successfully Driver Updated!");
    })
    .catch((err) => {
      fetchDriversAndRenderIndex(res, "", err);
    });
});

router.delete("/:iddriver", (req, res) => {
  deleteDriver(req.params.iddriver)
    .then((result) => {
      fetchDriversAndRenderIndex(
        res,
        "",
        "",
        "successfully Driver deleted from record"
      );
    })
    .catch((err) => {
      fetchDriversAndRenderIndex(res, "", err);
    });
});

////////////..............Helper functions......................//////////////////

function renderIndexPage(
  res,
  drivers,
  searchOptions,
  errorMessage = "",
  greeting = ""
) {
  res.render("drivers/index", {
    drivers: drivers,
    searchOptions: searchOptions,
    errorMessage: errorMessage,
    greeting: greeting,
  });
}

function renderDriverPage(res, driver, errorMessage = "", greeting = "") {
  res.render("drivers/show", {
    driver: driver,
    errorMessage: errorMessage,
    greeting: greeting,
  });
}

function fetchDriver(iddriver) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM driver WHERE iddriver = ?",
      iddriver,
      (err, driver) => {
        if (err) {
          reject(err.sqlMessage);
        } else {
          resolve(driver[0]);
        }
      }
    );
  });
  return my;
}

function fetchDrivers(searchOptions = "") {
  const my = new Promise((resolve, reject) => {
    db.query(
      "select * from driver where name LIKE ?",
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

function postDriver(driver) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO driver (`name`) VALUES (?)",
      driver,
      (err, result) => {
        if (err) {
          reject(err.sqlMessage.split(":")[0]);
        } else {
          resolve(result);
        }
      }
    );
  });
  return my;
}

function updateDriver(driver) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "UPDATE driver SET `name` = ? WHERE `iddriver` = ?",
      driver,
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

function deleteDriver(iddriver) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM driver WHERE iddriver = ?",
      iddriver,
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

function fetchDriversAndRenderIndex(
  res,
  searchOptions,
  errorMessage = "",
  greeting = ""
) {
  fetchDrivers(searchOptions)
    .then((result) => {
      renderIndexPage(res, result, searchOptions, errorMessage, greeting);
    })
    .catch((err) => {
      renderIndexPage(res, "", searchOptions, err, "");
    });
}

module.exports = router;
