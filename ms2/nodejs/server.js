const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./db.prod.config");
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

// using the angular webapp
app.use(express.static(process.cwd()+"/angular/dist/my-app"));

// default route
app.get("/", (req, res) => {
  res.sendFile(process.cwd()+"/angular/dist/my-app/index.html");
});

app.get("/api/movies", (req, res) => {
  connection.query("SELECT * FROM movies", function(err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/api/onsitetickets", (req, res) => {
  email = 'mehrudin.sabani@uniwien.at';
  connection.query('SELECT * FROM  on_site_tickets INNER JOIN on_site_sales USING (ticket_code) WHERE email = ?', [email],
    function(err, result) {
      if (err) throw err;
      res.json(result);
    });
});

app.get("/api/streamtickets", (req, res) => {
  email = 'mehrudin.sabani@uniwien.at';
  connection.query('SELECT * FROM  stream_tickets INNER JOIN stream_sales USING (ticket_code) WHERE email = ?', [email],
    function(err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});