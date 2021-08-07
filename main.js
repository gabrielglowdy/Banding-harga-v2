require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

let port = process.env.PORT;

// server css as static
app.use(express.static(__dirname));

// get our app to use body parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(port, () =>
  console.log("Hello World app berjalan di http://localhost:" + port)
);
