const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./db.config");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected to host: ${dbConfig.HOST}!`);
});

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  connection.query("SELECT * FROM movies", (err, rows) => {
    if (err) throw err;
    console.log("Data received from DB!");
    res.json(rows);
  });
  // res.json({ message: "Welcome to milestone2!" });
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});