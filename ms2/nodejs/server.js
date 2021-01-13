const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require('crypto');
const dbConfig = require("./db.dev.config");
const mysql = require("mysql2");

const hashingSecret = "cheese";
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
  origin: "http://localhost:4200"
};

app.use(cors());

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

app.get("/api/movie", (req, res) => {
  let title = req.header('title');
  let release = req.header('release');
  connection.query("SELECT * FROM movies WHERE title = ? AND release_date = ?", [title, release],
  function(err, result, fields) {
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

app.get("/api/adultsales", (reg,res) => {
  let adultSales = new Object();
  connection.query("SELECT COUNT(ticket_code) onsite FROM on_site_sales WHERE email IN (SELECT email FROM users WHERE TIMESTAMPDIFF(year, birthdate, NOW()) > 18)",
  function(err, result, fields) {
    if(err) throw err;
    adultSales.onsite = result[0].onsite;
    connection.query("SELECT COUNT(ticket_code) streaming FROM stream_sales WHERE email IN (SELECT email FROM users WHERE TIMESTAMPDIFF(year, birthdate, NOW()) > 18)",
    function(err, result, fields) {
        if(err) throw err;
        adultSales.streaming = result[0].streaming;
        res.json(adultSales);
    });
  });
});

app.get("/api/onsitedxsales", (req,res) => {
  let dxSales = new Object();
  connection.query("SELECT COUNT(ticket_code) as total FROM on_site_tickets",
  function(err, result, fields) {
    if (err) throw err;
    dxSales.total = result[0].total;
    connection.query("SELECT COUNT(ticket_code) as dxsales FROM on_site_tickets WHERE screening_id IN (SELECT screening_id FROM screenings INNER JOIN movies USING (title, release_date) WHERE dx IS true)",
    function(err, result, fields) {
      if(err) throw err;
      dxSales.dxsales = result[0].dxsales;
      res.json(dxSales);
    });
  });
});

app.get("/api/validateuser", (req,res) => {
  let email = req.header('email');
  let password = req.header('password');
  let pwdHash = crypto.createHmac('sha256', hashingSecret).update(password).digest('hex');
  connection.query("SELECT email, first_name, family_name, birthdate, phone, discount FROM users WHERE email = ? AND password = ?", [email, pwdHash],
  function(err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/api/uploadcredit", (req,res) => {
  let email = req.body.email;
  let credit = req.body.credit;
  connection.query("SELECT discount FROM users WHERE email = ?", [email],
  function(err, result, fields) {
    if (err) throw err;
    let currentCredit = Number(result[0].discount) + Number(credit);
    connection.query("UPDATE users SET discount = ? WHERE email = ?", [currentCredit, email],
    function(err, result, fields) {
      if (err) throw err;
      res.json({discount: currentCredit});
    });
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});