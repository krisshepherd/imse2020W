const mongoClient = require("mongodb").MongoClient;
const mongoConfig = require("./dbconfigs/mongo.prod.config");

class MongoHandler{
    // MongoDB connection details
    url = `mongodb://${mongoConfig.USER}:${mongoConfig.PASSWORD}@${mongoConfig.HOST}/?authSource=admin`;

    async wipeDatabase(){
        mongoClient.connect(this.url, function(err, client){
            if (err) throw err;
            const db = client.db(mongoConfig.DB);
            db.dropDatabase(mongoConfig.DB);
            client.close();
        });
    }

    async insertMany(collection, values){
        mongoClient.connect(this.url, (err, client) => {
            const db = client.db(mongoConfig.DB);
            db.collection(`${collection}`).insertMany(values);
            client.close();
        });
    }

    async insertSeats(seats){
        mongoClient.connect(this.url, (err, client) => {
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
    }

    async insertScreenings(screenings){
        mongoClient.connect(this.url, (err, client) => {
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
    }

    async insertTickets(onsite, stream){
        mongoClient.connect(this.url, (err, client) => {
            const db = client.db(mongoConfig.DB);
            let tickets = {
              on_site_tickets: onsite,
              stream_tickets: stream
            }
            db.collection('tickets').insertOne(tickets);
            client.close();
        });
    }

    async insertOnsiteSales(tickets){
        mongoClient.connect(this.url, (err, client) => {
            const db = client.db(mongoConfig.DB);
            tickets.forEach(ticket => {
              db.collection('users').updateOne(
                { email: ticket.email},
                { $push: { on_site_tickets: ticket}});
            });
            client.close();
        });
    }

    async insertStreamSales(tickets){
        mongoClient.connect(this.url, (err, client) => {
            const db = client.db(mongoConfig.DB);
            tickets.forEach(ticket => {
              db.collection('users').updateOne(
                { email: ticket.email},
                { $push: { stream_tickets: ticket}});
            });
            client.close();
        });
    }
}

module.exports = MongoHandler;