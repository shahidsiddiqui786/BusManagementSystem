const express = require('express')
const router = express.Router()
const mysql = require("mysql")

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "busmanagement",
})

router.get('/admin',(req,res) =>{
    res.render('login/admin',{
      errorMessage : '',
      greeting :''
    })
})

router.get('/passanger',(req,res) =>{
    res.render('login/passanger')
})

router.get('/conductor',(req,res) =>{
    res.render('login/conductor')
})

router.post('/admin',(req,res) => {
    const user = req.body.name
    const pass = req.body.password
 
    if(user === 'admin' && pass === '12345'){
      console.log("passed")
      let searchOptions = {}
      if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = req.query.name
      }
      db.query("select * from bus where name LIKE ?",[searchOptions.name === undefined ? '%' : searchOptions.name+'%'] ,(err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log(result)
          res.render('buses/index', {
            buses : result, 
            searchOptions: req.query,
            greeting :'Successfully logged in as Admin'
          })
        }
      })
    }
    else if(user === 'admin' && pass !== '12345'){
      res.render('login/admin',{
        errorMessage : 'password incorreect',
        greeting :''
      })
    }
    else if(user !== 'admin'){
      res.render('login/admin',{
        errorMessage : 'user doesn\'t exist',
        greeting :''
      }) 
    }
    else{
      res.render('login/admin',{
        errorMessage : 'make sure u r authorised to this system',
        greeting :''
      })
    }
 })

//  router.post('/passanger',(req,res) => {
//   const user = req.body.name
//   const pass = req.body.password
//   let flag =  false
  
//   db.query("SELECT * FROM passanger", (err, passangers) => {    
//     if(err) console.log(err)
//     else {
//       passangers.forEach(account => {
//         if(user === account.name && account.password === pass){
//           res.render('register/home', {
//             greeting : `successfully logged in as ${user}`,
//             authType : 'passanger',
//             authid : account.idpassanger
//           })
//           flag = true
//         }
//       })
//       if(!flag){
//         res.redirect('/login/passanger')
//       }
//     }
//   })  
//   console.log("not so")
// })

// router.post('/conductor',(req,res) => {
//   const user = req.body.name
//   const pass = req.body.password

//   if(user === 'admin' && pass === '12345'){
//     console.log("passed")
//     res.render('drivers/add',{
//        greeting :'Successfully logged in as Admin'
//     })
//   }
//   else if(user === 'admin' && pass !== '12345'){
//     res.render('login/admin',{
//       errorMessage : 'password incorreect',
//       greeting :''
//     })
//   }
//   else if(user !== 'admin'){
//     res.render('login/admin',{
//       errorMessage : 'user doesn\'t exist',
//       greeting :''
//     }) 
//   }
//   else{
//     res.render('login/admin',{
//       errorMessage : 'make sure u r authorised to this system',
//       greeting :''
//     })
//   }
// })

module.exports = router