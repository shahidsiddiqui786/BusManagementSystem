const express = require('express')
const router = express.Router()
const mysql = require("mysql")
const { uuid } = require('uuidv4')

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "busmanagement",
})
  

////////////..............Transaction routes......................//////////////////

router.get('/add',(req, res) => {
   db.query("SELECT * FROM bus", (err,bus) => {
     db.query("SELECT * FROM passanger", (err1,passanger) => {
       if(err1 || err) console.log(err)
       else{
         res.render('transacts/add',{
           buses : bus,
           passangers : passanger,
           tid : uuid(),
           time : new Date().toLocaleString()
         })
       }
     })
   })
})

router.get("", (req, res) => {
  db.query("select * from transact ",(err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      res.render('transacts/index', {
        transacts : result
      })
    }
  })
})

router.get("/:idtransact",(req,res) => {
    db.query("SELECT * FROM transact WHERE idtransact = ?", req.params.idtransact, (err, transact) => {
      if(err) console.log(err)
      else {
        res.render('transacts/show',{
          transact : transact[0]
        })
      }
    })
})

router.post("/add", (req, res) => {
  const tid = req.body.tid
  const tickets = req.body.noofticket
  const idbus = req.body.bus
  const idpassanger = req.body.passanger
  
  if(tickets <= 0){
    res.redirect('/transacts/add')
  }

  db.query("SELECT * FROM bus WHERE idbus = ?", idbus, (err,bus) =>{
    if((bus[0].capacity) < tickets){
      console.log("capacity is less")
      res.redirect('/transacts/add')
    }
    else{
      let reserve = parseInt(bus[0].reserved) + parseInt(tickets)
      let cap = parseInt(bus[0].capacity) - parseInt(tickets)
      console.log(reserve)
      console.log(cap)
      console.log("booked")
      db.query("UPDATE bus SET `capacity` = ?, `reserved` = ? WHERE `idbus` = ?",
      [cap,reserve,idbus],
       (err1,result) => {
         if(err1){
           console.log(err1)
         }
         else{
           db.query("INSERT INTO transact (`tid`,`pid`,`idbus`,`ticket`) VALUES (?,?,?,?)",
           [tid,idpassanger,idbus,tickets],
           (err2,transact) => {
              if(err2){
                console.log(err2)
              }
              else{
                console.log("transaction successful")
                res.redirect('/transacts/add')
              }
           })
        }
      })
    }
  })

})


module.exports = router