var express = require("express");
var app = express();
var http = require("http");
var bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./DBconfig");
const user = require("./Apis/UserApis");
require("dotenv").config();

const port = process.env.PORT || 5000;
const server = http.createServer(app);
connection();
app.use(cors());
app.use(express.json());
app.get("/test", (req, res) => {
  res.send("APIs runs successfully !!");
});
app.use("/user", user);

server.listen(port, function () {
  console.log("listen to server .....", port);
});
