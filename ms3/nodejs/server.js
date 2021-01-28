const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require('crypto');
const MySQLHandler = require('./mysql-handler.js');
const MongoHandler = require('./mongo-handler.js');

// global variables
const mysqlHandler = new MySQLHandler();
const mongoHandler = new MongoHandler();
const hashingSecret = "cheese";
const onsiteTicketPrice = 14;
const streamTicketPrice = 10;
var userToken = {};
const DBEnum = {
  MySQL: 1,
  MongoDB: 2
}
var activeDB = DBEnum.MySQL;


// making DB connections
mysqlHandler.init();

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
      mysqlHandler.getMovies().then(movies => res.json(movies));
      break;
    case DBEnum.MongoDB:
      mongoHandler.getMovies().then(movies => res.json(movies));
      break;
    default:
      console.error("Active Database error!");
  }
});

app.get("/api/movie", (req, res) => {
  let title = req.header('title');
  let release = req.header('release');
  switch(activeDB){
    case DBEnum.MySQL:
      mysqlHandler.getMovie(title, release).then(movie => res.json(movie));
      break;
    case DBEnum.MongoDB:
      mongoHandler.getMovie(title, release).then(movie => res.json(movie));
      break;
    default:
      console.error("Active Database error!");
  }
});

app.get("/api/onsitetickets", (req, res) => {
  if(userToken.value == req.header('token')){
    let email = userToken.email;
    switch(activeDB){
      case DBEnum.MySQL:
        mysqlHandler.getOnsiteTickets(email).then(tickets => res.json(tickets));
        break;
      case DBEnum.MongoDB:
        mongoHandler.getOnsiteTickets(email).then(tickets => res.json(tickets));
        break;
      default:
        console.error("Active Database error!");
    }
  }
});

app.get("/api/streamtickets", (req, res) => {
  if(userToken.value == req.header('token')){
    let email = userToken.email;
    switch(activeDB){
      case DBEnum.MySQL:
        mysqlHandler.getStreamTickets(email).then(tickets => res.json(tickets));
        break;
      case DBEnum.MongoDB:
        mongoHandler.getOnsiteTickets(email).then(tickets => res.json(tickets));
        break;
      default:
        console.error("Active Database error!");
    }
  }  
});

app.get("/api/adultsales", (reg,res) => {
  switch(activeDB){
    case DBEnum.MySQL:
      mysqlHandler.getAdultSalesReport().then(sales => res.json(sales));
      break;
    case DBEnum.MongoDB:
      // here comes the mongo code
      break;
    default:
      console.error("Active Database error!");
  }
});

app.get("/api/onsitedxsales", (req,res) => {
  switch(activeDB){
    case DBEnum.MySQL:
      mysqlHandler.getOnsiteDxSalesReport().then(sales => res.json(sales));
      break;
    case DBEnum.MongoDB:
      // here comes the mongo code
      break;
    default:
      console.error("Active Database error!");
  }
});

app.get("/api/screenings", (req,res) => {
  let title = req.header('title');
  let release = req.header('release');
  switch(activeDB){
    case DBEnum.MySQL:
      mysqlHandler.getScreenings(title, release).then(screenings => res.json(screenings));
      break;
    case DBEnum.MongoDB:
      mongoHandler.getScreenings(title, release).then(screenings => res.json(screenings));
      break;
    default:
      console.error("Active Database error!");
  }
});

app.get("/api/validateuser", (req,res) => {
  userToken = {};
  let email = req.header('email');
  let password = req.header('password');
  let pwdHash = crypto.createHmac('sha256', hashingSecret).update(password).digest('hex');
  switch(activeDB){
    case DBEnum.MySQL:
      mysqlHandler.validateUser(email, pwdHash).then(result => {
        if (result) {
          console.log("User authentication successful");
          userToken.email = email;
          crypto.randomBytes(48, (err, buffer) => {
            userToken.value = buffer.toString('hex');
            res.json(userToken.value);
          });
        } else console.log('User authentication failed');
      });
      break;
    case DBEnum.MongoDB:
      mongoHandler.validateUser(email, pwdHash).then(result => {
        if (result) {
          console.log('User authentication succesful');
          userToken.email = email;
          crypto.randomBytes(48, (err, buffer) => {
            userToken.value = buffer.toString('hex');
            res.json(userToken.value);
          });
        } else console.log('User authentication failed');
      });
      break;
    default:
      console.error("Active Database error!");
  }
});

app.get("/api/user", (req,res) => {
  if(userToken.value == req.header('token')){
    switch(activeDB){
      case DBEnum.MySQL:
        mysqlHandler.getUser(userToken.email).then(user => res.json(user));
        break;
      case DBEnum.MongoDB:
        mongoHandler.getUser(userToken.email).then(user => res.json(user));
        break;
      default:
        console.error("Active Database error!");
    }
  }
});

app.put("/api/uploadcredit", (req,res) => {
  let email = req.body.email;
  let credit = req.body.credit;
  switch(activeDB){
    case DBEnum.MySQL:
      mysqlHandler.uploadCredit(email, credit).then(() => res.json());
      break;
    case DBEnum.MongoDB:
      // here comes the mongo code
      break;
    default:
      console.error("Active Database error!");
  }
});

app.post("/api/refund", (req,res) => {
  let code = req.body.code;
  switch(activeDB){
    case DBEnum.MySQL:
      mysqlHandler.refundTicket(code).then(() => res.json());
      break;
    case DBEnum.MongoDB:
      // here comes the mongo code
      break;
    default:
      console.error("Active Database error!");
  }
});

app.post("/api/buyOnsiteTicket", (req,res) => {
  if(userToken.value == req.body.token){
    let email = userToken.email;
    let screening = req.body.screening;
    let row = req.body.row;
    let seat = req.body.seat;
    switch(activeDB){
      case DBEnum.MySQL:
        mysqlHandler.getDiscount(email).then(discount => {
          if(discount < onsiteTicketPrice){
            res.status(403).send("Insuffucient funds");
          } else {
            crypto.randomBytes(6, (err, buffer) => {
              let code = buffer.toString('hex');
              mysqlHandler.buyOnsiteTicket(email, screening, row, seat, onsiteTicketPrice, code)
                        .then(() => res.json());
            });
          }
        });
        break;
      case DBEnum.MongoDB:
        // here comes the mongo code
        break;
      default:
        console.error("Active Database error!");
    }
  }
});

app.post("/api/buyStreamTicket", (req,res) => {
  if(userToken.value == req.body.token){
    let email = userToken.email;
    let screening = req.body.screening;
    switch(activeDB){
      case DBEnum.MySQL:
        mysqlHandler.getDiscount(email).then(discount => {
          if(discount < streamTicketPrice){
            res.status(403).send("Insuffucient funds");
          } else {
            crypto.randomBytes(6, (err, buffer) => {
              let code = buffer.toString('hex');
              mysqlHandler.buyStreamTicket(email, screening, streamTicketPrice, code)
                        .then(() => res.json());
            });
          }
        });
        break;
      case DBEnum.MongoDB:
        // here comes the mongo code
        break;
      default:
        console.error("Active Database error!");
    }
  }
});

app.get("/api/migrateDB", (req,res) => {
  if ('mongodb' == req.header('db')){
    activeDB = DBEnum.MongoDB;
    // wipe mongo clean
    mongoHandler.wipeDatabase();

    // cinemas collection
    mysqlHandler.getTable('cinema').then(cinemas => {
      mongoHandler.insertMany('cinemas', cinemas).then(()=>{
        mysqlHandler.getTable('seats').then(seats => {
          mongoHandler.insertSeats(seats);
        });
      });
    });

    // movies collection
    mysqlHandler.getTable('movies').then(movies => {
      mongoHandler.insertMany('movies', movies).then(()=> {
        mysqlHandler.getTable('screenings').then(screenings => {
          mongoHandler.insertScreenings(screenings);
        });
      });
    });

    // tickets collection
    mysqlHandler.getTable('on_site_tickets').then(onsite => {
      mysqlHandler.getTable('stream_tickets').then(stream => {
        mongoHandler.insertTickets(onsite, stream);
      });
    });

    // users collection
    mysqlHandler.getTable('users').then(users => {
      mongoHandler.insertMany('users', users).then(() => {
        mysqlHandler.getTable('stream_sales').then(tickets => {
          mongoHandler.insertStreamSales(tickets);
        });
        mysqlHandler.getTable('on_site_sales').then(tickets => {
          mongoHandler.insertOnsiteSales(tickets);
        });
      });
    });

    // return success
    res.send("DB changed to MongoDB!")
  } else {
    activeDB = DBEnum.MySQL;
    // return success
    res.send("DB changed to MySQL!")
  }
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});