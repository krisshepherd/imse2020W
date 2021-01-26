const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require('crypto');

const mysqlConfig = require("./dbconfigs/mysql.prod.config");
const mongoConfig = require("./dbconfigs/mongo.prod.config");
const mysql = require("mysql2");
const mongoClient = require("mongodb").MongoClient;

// global variables
const hashingSecret = "cheese";
const onsiteTicketPrice = 14;
const streamTicketPrice = 10;
var userToken = {};
const DBEnum = {
  MySQL: 1,
  MongoDB: 2
}
var activeDB = DBEnum.MySQL;

// MongoDB connection details
const url = `mongodb://${mongoConfig.USER}:${mongoConfig.PASSWORD}@${mongoConfig.HOST}/?authSource=admin`;
// MySQL connection details
const mysqlConnection = mysql.createConnection({
  host: mysqlConfig.HOST,
  user: mysqlConfig.USER,
  password: mysqlConfig.PASSWORD,
  database: mysqlConfig.DB
});
// making DB connections
mysqlConnection.connect((err) => {
  if (err) throw err;
  console.log(`Connected to host: ${mysqlConfig.HOST}!`);
  mongoClient.connect(url, function(err, client){
    if (err) throw err;
    console.log(`Connected to host: ${mongoConfig.HOST}!`);
    client.close();
  });
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
  connectToMySQL();
  res.sendFile(process.cwd()+"/angular/dist/my-app/index.html");
});

app.get("/api/movies", (req, res) => {
  switch(activeDB){
    case DBEnum.MySQL:
      mysqlConnection.query("SELECT * FROM movies", function(err, result, fields) {
        if (err) throw err;
        res.json(result);
      });
      break;
    case DBEnum.MongoDB:
      // here comes the mongo code
      break;
    default:
      console.error("Active Database error!");
  }
});

app.get("/api/movie", (req, res) => {
  let title = req.header('title');
  let release = req.header('release');
  mysqlConnection.query("SELECT * FROM movies WHERE title = ? AND release_date = ?", [title, release],
  function(err, result, fields) {
    if (err) throw err;
    res.json(result[0]);
  });
});

app.get("/api/onsitetickets", (req, res) => {
  if(userToken.value == req.header('token')){
    let email = userToken.email;
    mysqlConnection.query('SELECT * FROM  on_site_tickets INNER JOIN on_site_sales USING (ticket_code) WHERE email = ?', [email],
    function(err, result) {
      if (err) throw err;
      res.json(result);
    });
  }
});

app.get("/api/streamtickets", (req, res) => {
  if(userToken.value == req.header('token')){
    let email = userToken.email;
    mysqlConnection.query('SELECT * FROM  stream_tickets INNER JOIN stream_sales USING (ticket_code) WHERE email = ?', [email],
    function(err, result) {
      if (err) throw err;
      res.json(result);
    });
  }  
});

app.get("/api/adultsales", (reg,res) => {
  let adultSales = new Object();
  mysqlConnection.query("SELECT COUNT(ticket_code) onsite FROM on_site_sales WHERE email IN (SELECT email FROM users WHERE TIMESTAMPDIFF(year, birthdate, NOW()) > 18)",
  function(err, result, fields) {
    if(err) throw err;
    adultSales.onsite = result[0].onsite;
    mysqlConnection.query("SELECT COUNT(ticket_code) streaming FROM stream_sales WHERE email IN (SELECT email FROM users WHERE TIMESTAMPDIFF(year, birthdate, NOW()) > 18)",
    function(err, result, fields) {
        if(err) throw err;
        adultSales.streaming = result[0].streaming;
        res.json(adultSales);
    });
  });
});

app.get("/api/onsitedxsales", (req,res) => {
  let dxSales = new Object();
  mysqlConnection.query("SELECT COUNT(ticket_code) as total FROM on_site_tickets",
  function(err, result, fields) {
    if (err) throw err;
    dxSales.total = result[0].total;
    mysqlConnection.query("SELECT COUNT(ticket_code) as dxsales FROM on_site_tickets WHERE screening_id IN (SELECT screening_id FROM screenings INNER JOIN movies USING (title, release_date) WHERE dx IS true)",
    function(err, result, fields) {
      if(err) throw err;
      dxSales.dxsales = result[0].dxsales;
      res.json(dxSales);
    });
  });
});

app.get("/api/screenings", (req,res) => {
  let title = req.header('title');
  let release = req.header('release');
  mysqlConnection.query("SELECT * FROM screenings WHERE title = ? AND release_date = ?", [title, release],
  function(err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/api/validateuser", (req,res) => {
  userToken = {};
  let email = req.header('email');
  let password = req.header('password');
  let pwdHash = crypto.createHmac('sha256', hashingSecret).update(password).digest('hex');
  mysqlConnection.query("SELECT password FROM users WHERE email = ?", [email],
  function(err, result, fields) {
    if (err) throw err;
    if (result[0].password == pwdHash){
      console.log("User authentication successful");
      userToken.email = email;
      crypto.randomBytes(48, function(err, buffer) {
        userToken.value = buffer.toString('hex');
        res.json(userToken.value);
      });
    } else console.log('User authentication failed');
  });
});

app.get("/api/user", (req,res) => {
  if(userToken.value == req.header('token')){
    let email = userToken.email;
    mysqlConnection.query("SELECT email, first_name, family_name, birthdate, phone, discount FROM users WHERE email = ?", [email],
    function(err, result, fields) {
      if (err) throw err;
      res.json(result[0]);
    });
  }
});

app.put("/api/uploadcredit", (req,res) => {
  let email = req.body.email;
  let credit = req.body.credit;
  mysqlConnection.query("SELECT discount FROM users WHERE email = ?", [email],
  function(err, result, fields) {
    if (err) throw err;
    let currentCredit = Number(result[0].discount) + Number(credit);
    mysqlConnection.query("UPDATE users SET discount = ? WHERE email = ?", [currentCredit, email],
    function(err, result, fields) {
      if (err) throw err;
      res.send();
    });
  });
});

app.post("/api/refund", (req,res) => {
  let code = req.body.code;
  mysqlConnection.query("SELECT email, price FROM on_site_sales INNER JOIN on_site_tickets USING (ticket_code) WHERE ticket_code = ?", [code],
  function(err, result, fields) {
    if (err) throw err;
    let email = result[0].email;
    let price = result[0].price;
    mysqlConnection.query("DELETE FROM on_site_tickets WHERE ticket_code = ?", [code],
    function(err, result, fields) {
      if (err) throw err;
      mysqlConnection.query("SELECT discount FROM users WHERE email = ?", [email],
      function(err, result, fields) {
        if (err) throw err;
        let currentCredit = Number(result[0].discount) + Number(price);
        mysqlConnection.query("UPDATE users SET discount = ? WHERE email = ?", [currentCredit, email],
        function(err, result, fields) {
          if (err) throw err;
          res.send();
        });
      });
    });
  });
});

app.post("/api/buyOnsiteTicket", (req,res) => {
  if(userToken.value == req.body.token){
    let email = userToken.email;
    let screening = req.body.screening;
    let row = req.body.row;
    let seat = req.body.seat;
    mysqlConnection.query("SELECT discount FROM users WHERE email = ?", [email],
    function(err, result, fields) {
      if (err) throw err;
      if (result[0].discount < onsiteTicketPrice){
        res.status(403).send("Insuffucient funds");
      } else {
        let currentCredit = result[0].discount;
        crypto.randomBytes(6, function(err, buffer) {
          code = buffer.toString('hex');
          mysqlConnection.query("INSERT INTO on_site_tickets (ticket_code, refund_date, price, screening_id, seat_row, seat_col, cinema_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [code, screening.starttime.slice(0,10), onsiteTicketPrice, screening.screening_id, row, seat, screening.cinema_id],
          function(err, result, fields) {
            if (err) throw err;
            mysqlConnection.query("INSERT INTO on_site_sales (ticket_code, email) VALUES (?, ?)",
            [code, email],
            function(err, result, fields) {
              if (err) throw err;
              currentCredit = Number(currentCredit) - Number(onsiteTicketPrice);
              mysqlConnection.query("UPDATE users SET discount = ? WHERE email = ?", [currentCredit, email],
              function(err, result, fields) {
                if (err) throw err;
                res.send();
              });
            });
          });
        });
      }
    });
  }
});

app.post("/api/buyStreamTicket", (req,res) => {
  if(userToken.value == req.body.token){
    let email = userToken.email;
    let screening = req.body.screening;
    mysqlConnection.query("SELECT discount FROM users WHERE email = ?", [email],
    function(err, result, fields) {
      if (err) throw err;
      if (result[0].discount < streamTicketPrice){
        res.status(403).send("Insuffucient funds");
      } else {
        let currentCredit = result[0].discount;
        crypto.randomBytes(6, function(err, buffer) {
          code = buffer.toString('hex');
          mysqlConnection.query("INSERT INTO stream_tickets (ticket_code, price, screening_id) VALUES (?, ?, ?)",
          [code, streamTicketPrice, screening.screening_id],
          function(err, result, fields) {
            if (err) throw err;
            mysqlConnection.query("INSERT INTO stream_sales (ticket_code, email) VALUES (?, ?)",
            [code, email],
            function(err, result, fields) {
              if (err) throw err;
              currentCredit = Number(currentCredit) - Number(streamTicketPrice);
              mysqlConnection.query("UPDATE users SET discount = ? WHERE email = ?", [currentCredit, email],
              function(err, result, fields) {
                if (err) throw err;
                res.send();
              });
            });
          });
        });
      }
    });
  }
});

app.get("/api/migrateDB", (req,res) => {
  // wipe mongo clean
  mongoClient.connect(url, function(err, client){
    if (err) throw err;
    const db = client.db(mongoConfig.DB);
    db.dropDatabase(mongoConfig.DB);
    client.close();
  });

  // cinemas collection
  mysqlConnection.query("SELECT * FROM cinema", function(err, result) {
    if (err) throw err;
    let cinemas = result;
    mongoClient.connect(url, function(err, client){
      if (err) throw err;
      const db = client.db(mongoConfig.DB);
      db.collection('cinemas').insertMany(cinemas).then(()=> {
        mysqlConnection.query("SELECT * FROM seats", function(err, result) {
          if (err) throw err;
          let seats = result;
          mongoClient.connect(url, function(err, client){
            if (err) throw err;
            const db = client.db(mongoConfig.DB);
            seats.forEach(seat => {
              let mongoSeat = {
                row: seat.seat_row,
                col: seat.seat_col,
                weightlimit: seat.weightlimit,
                dx: seat.dx
              }
              db.collection('cinemas').updateOne(
                { cinema_id: seat.cinema_id},
                { $push: { seats: mongoSeat }});
            });
            client.close();
          });
        });
      });
      client.close();
    });
  });
  
  // movies collection
  mysqlConnection.query("SELECT * FROM movies", function(err, result) {
    if (err) throw err;
    mongoClient.connect(url, function(err, client){
      if (err) throw err;
      const db = client.db(mongoConfig.DB);
      db.collection('movies').insertMany(result).then(()=> {
        mysqlConnection.query("SELECT * FROM screenings", function(err, result) {
          if (err) throw err;
          let screenings = result;
          mongoClient.connect(url, function(err, client){
            if (err) throw err;
            const db = client.db(mongoConfig.DB);
            screenings.forEach(screening => {
              let mongoScreening = {
                cinema_id: screening.cinema_id,
                starttime: screening.starttime
              }
              db.collection('movies').updateOne(
                { title: screening.title, release_date: screening.release_date },
                { $push: { screenings: mongoScreening }});
            });
            client.close();
          });
        });
      });
      client.close();
    });
  });

  // tickets collection
  mysqlConnection.query("SELECT * FROM on_site_tickets", function(err, result) {
    if (err) throw err;
    let onSiteTickets = result;
    mysqlConnection.query("SELECT * FROM stream_tickets", function(err, result) {
      if (err) throw err;
      let streamTickets = result;
      mongoClient.connect(url, function(err, client){
        if (err) throw err;
        const db = client.db(mongoConfig.DB);
        let tickets = {
          on_site_tickets: onSiteTickets,
          stream_tickets: streamTickets
        }
        db.collection('tickets').insertOne(tickets);
        client.close();
      });
    });
  });

  // users collection
  mysqlConnection.query("SELECT * FROM users", function(err, result) {
    if (err) throw err;
    mongoClient.connect(url, function(err, client){
      if (err) throw err;
      const db = client.db(mongoConfig.DB);
      db.collection('users').insertMany(result).then(() => {
        mysqlConnection.query("SELECT * FROM stream_sales", function(err, result) {
          if (err) throw err;
          mongoClient.connect(url, function(err, client){
            if (err) throw err;
            const db = client.db(mongoConfig.DB);
            result.forEach(ticket => {
              db.collection('users').updateOne(
                { email: ticket.email},
                { $push: { stream_tickets: ticket}});
            });
            client.close();
          });
        });
        mysqlConnection.query("SELECT * FROM on_site_sales", function(err, result) {
          if (err) throw err;
          mongoClient.connect(url, function(err, client){
            if (err) throw err;
            const db = client.db(mongoConfig.DB);
            result.forEach(ticket => {
              db.collection('users').updateOne(
                { email: ticket.email},
                { $push: { on_site_tickets: ticket}});
            });
            client.close();
          });
        });
      });
      client.close();
    });
  });

  // return success
  res.send("DB Migrated!")
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});