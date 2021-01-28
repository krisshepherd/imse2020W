const mongoClient = require("mongodb").MongoClient;
const mongoConfig = require("./dbconfigs/mongo.prod.config");

class MongoHandler{
    // MongoDB connection details
    url = `mongodb://${mongoConfig.USER}:${mongoConfig.PASSWORD}@${mongoConfig.HOST}/?authSource=admin`;

    async wipeDatabase(){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        await db.dropDatabase(mongoConfig.DB);
        client.close();
    }

    async insertMany(collection, values){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        await db.collection(`${collection}`).insertMany(values);
        client.close();
    }

    async insertSeats(seats){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        seats.forEach(async (seat) => {
            let mongoSeat = {
            row: seat.seat_row,
            col: seat.seat_col,
            weightlimit: seat.weightlimit,
            dx: seat.dx
            }
            await db.collection('cinemas').updateOne(
            { cinema_id: seat.cinema_id},
            { $push: { seats: mongoSeat }});
        });
        client.close();
    }

    async insertScreenings(screenings){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        screenings.forEach(async (screening) => {
            let mongoScreening = {
                cinema_id: screening.cinema_id,
                starttime: screening.starttime
            }
            await db.collection('movies').updateOne(
            { title: screening.title, release_date: Number(screening.release_date) },
            { $push: { screenings: mongoScreening }});
        });
        client.close()
    }

    async insertTickets(onsite, stream){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        let tickets = {
            on_site_tickets: onsite,
            stream_tickets: stream
        }
        await db.collection('tickets').insertOne(tickets);
        client.close();
    }

    async insertOnsiteSales(tickets){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        tickets.forEach(async (ticket) => {
            await db.collection('users').updateOne(
            { email: ticket.email},
            { $push: { on_site_tickets: ticket}});
        });
        client.close();
    }

    async insertStreamSales(tickets){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        tickets.forEach(
            async (ticket) => await db.collection('users').updateOne(
                { email: ticket.email},{ $push: { stream_tickets: ticket}}));
        client.close();
    }

    async getMovies(){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        let movies = await db.collection('movies').find().toArray();
        client.close();
        return movies;
    }

    async getMovie(title, release){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        let movie = await db.collection('movies').findOne({ title: title, release_date: Number(release) });
        client.close();
        return movie;
    }

    async getScreenings(title, release){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        let movie = await db.collection('movies').findOne({ title: title, release_date: Number(release) });
        client.close();
        movie.screenings.forEach(screening => {
            screening.title = title;
            screening.release_date = release;
        });
        return movie.screenings;
    }

    async validateUser(email, pwdHash){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        let user = await db.collection('users').findOne({email: email});
        client.close();
        if (user.password == pwdHash) return true;
        else return false;
    }

    async getUser(email){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        let user = await db.collection('users').findOne({email: email});
        client.close();
        return new Object({ email: user.email,
                            first_name: user.first_name,
                            family_name: user.family_name,
                            birthdate: user.birthdate,
                            phone: user.phone,
                            discount: user.discount });
    }

    async getOnsiteTickets(email){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        let user = await db.collection('users').find({email: email}).toArray();
        client.close();
        console.log(user.on_site_tickets);
        return user.on_site_tickets;
    }

    async getStreamTickets(email){
        let client = await mongoClient.connect(this.url);
        const db = client.db(mongoConfig.DB);
        let user = await db.collection('users').find({email: email}).toArray();
        client.close();
        console.log(user.stream_tickets);
        return user.stream_tickets;
    }
}

module.exports = MongoHandler;