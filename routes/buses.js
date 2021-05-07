const express = require('express')
const router = express.Router()
const mysql = require("mysql")

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "busmanagement",
})
  

////////////..............Bus routes......................//////////////////

router.get('/add',(req, res) => {
  fetchConductorsAndRenderAddBus(res)
})

router.get("", (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = req.query.name
  }
  fetchBusesAndRenderIndex(res,searchOptions) 
})

router.get("/:idbus",(req,res) => {
    
  fetchBus(req.params.idbus)
    .then((result1) => {
      fetchConductor(result1.idconductor)
        .then((result2) => {
          fetchDriver(result2.iddriver)
            .then((result3) => {
              renderBusPage(res,result1,result2,result3)
            })
            .catch((err) =>{
              fetchBusesAndRenderIndex(res,'',err)
            })
        })
        .catch((err) =>{
          fetchBusesAndRenderIndex(res,'',err)
        })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.post("/add", (req, res) => {
  const bus = [req.body.name, req.body.conductor, req.body.capacity, 0, req.body.from, req.body.to]   
  postBus(bus)
   .then((result) => {
     fetchBusesAndRenderIndex(res,'','',"successfully Bus added")
   })
   .catch((err) => {
      fetchConductorsAndRenderAddBus(res,err)
   })
})

router.get('/:idbus/edit',  (req, res) => {
  fetchBus(req.params.idbus)
   .then((result) => {
     fetchConductors('')
      .then((result1) => {
        res.render('buses/edit',{
          bus:result,
          conductors : result1
        })
      })
      .catch((err) => {
        fetchBusesAndRenderIndex(res,'',err)
      })
   })
   .catch((err) => {
     fetchBusesAndRenderIndex(res,'',err)
   })
})

router.put("/:idbus", (req,res) => {
  const name = req.body.name
  const capacity = req.body.capacity
  const from  = req.body.from
  const to  =  req.body.to
  const idconductor = req.body.conductor
  const idbus = req.params.idbus
  db.query(
    "UPDATE bus SET `name` = ?, `capacity` = ?, `from` = ?, `to` = ?, `idconductor` = ? WHERE `idbus` = ?",
    [name,capacity,from,to,idconductor,idbus],
    (err,bus) => {
      if(err){
        renderIndexPage(res,'','',err.sqlMessage,'')
      }
      else {
        res.redirect(`/buses/${idbus}`)
      }
    }
  )
})

router.delete("/:idbus", (req, res) => {
  const idbus = req.params.idbus;
  db.query("DELETE FROM bus WHERE idbus = ?", idbus, (err, result) => {
    if (err) {
      db.query("SELECT * FROM bus WHERE idbus = ?", req.params.idbus, (err1, bus) => {
          if(err1) console.log(err1)
          else {
            const idconductor = bus[0].idconductor
            db.query("SELECT * FROM conductor WHERE idconductor = ?",idconductor,(err2,conductor) => {
              if(err2) console.log(err2)
              else {
                console.log(conductor)
                const iddriver = conductor[0].iddriver
                db.query("SELECT * FROM driver WHERE iddriver = ?",iddriver,(err2,driver) => {
                  console.log(driver)
                  res.render('buses/show',{
                    bus : bus[0],
                    conductor:conductor[0],
                    driver:driver[0],
                    errorMessage : err.sqlMessage
                  })
                })
              }
            })
          }
        })
    } 
    else {
      res.render('/buses',{
        greeting : "successfully deleted"
      })
    }
  })
})

function renderIndexPage(res, buses, searchOptions, errorMessage = '',greeting = ''){
    res.render('buses/index', {
      buses : buses, 
      searchOptions: searchOptions,
      errorMessage : errorMessage,
      greeting : greeting
    })
}

function renderBusPage(res,bus,conductor,driver,errorMessage = '',greeting = ''){
  res.render('buses/show',{
    bus : bus,
    conductor:conductor,
    driver:driver,
    errorMessage:errorMessage,
    greeting:greeting
  })
}

function fetchBus(idbus){
  const my = new Promise((resolve,reject) => {
    db.query("SELECT * FROM bus WHERE idbus = ?",idbus, (err, bus) => {
      if(err) {
        reject(err.sqlMessage)
      }
      else{
        resolve(bus[0])
      }
    })
  })
  return my
}

function fetchConductor(idconductor){
  const my = new Promise((resolve,reject) => {
    db.query("SELECT * FROM conductor WHERE idconductor = ?",idconductor, (err, conductor) => {
      if(err) {
        reject(err.sqlMessage)
      }
      else{
        resolve(conductor[0])
      }
    })
  })
  return my
}

function fetchDriver(iddriver){
  const my = new Promise((resolve,reject) => {
    db.query("SELECT * FROM driver WHERE iddriver = ?",iddriver, (err, driver) => {
      if(err) {
        reject(err.sqlMessage)
      }
      else{
        resolve(driver[0])
      }
    })
  })
  return my
}

function fetchBuses(searchOptions){
  const my = new Promise((resolve,reject) => {
    db.query("select * from bus where name LIKE ?",
      [searchOptions.name === undefined ? '%' : searchOptions.name+'%'] ,
      (err, result) => {
      if (err) {
        reject(err.sqlMessage)
      } 
      else {
        resolve(result)
      }
    })
  })
  return my
}

function fetchConductors(searchOptions){
  const my = new Promise((resolve,reject) => {
    db.query("select * from conductor where name LIKE ?",
      [searchOptions.name === undefined ? '%' : searchOptions.name+'%'] ,
      (err, result) => {
      if (err) {
        reject(err.sqlMessage)
      } 
      else {
        resolve(result)
      }
    })
  })
  return my
}

function fetchDrivers(searchOptions){
  const my = new Promise((resolve,reject) => {
    db.query("select * from driver where name LIKE ?",
      [searchOptions.name === undefined ? '%' : searchOptions.name+'%'] ,
      (err, result) => {
      if (err) {
        reject(err.sqlMessage)
      } 
      else {
        resolve(result)
      }
    })
  })
  return my
}

function postBus(bus){
  const my = new Promise((resolve,reject) => {
    db.query(
    "INSERT INTO bus (`name`,`idconductor`,`capacity`,`reserved`,`from`,`to`) VALUES (?,?,?,?,?,?)",
    bus,
      (err, result) => {
      if (err) {
        reject(err.sqlMessage)
      } 
      else {
        resolve(result)
      }
    })
  })
  return my
}

function fetchBusesAndRenderIndex(res,searchOptions,errorMessage = '',greeting = ''){
  fetchBuses(searchOptions)
   .then((result) => {
      renderIndexPage(res,result,searchOptions,errorMessage,greeting)
   })
   .catch((err) => {
      renderIndexPage(res,'',searchOptions,err,'')
   })
}

function fetchConductorsAndRenderAddBus(res,errorMessage = '',greeting = ''){
  fetchConductors('')
   .then((result) => {
      res.render('buses/add', {
        conductors:result,
        errorMessage:errorMessage,
        greeting:greeting
      })
   })
   .catch((err) => {
     fetchBusesAndRenderIndex(res,'',err,'')
   })
}

module.exports = router

