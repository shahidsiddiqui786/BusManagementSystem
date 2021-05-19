const express = require("express");
const router = express.Router();

const db = require("../database/index");

////////////..............Conductor routes......................//////////////////

router.get("/add", (req, res) => {
  fetchDriversAndRenderAddConductor(res);
});

router.get("", (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = req.query.name;
  }
  fetchConductorsAndRenderIndex(res, searchOptions);
});

router.get("/:idconductor", (req, res) => {
  fetchConductor(req.params.idconductor)
    .then((result) => {
      fetchDriver(result.iddriver)
        .then((result1) => {
          renderConductorPage(res, result, result1);
        })
        .catch((err) => {
          fetchConductorsAndRenderIndex(res, "", err);
        });
    })
    .catch((err) => {
      fetchConductorsAndRenderIndex(res, "", err);
    });
});

router.post("/add", (req, res) => {
  const conductor = [req.body.name, req.body.driver];
  postConductor(conductor)
    .then((result) => {
      fetchConductorsAndRenderIndex(
        res,
        "",
        "",
        "successfully conductor added"
      );
    })
    .catch((err) => {
      fetchDriversAndRenderAddConductor(res, err);
    });
});

router.get("/:idconductor/edit", (req, res) => {
  fetchConductor(req.params.idconductor)
    .then((result) => {
      fetchDrivers()
        .then((result1) => {
          res.render("conductors/edit", {
            conductor: result,
            drivers: result1,
          });
        })
        .catch((err) => {
          fetchConductorsAndRenderIndex(res, "", err);
        });
    })
    .catch((err) => {
      fetchConductorsAndRenderIndex(res, "", err);
    });
});

router.put("/:idconductor", (req, res) => {
  const conductor = [req.body.name, req.body.driver, req.params.idconductor];
  updateConductor(conductor)
    .then((result) => {
      fetchConductorsAndRenderIndex(
        res,
        "",
        "",
        "successfully Conductor Updated!"
      );
    })
    .catch((err) => {
      fetchConductorsAndRenderIndex(res, "", err);
    });
});

router.delete("/:idconductor", (req, res) => {
  deleteConductor(req.params.idconductor)
    .then((result) => {
      fetchConductorsAndRenderIndex(
        res,
        "",
        "",
        "successfully Conductor deleted from record"
      );
    })
    .catch((err) => {
      fetchConductorsAndRenderIndex(res, "", err);
    });
});

////////////..............Helper functions......................//////////////////

function renderIndexPage(
  res,
  conductors,
  searchOptions,
  errorMessage = "",
  greeting = ""
) {
  res.render("conductors/index", {
    conductors: conductors,
    searchOptions: searchOptions,
    errorMessage: errorMessage,
    greeting: greeting,
  });
}

function renderConductorPage(
  res,
  conductor,
  driver,
  errorMessage = "",
  greeting = ""
) {
  res.render("conductors/show", {
    conductor: conductor,
    driver: driver,
    errorMessage: errorMessage,
    greeting: greeting,
  });
}

function fetchConductor(idconductor) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM conductor WHERE idconductor = ?",
      idconductor,
      (err, conductor) => {
        if (err) {
          reject(err.sqlMessage);
        } else {
          resolve(conductor[0]);
        }
      }
    );
  });
  return my;
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

function fetchConductors(searchOptions = "") {
  const my = new Promise((resolve, reject) => {
    db.query(
      "select * from conductor where name LIKE ?",
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

function postConductor(conductor) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO conductor (`name`,`iddriver`) VALUES (?,?)",
      conductor,
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

function updateConductor(conductor) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "UPDATE conductor SET `name` = ?, `iddriver` = ? WHERE `idconductor` = ?",
      conductor,
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

function deleteConductor(idconductor) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM conductor WHERE idconductor = ?",
      idconductor,
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

function fetchConductorsAndRenderIndex(
  res,
  searchOptions,
  errorMessage = "",
  greeting = ""
) {
  fetchConductors(searchOptions)
    .then((result) => {
      renderIndexPage(res, result, searchOptions, errorMessage, greeting);
    })
    .catch((err) => {
      renderIndexPage(res, "", searchOptions, err, "");
    });
}

function fetchDriversAndRenderAddConductor(
  res,
  errorMessage = "",
  greeting = ""
) {
  fetchDrivers()
    .then((result) => {
      res.render("conductors/add", {
        drivers: result,
        errorMessage: errorMessage,
        greeting: greeting,
      });
    })
    .catch((err) => {
      fetchConductorsAndRenderIndex(res, "", err, "");
    });
}

module.exports = router;
