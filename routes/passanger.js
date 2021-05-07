const express = require('express')
const router = express.Router()
const mysql = require("mysql")

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "busmanagement",
})
  

////////////..............Passanger routes......................//////////////////

  router.get('/add',(req, res) => {
        res.render('passangers/add')
    })
  
  router.get("", (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
      searchOptions.name = req.query.name
    }
    
    db.query("select * from passanger where name LIKE ?",[searchOptions.name === undefined ? '%' : searchOptions.name+'%'] ,(err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.render('passangers/index', {
          passangers: result,
          searchOptions: req.query
        })
      }
    })
  })
  
  router.get("/:idpassanger",(req,res) => {
      db.query("SELECT * FROM passanger WHERE idpassanger = ?", req.params.idpassanger, (err, passanger) => {
      
        if(err) console.log(err)
        else {
        res.render('passangers/show',{
          passanger : passanger[0]
        })
        }
      })
  })
  
  router.post("/add", (req, res) => {
    const name = req.body.name
    const password = req.body.password   
      db.query(
      "INSERT INTO passanger (name,password) VALUES (?,?)",
      [name,password],
        (err, result) => {
        if (err) {
          console.log(err)
        } else {
          res.redirect('/passangers')
        }
      })
  })
  
  router.get('/:idpassanger/edit',  (req, res) => {
  
    db.query("SELECT * FROM passanger WHERE idpassanger = ?", req.params.idpassanger, (err, passanger) => {
      if(err) console.log(err)
      else {
        res.render('passangers/edit',{
          passanger : passanger[0]
        })
      }
    })
  })
  
  router.put("/:idpassanger", (req,res) => {
    const name = req.body.name
    const password = req.body.password
    const idpassanger = req.params.idpassanger
    db.query(
      "UPDATE passanger SET `name` = ?, `password` = ? WHERE idpassanger = ?",[name, password, idpassanger],(err,passanger) => {
        if(err) console.log(err)
        else {
          console.log(passanger)
          res.redirect(`/passangers/${idpassanger}`)
        }
      }
    )
  })
  
  router.delete("/:idpassanger", (req, res) => {
    const idpassanger = req.params.idpassanger;
    db.query("DELETE FROM passanger WHERE idpassanger = ?", idpassanger, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.redirect('/passangers')
      }
    })
  })  

module.exports = router