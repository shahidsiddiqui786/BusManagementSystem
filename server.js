const express = require("express");
const app = express();

app.use(express.json());
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
require('dotenv').config()
const db = require("./database/index");

///////////////////////////////////////////////////////////////////////

db.connect(function (err) {
  if (err) {
    console.error("error connecting to database: " + err.stack);
    return;
  }
  console.log("Database connected successfully");
});



const driverRouter = require("./routes/drivers");
const condutorRouter = require("./routes/conductors");
const busRouter = require("./routes/buses");
const passangerRouter = require("./routes/passanger");
const transactRouter = require("./routes/transact");
const loginRouter = require("./routes/login");

///////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

app.use("/drivers", driverRouter);
app.use("/conductors", condutorRouter);
app.use("/buses", busRouter);
app.use("/passangers", passangerRouter);
app.use("/transacts", transactRouter);
app.use("/login", loginRouter);

app.get("/", (req, res) => {
  res.render("index");
});


app.listen(process.env.PORT || 3001, () => {
  console.log("server is running on port 3001");
});
