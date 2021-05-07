const express = require('express')
const router = express.Router()
const mysql = require("mysql")

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "busmanagement",
})
  

////////////..............Conductor routes......................//////////////////

router.get('/add',(req, res) => {
  
  db.query("select * from driver",(err, drivers) => {
    if (err) {
      console.log(err)
    } else {
      console.log(drivers)
      res.render('conductors/add', {drivers:drivers})
    }
  })

})

router.get("", (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = req.query.name
  }
  // searchOptions.name = 's'
  console.log(searchOptions.name)
  db.query("select * from conductor where name LIKE ?",[searchOptions.name === undefined ? '%' : searchOptions.name+'%'] ,(err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      res.render('conductors/index', {
        conductors : result, 
        searchOptions: req.query
      })
    }
  })
})

router.get("/:idconductor",(req,res) => {
    db.query("SELECT * FROM conductor WHERE idconductor = ?", req.params.idconductor, (err, conductor) => {
    //  console.log(driver)
      if(err) console.log(err)
      else {
        const iddriver = conductor[0].iddriver
        db.query("SELECT * FROM driver WHERE iddriver = ?",iddriver,(err1,driver) => {
          res.render('conductors/show',{
            conductor : conductor[0],
            driver:driver[0]
          })
        })
      }
    })
})

router.post("/add", (req, res) => {
  const name = req.body.name
  const password = req.body.password
  const driver = req.body.driver   
    db.query(
    "INSERT INTO conductor (name,iddriver,password) VALUES (?,?,?)",
    [name,driver,password],
      (err, result) => {
      if (err) {
        db.query("select * from driver",(err1, drivers) => {
          res.render('conductors/add',{
            errorMessage : err.sqlMessage,
            drivers:drivers
          })
        })
      } 
      else {
        console.log(result)
        res.redirect('/conductors')
      }
    })
})

router.get('/:idconductor/edit',  (req, res) => {
  db.query("SELECT * FROM conductor WHERE idconductor = ?", req.params.idconductor, (err, conductor) => {
    if(err) console.log(err)
    else {
      db.query("SELECT * FROM driver", (err1,drivers) => {
        res.render('conductors/edit',{
          conductor : conductor[0],
          drivers : drivers
        })
      })
    }
  })
})

router.put("/:idconductor", (req,res) => {
  const name = req.body.name
  const iddriver = req.body.driver
  const idconductor = req.params.idconductor
  db.query(
    "UPDATE conductor SET name = ?, iddriver = ? WHERE idconductor = ?",[name,iddriver,idconductor],(err,conductor) => {
      if(err) console.log(err)
      else {
        console.log(conductor)
        res.redirect(`/conductors/${idconductor}`)
      }
    }
  )
})

router.delete("/:idconductor", (req, res) => {
  const idconductor = req.params.idconductor;
  db.query("DELETE FROM conductor WHERE idconductor = ?", idconductor, (err, result) => {
    if (err) {
      console.log(err)
      db.query("SELECT * FROM conductor WHERE idconductor = ?", req.params.idconductor, (err2, conductor) => {
          if(err2) console.log(err2)
          else {
            const iddriver = conductor[0].iddriver
            db.query("SELECT * FROM driver WHERE iddriver = ?",iddriver,(err1,driver) => {
              res.render('conductors/show',{
                conductor : conductor[0],
                driver:driver[0],
                errorMessage:err.sqlMessage.split(":")[0]
              })
            })
          }
        })
    } else {
      res.redirect('/conductors')
    }
  })
})

module.exports = router