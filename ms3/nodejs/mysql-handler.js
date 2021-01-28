const mysql = require("mysql2/promise");
const mysqlConfig = require("./dbconfigs/mysql.prod.config");

class MySQLHandler {

    mysqlConnection;

    /**
     * Creates connection to the MySQL databse
     */
    async init(){
        this.mysqlConnection = await mysql.createConnection({
            host: mysqlConfig.HOST,
            user: mysqlConfig.USER,
            password: mysqlConfig.PASSWORD,
            database: mysqlConfig.DB
        });
        console.log(`Connected to host: ${mysqlConfig.HOST}!`);
    }

    /**
     * Returns the list of movies from the database
     * @returns {Array} Array of movies
     */
    async getMovies(){
        const sql = 'SELECT * FROM movies';
        let movies = await this.mysqlConnection.query(sql);
        return movies[0]; //query return (errors?, results, fields), we only need results
    }

    async getMovie(title, release_date){
        const sql = 'SELECT * FROM movies WHERE title = ? AND release_date = ?';
        let movie = await this.mysqlConnection.query(sql, [title, release_date]);
        return movie[0][0];
    }

    async getScreenings(title, release_date){
        const sql = 'SELECT * FROM screenings WHERE title = ? AND release_date = ?';
        let movie = await this.mysqlConnection.query(sql, [title, release_date]);
        return movie[0];
    }

    async getOnsiteTickets(email){
        const sql = 'SELECT * FROM  on_site_tickets INNER JOIN on_site_sales USING (ticket_code) WHERE email = ?';
        let tickets = await this.mysqlConnection.query(sql, [email]);
        return tickets[0];
    }

    async getStreamTickets(email){
        const sql = 'SELECT * FROM  stream_tickets INNER JOIN stream_sales USING (ticket_code) WHERE email = ?';
        let tickets = await this.mysqlConnection.query(sql, [email]);
        return tickets[0];
    }

    async getAdultSalesReport(){
        let adultSales = new Object();
        let sql = 'SELECT COUNT(ticket_code) onsite ' +
                  'FROM on_site_sales '+
                  'WHERE email IN '+
                  '(SELECT email FROM users WHERE TIMESTAMPDIFF(year, birthdate, NOW()) > 18)';
        const onsiteSales = await this.mysqlConnection.query(sql);
        adultSales.onsite = onsiteSales[0][0].onsite;
        sql = 'SELECT COUNT(ticket_code) streaming '+
              'FROM stream_sales '+
              'WHERE email IN '+
              '(SELECT email FROM users WHERE TIMESTAMPDIFF(year, birthdate, NOW()) > 18)';
        const streamSales = await this.mysqlConnection.query(sql);
        adultSales.streaming = streamSales[0][0].streaming;
        return adultSales;
    }

    async getOnsiteDxSalesReport(){
        let dxSales = new Object();
        let sql = 'SELECT COUNT(ticket_code) as total FROM on_site_tickets';
        const ticketTotal = await this.mysqlConnection.query(sql);
        dxSales.total = ticketTotal[0][0].total;
        sql = 'SELECT COUNT(ticket_code) as dxsales '+
              'FROM on_site_tickets '+
              'WHERE screening_id IN '+
              '(SELECT screening_id FROM screenings INNER JOIN movies USING (title, release_date) WHERE dx IS true)';
        const ticketsDx = await this.mysqlConnection.query(sql);
        dxSales.dxsales = ticketsDx[0][0].dxsales;
        return dxSales;
    }

    async validateUser(email, pwdHash){
        const sql = 'SELECT password FROM users WHERE email = ?';
        const password = await this.mysqlConnection.query(sql, [email]);
        if (password[0][0].password == pwdHash) return true
        else return false;
    }

    async getUser(email){
        const sql = 'SELECT email, first_name, family_name, birthdate, phone, discount FROM users WHERE email = ?';
        const user = await this.mysqlConnection.query(sql, [email]);
        return user[0][0];
    }

    async getDiscount(email){
        let sql = 'SELECT discount FROM users WHERE email = ?';
        const discount = await this.mysqlConnection.query(sql, [email]);
        return discount[0][0].discount;
    }

    async uploadCredit(email, amount){
        const currentDiscount = await this.getDiscount(email);
        let newDiscount = Number(currentDiscount) + Number(amount);
        let sql = 'UPDATE users SET discount = ? WHERE email = ?';
        await this.mysqlConnection.query(sql, [newDiscount, email]);
    }

    async deductCredit(email, amount){
        const currentDiscount = await this.getDiscount(email);
        let newDiscount = Number(currentDiscount) - Number(amount);
        let sql = 'UPDATE users SET discount = ? WHERE email = ?';
        await this.mysqlConnection.query(sql, [newDiscount, email]);
    }

    async refundTicket(code){
        let sql = 'SELECT email, price '+
                    'FROM on_site_sales '+
                    'INNER JOIN on_site_tickets '+
                    'USING (ticket_code) '+
                    'WHERE ticket_code = ?';
        const ticket = await this.mysqlConnection.query(sql, [code]);
        const email = ticket[0][0].email;
        const price = ticket[0][0].price;
        sql = 'DELETE FROM on_site_tickets WHERE ticket_code = ?';
        await this.mysqlConnection.query(sql, [code]);
        sql = 'SELECT discount FROM users WHERE email = ?';
        const discount = await this.mysqlConnection.query(sql, [email]);
        const newDiscount = Number(discount[0][0].discount) + Number(price);
        sql = 'UPDATE users SET discount = ? WHERE email = ?';
        await this.mysqlConnection.query(sql, [newDiscount, email]);
    }

    async buyOnsiteTicket(email, screening, row, seat, price, code){
        let sql = 'INSERT INTO on_site_tickets (ticket_code, refund_date, price, screening_id, seat_row, seat_col, cinema_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await this.mysqlConnection.query(sql, [code, screening.starttime.slice(0,10), price, screening.screening_id, row, seat, screening.cinema_id]);
        sql = 'INSERT INTO on_site_sales (ticket_code, email) VALUES (?, ?)';
        await this.mysqlConnection.query(sql, [code, email]);
        await this.deductCredit(email, price);
    }

    async buyStreamTicket(email, screening, price, code){
        let sql = 'INSERT INTO stream_tickets (ticket_code, price, screening_id) VALUES (?, ?, ?)';
        await this.mysqlConnection.query(sql, [code, price, screening.screening_id]);
        sql = 'INSERT INTO stream_sales (ticket_code, email) VALUES (?, ?)';
        await this.mysqlConnection.query(sql, [code, email]);
        await this.deductCredit(email, price);
    }

    // functions for migrating
    async getTable(table){
        const values = await this.mysqlConnection.query(`SELECT * FROM ${table}`);
        return values[0];
    }

}

module.exports = MySQLHandler;