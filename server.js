var express = require("express");
var port = process.env.port || 3000;
var cors = require("cors");
var bodyParser = require("body-parser");
var Users = require("./routes/users");
var app = express();

var mongoose = require("mongoose");
const mongooseUrl = "mongodb://localhost/mongologin1";
mongoose
  .connect(
    mongooseUrl,
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongoose connnected"))
  .catch(error => console.log(error));

app.get("/", () => {
  res.json({ msg: "Test" });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/users", Users);

app.listen(port, () => {
  console.log("server started");
});
