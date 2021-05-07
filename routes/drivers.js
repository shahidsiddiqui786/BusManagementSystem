const express = require('express')
const router = express.Router()
const mysql = require("mysql")

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "busmanagement",
})
  

////////////..............Driver routes......................//////////////////

router.get('/add',(req, res) => {
  // console.log("ham")
  res.render('drivers/add')
})

router.get("", (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = req.query.name
  }
  // searchOptions.name = 's'
  console.log(searchOptions.name)
  db.query("select * from driver where name LIKE ?",
    [searchOptions.name === undefined ? '%' : searchOptions.name+'%'] ,
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      //console.log(result)
      res.render('drivers/index', {
        drivers: result,
        searchOptions: req.query
      })
    }
  })
})

router.get("/:iddriver",(req,res) => {
    db.query("SELECT * FROM driver WHERE iddriver = ?", req.params.iddriver, (err, driver) => {
    //  console.log(driver)
      if(err) console.log(err)
      else {
      res.render('drivers/show',{
        driver : driver[0]
      })
      }
    })
})

router.post("/add", (req, res) => {
  const name = req.body.name   
    db.query(
    "INSERT INTO driver (name) VALUES (?)",
    [name],
      (err, result) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(result)
        res.redirect('/drivers')
      }
    })
})

router.get('/:iddriver/edit',  (req, res) => {

  db.query("SELECT * FROM driver WHERE iddriver = ?", req.params.iddriver, (err, driver) => {
    if(err){
      console.log(err)
    }
    else {
      res.render('drivers/edit',{
        driver : driver[0],
        greeting:"rewrite only those filed u want to change"
      })
    }
  })
})

router.put("/:iddriver", (req,res) => {
  const name = req.body.name
  const iddriver = req.params.iddriver
  db.query(
    "UPDATE driver SET name = ? WHERE iddriver = ?",[name,iddriver],(err,driver) => {
      if(err) console.log(err)
      else {
        console.log(driver)
        res.redirect(`/drivers/${iddriver}`)
      }
    }
  )
})

router.delete("/:iddriver", (req, res) => {
  const iddriver = req.params.iddriver;
  db.query("DELETE FROM driver WHERE iddriver = ?", iddriver, (err, result) => {
    if (err) {
      console.log(err)
      db.query("SELECT * FROM driver WHERE iddriver = ?", req.params.iddriver, (err1, driver) => {
        if(err1) console.log(err)
        else {
        res.render('drivers/show',{
          driver : driver[0],
          errorMessage:err.sqlMessage.split(":")[0]
        })
        }
      })
    } else {
      res.redirect('/drivers')
    }
  })
})

module.exports = router