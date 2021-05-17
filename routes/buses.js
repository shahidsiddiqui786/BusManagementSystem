const express = require("express");
const router = express.Router();

const db = require("../database/index");

////////////..............Bus routes......................//////////////////

router.get("/add", (req, res) => {
  fetchConductorsAndRenderAddBus(res);
});

router.get("", (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = req.query.name;
  }
  fetchBusesAndRenderIndex(res, searchOptions);
});

router.get("/:idbus", (req, res) => {
  fetchBus(req.params.idbus)
    .then((result1) => {
      fetchConductor(result1.idconductor)
        .then((result2) => {
          fetchDriver(result2.iddriver)
            .then((result3) => {
              renderBusPage(res, result1, result2, result3);
            })
            .catch((err) => {
              fetchBusesAndRenderIndex(res, "", err);
            });
        })
        .catch((err) => {
          fetchBusesAndRenderIndex(res, "", err);
        });
    })
    .catch((err) => {
      fetchBusesAndRenderIndex(res, "", err);
    });
});

router.post("/add", (req, res) => {
  const bus = [
    req.body.name,
    req.body.conductor,
    req.body.capacity,
    0,
    req.body.from,
    req.body.to,
  ];
  postBus(bus)
    .then((result) => {
      fetchBusesAndRenderIndex(res, "", "", "successfully Bus added");
    })
    .catch((err) => {
      fetchConductorsAndRenderAddBus(res, err);
    });
});

router.get("/:idbus/edit", (req, res) => {
  fetchBus(req.params.idbus)
    .then((result) => {
      fetchConductors()
        .then((result1) => {
          res.render("buses/edit", {
            bus: result,
            conductors: result1,
          });
        })
        .catch((err) => {
          fetchBusesAndRenderIndex(res, "", err);
        });
    })
    .catch((err) => {
      fetchBusesAndRenderIndex(res, "", err);
    });
});

router.put("/:idbus", (req, res) => {
  const bus = [
    req.body.name,
    req.body.capacity,
    req.body.from,
    req.body.to,
    req.body.conductor,
    req.params.idbus,
  ];
  updateBus(bus)
    .then((result) => {
      fetchBusesAndRenderIndex(res, "", "", "successfully Bus Updated!");
    })
    .catch((err) => {
      fetchBusesAndRenderIndex(res, "", err);
    });
});

router.delete("/:idbus", (req, res) => {
  deleteBus(req.params.idbus)
    .then((result) => {
      fetchBusesAndRenderIndex(
        res,
        "",
        "",
        "successfully Bus deleted from record"
      );
    })
    .catch((err) => {
      fetchBusesAndRenderIndex(res, "", err);
    });
});

////////////..............Helper functions......................//////////////////

function renderIndexPage(
  res,
  buses,
  searchOptions,
  errorMessage = "",
  greeting = ""
) {
  res.render("buses/index", {
    buses: buses,
    searchOptions: searchOptions,
    errorMessage: errorMessage,
    greeting: greeting,
  });
}

function renderBusPage(
  res,
  bus,
  conductor,
  driver,
  errorMessage = "",
  greeting = ""
) {
  res.render("buses/show", {
    bus: bus,
    conductor: conductor,
    driver: driver,
    errorMessage: errorMessage,
    greeting: greeting,
  });
}

function fetchBus(idbus) {
  const my = new Promise((resolve, reject) => {
    db.query("SELECT * FROM bus WHERE idbus = ?", idbus, (err, bus) => {
      if (err) {
        reject(err.sqlMessage);
      } else {
        resolve(bus[0]);
      }
    });
  });
  return my;
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

function fetchBuses(searchOptions = "") {
  const my = new Promise((resolve, reject) => {
    db.query(
      "select * from bus where name LIKE ?",
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

function postBus(bus) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO bus (`name`,`idconductor`,`capacity`,`reserved`,`from`,`to`) VALUES (?,?,?,?,?,?)",
      bus,
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

function updateBus(bus) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "UPDATE bus SET `name` = ?, `capacity` = ?, `from` = ?, `to` = ?, `idconductor` = ? WHERE `idbus` = ?",
      bus,
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

function deleteBus(idbus) {
  const my = new Promise((resolve, reject) => {
    db.query("DELETE FROM bus WHERE idbus = ?", idbus, (err, result) => {
      if (err) {
        reject(err.sqlMessage);
      } else {
        resolve(result);
      }
    });
  });
  return my;
}

function fetchBusesAndRenderIndex(
  res,
  searchOptions,
  errorMessage = "",
  greeting = ""
) {
  fetchBuses(searchOptions)
    .then((result) => {
      renderIndexPage(res, result, searchOptions, errorMessage, greeting);
    })
    .catch((err) => {
      renderIndexPage(res, "", searchOptions, err, "");
    });
}

function fetchConductorsAndRenderAddBus(res, errorMessage = "", greeting = "") {
  fetchConductors()
    .then((result) => {
      res.render("buses/add", {
        conductors: result,
        errorMessage: errorMessage,
        greeting: greeting,
      });
    })
    .catch((err) => {
      fetchBusesAndRenderIndex(res, "", err, "");
    });
}

module.exports = router;
