const express = require("express");
const router = express.Router();
const db = require("../database/index");
const { uuid } = require("uuidv4");

////////////..............Transaction routes......................//////////////////

router.get("/add", (req, res) => {
  fetchRequireAndRenderAddTransact(res);
});

router.get("/", (req, res) => {
  fetchTransactionsAndRenderIndex(res, "");
});

router.get("/:idtransact", (req, res) => {
  fetchTransaction(req.params.idtransact)
    .then((result) => {
      renderTransactPage(res, result);
    })
    .catch((err) => {
      fetchTransactionsAndRenderIndex(res, "", err);
    });
});

router.post("/add", (req, res) => {
  const ticket = [
    req.body.tid,
    req.body.passanger,
    req.body.bus,
    req.body.noofticket,
    req.body.time,
  ];
  bookTicket(res, ticket);
});

router.post("/remove/:idtransact", (req, res) => {
  cancelTicket(res, req.params.idtransact);
});

////////////..............Helper functions......................//////////////////

function renderIndexPage(res, transacts, errorMessage = "", greeting = "") {
  res.render("transacts/index", {
    transacts: transacts,
    errorMessage: errorMessage,
    greeting: greeting,
  });
}

function renderBusIndexPage(
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

function renderTransactPage(res, transact, errorMessage = "", greeting = "") {
  res.render("transacts/show", {
    transact: transact,
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

function fetchTransaction(idtransact) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM transact WHERE idtransact = ?",
      idtransact,
      (err, transact) => {
        if (err) {
          reject(err.sqlMessage);
        } else {
          resolve(transact[0]);
        }
      }
    );
  });
  return my;
}

function fetchTransactions(searchOptions = "") {
  const my = new Promise((resolve, reject) => {
    db.query(
      "select * from transact WHERE tid LIKE ?",
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

function bookTicket(res, ticket) {
  const tt = ticket[3];
  console.log(tt);
  //check1
  if (tt <= 0) {
    fetchRequireAndRenderAddTransact(
      res,
      "ticket no must be greater than zero"
    );
    return;
  }

  //check2
  fetchBus(ticket[2])
    .then((result) => {
      if(result.capacity === 0) {
        fetchRequireAndRenderAddTransact(res, "Bus already full!");
        return;
      }
      else if (result.capacity < tt) {
        fetchRequireAndRenderAddTransact(res, "Only "+result.capacity+" tickets left!");
        return;
      } else {
        const reserve = parseInt(result.reserved) + parseInt(tt);
        const cap = parseInt(result.capacity) - parseInt(tt);
        const bus = [
          result.name,
          cap,
          reserve,
          result.from,
          result.to,
          result.idconductor,
          ticket[2],
        ];
        postTicketData(ticket)
          .then((result1) => {
            updateBus(bus)
              .then((result2) => {
                console.log("success");
                fetchPassanger(ticket[1])
                  .then((result3) => {
                    fetchPassangerTickets(ticket[1])
                      .then((result4) => {
                        renderPassangerPage(
                          res,
                          result3,
                          result4,
                          "",
                          "successfully ticket booked"
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                        renderBusIndexPage(
                          res,
                          "",
                          "",
                          "",
                          "successfully ticket booked"
                        );
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    renderBusIndexPage(
                      res,
                      "",
                      "",
                      "",
                      "successfully ticket booked"
                    );
                  });
              })
              .catch((err) => {
                console.log(err);
                renderBusIndexPage(
                  res,
                  "",
                  "",
                  "",
                  "successfully ticket booked"
                );
              });
          })
          .catch((err) => {
            renderBusIndexPage(res, "", "", err);
          });
      }
    })
    .catch((err) => {
      fetchRequireAndRenderAddTransact(res, err);
      return;
    });
}

function postTicketData(ticket) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO transact (`tid`,`pid`,`idbus`,`ticket`,`time`) VALUES (?,?,?,?,?)",
      ticket,
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
      "UPDATE bus SET `name` = ?, `capacity` = ?, `reserved` = ?, `from` = ?, `to` = ?, `idconductor` = ? WHERE `idbus` = ?",
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

function cancelTicket(res, idtransact) {
  fetchTransaction(idtransact)
    .then((result) => {
      //transact id field ko delete krna
      deleteTransact(idtransact)
        .then((result1) => {
          //bus field ko update krna
          fetchBus(result.idbus)
            .then((result2) => {
              const reserve =
                parseInt(result2.reserved) - parseInt(result.ticket);
              const cap = parseInt(result2.capacity) + parseInt(result.ticket);
              const bus = [
                result2.name,
                cap,
                reserve,
                result2.from,
                result2.to,
                result2.idconductor,
                result.idbus,
              ];
              updateBus(bus)
                .then((result4) => {
                  console.log("cancel success");
                  bookingCancelRedirect(res, result.pid);
                })
                .catch((err) => {
                  bookingCancelRedirect(res, result.pid);
                });
            })
            .catch((err) => {
              bookingCancelRedirect(res, result.pid);
            });
        })
        .catch((err) => {
          bookingCancelRedirect(res, result.pid, err);
        });
    })
    .catch((err) => {
      bookingCancelRedirect(res, result.pid, err);
    });
}

function deleteTransact(idtransact) {
  const my = new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM transact WHERE idtransact = ?",
      idtransact,
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

function bookingCancelRedirect(res, pid, err = "") {
  var msg = "successfully booking canceled";
  if (err) msg = "";
  console.log(msg);
  fetchPassanger(pid)
    .then((result) => {
      fetchPassangerTickets(pid)
        .then((result1) => {
          renderPassangerPage(res, result, result1, err, msg);
        })
        .catch((err) => {
          renderPassangerPage(res, result, "", err, msg);
        });
    })
    .catch((err) => {
      renderPassangerPage(res, "", "", err, msg);
    });
}

function fetchTransactionsAndRenderIndex(
  res,
  searchOptions,
  errorMessage = "",
  greeting = ""
) {
  fetchTransactions(searchOptions)
    .then((result) => {
      renderIndexPage(res, result, searchOptions, errorMessage, greeting);
    })
    .catch((err) => {
      renderIndexPage(res, "", searchOptions, err, "");
    });
}

function fetchBusesAndRenderIndex(
  res,
  searchOptions,
  errorMessage = "",
  greeting = ""
) {
  fetchBuses(searchOptions)
    .then((result) => {
      renderBusIndexPage(res, result, searchOptions, errorMessage, greeting);
    })
    .catch((err) => {
      renderBusIndexPage(res, "", searchOptions, err, "");
    });
}

function fetchRequireAndRenderAddTransact(
  res,
  errorMessage = "",
  greeting = ""
) {
  fetchBuses()
    .then((result) => {
      fetchPassangers()
        .then((result1) => {
          res.render("transacts/add", {
            buses: result,
            passangers: result1,
            tid: uuid(),
            time: new Date().toString(),
            errorMessage: errorMessage,
            greeting: greeting,
          });
        })
        .catch((err) => {
          fetchBusesAndRenderIndex(res, "", err);
        });
    })
    .catch((err) => {
      fetchBusesAndRenderIndex(res, "", err);
    });
}

module.exports = router;
