-- dropping tables in database
USE covid_cinema;
DROP TABLE IF EXISTS cinema, seats, movies, screenings, on_site_tickets, stream_tickets, users, stream_sales, on_site_sales;

-- creating tables
CREATE TABLE cinema (
	cinema_id INT AUTO_INCREMENT PRIMARY KEY,
    capacity INT NOT NULL,
    address VARCHAR(255) NOT NULL
);
CREATE TABLE seats (
	seat_row INT,
    seat_col CHAR(1),
    cinema_id INT NOT NULL,
    weightlimit INT NOT NULL,
    dx BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (seat_row, seat_col, cinema_id),
	FOREIGN KEY (cinema_id)
		REFERENCES cinema (cinema_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);
CREATE TABLE movies (
	title VARCHAR(255),
    release_date INT,
    runtime TIME NOT NULL,
    director VARCHAR(255) NOT NULL,
    rating VARCHAR(255) NOT NULL,
    dx BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (title, release_date)
);
CREATE TABLE screenings (
	screening_id INT AUTO_INCREMENT PRIMARY KEY,
	cinema_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    release_date INT NOT NULL,
    starttime DATETIME NOT NULL,
    FOREIGN KEY (title, release_date)
		REFERENCES movies (title, release_date)
        ON UPDATE RESTRICT ON DELETE CASCADE,
    FOREIGN KEY (cinema_id)
		REFERENCES cinema (cinema_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);
CREATE TABLE on_site_tickets (
	ticket_code VARCHAR(255) PRIMARY KEY,
    refund_date DATE NOT NULL,
    price INT NOT NULL,
    screening_id INT NOT NULL,
    seat_row INT NOT NULL,
    seat_col CHAR(1) NOT NULL,
    cinema_id INT NOT NULL,
    FOREIGN KEY (screening_id)
		REFERENCES screenings (screening_id)
        ON UPDATE RESTRICT ON DELETE CASCADE,
    FOREIGN	KEY (seat_row, seat_col, cinema_id)
		REFERENCES seats (seat_row, seat_col, cinema_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);
CREATE TABLE stream_tickets (
	ticket_code VARCHAR(255) PRIMARY KEY,
    price INT NOT NULL,
    screening_id INT NOT NULL,
    FOREIGN KEY (screening_id)
		REFERENCES screenings (screening_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);
CREATE TABLE users (
	email VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    discount INT NOT NULL DEFAULT 0,
    phone VARCHAR(255),
    first_name VARCHAR(255) NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    birthdate DATE
);
CREATE TABLE stream_sales (
	ticket_code VARCHAR(255) PRIMARY KEY,
	email VARCHAR(255) NOT NULL,
    FOREIGN KEY (email)
		REFERENCES users (email)
        ON UPDATE RESTRICT ON DELETE CASCADE,
	FOREIGN KEY (ticket_code)
		REFERENCES stream_tickets (ticket_code)
        ON UPDATE RESTRICT ON DELETE CASCADE
);
CREATE TABLE on_site_sales (
	ticket_code VARCHAR(255) PRIMARY KEY,
	email VARCHAR(255) NOT NULL,
    FOREIGN KEY (email)
		REFERENCES users (email)
        ON UPDATE RESTRICT ON DELETE CASCADE,
	FOREIGN KEY (ticket_code)
		REFERENCES on_site_tickets (ticket_code)
        ON UPDATE RESTRICT ON DELETE CASCADE
);

-- inserting data
INSERT INTO cinema (cinema_id, capacity, address)
VALUES (1, 36, 'Guglgasse 11, 1110 Wien');
INSERT INTO seats (seat_row, seat_col, cinema_id, weightlimit)
VALUES
    (1, 'A', 1, 200), (1, 'B', 1, 200), (1, 'C', 1, 200), (1, 'D', 1, 200), (1, 'E', 1, 200), (1, 'F', 1, 200),
    (2, 'A', 1, 200), (2, 'B', 1, 200), (2, 'C', 1, 200), (2, 'D', 1, 200), (2, 'E', 1, 200), (2, 'F', 1, 200),
    (3, 'A', 1, 200), (3, 'B', 1, 200), (3, 'C', 1, 200), (3, 'D', 1, 200), (3, 'E', 1, 200), (3, 'F', 1, 200),
    (4, 'A', 1, 200), (4, 'B', 1, 200), (4, 'C', 1, 200), (4, 'D', 1, 200), (4, 'E', 1, 200), (4, 'F', 1, 200),
    (5, 'A', 1, 200), (5, 'B', 1, 200), (5, 'C', 1, 200), (5, 'D', 1, 200), (5, 'E', 1, 200), (5, 'F', 1, 200),
    (6, 'A', 1, 200), (6, 'B', 1, 200), (6, 'C', 1, 200), (6, 'D', 1, 200), (6, 'E', 1, 200), (6, 'F', 1, 200);
INSERT INTO movies (title, release_date, runtime, director, rating, dx)
VALUES
	('Iron Man', 2008, '02:06:00', 'Jon Favreau', '12A', true),
    ('Iron Man 2', 2010, '02:04:00', 'Jon Favreau', '12A', true),
    ('Thor', 2011, '01:55:00', 'Kenneth Branagh', '12A', true),
    ('Iron Man 3', 2013, '02:10:00', 'Shane Black', '12A', false),
    ('Guardians of the Galaxy', 2014, '02:01:00', 'James Gunn', '12A', false),
    ('Ant-Man', 2015, '01:57:00', 'Payton Reed', '12A', false),
    ('Doctor Strange', 2016, '01:55:00', 'Scott Derrickson', '12A', false);
INSERT INTO screenings (cinema_id, title, release_date, starttime)
VALUES
	(1, 'Iron Man', 2008, '2021-01-23 17:00:00'),
    (1, 'Iron Man 2', 2010, '2021-01-23 19:20:00'),
    (1, 'Iron Man 3', 2013, '2021-01-23 21:45:00'),
    (1, 'Iron Man', 2008, '2021-01-24 17:00:00'),
    (1, 'Iron Man 2', 2010, '2021-01-24 19:20:00'),
    (1, 'Iron Man 3', 2013, '2021-01-24 21:45:00'),
    (1, 'Thor', 2011, '2021-01-25 14:00:00'),
    (1, 'Guardians of the Galaxy', 2014, '2021-01-25 16:10:00'),
    (1, 'Ant-Man', 2015, '2021-01-25 18:30:00'),
    (1, 'Doctor Strange', 2016, '2021-01-25 20:45:00'),
    (1, 'Thor', 2011, '2021-01-26 14:00:00'),
    (1, 'Guardians of the Galaxy', 2014, '2021-01-26 16:10:00'),
    (1, 'Ant-Man', 2015, '2021-01-26 18:30:00'),
    (1, 'Doctor Strange', 2016, '2021-01-26 20:45:00'),
    (1, 'Thor', 2011, '2021-01-27 14:00:00'),
    (1, 'Guardians of the Galaxy', 2014, '2021-01-27 16:10:00'),
    (1, 'Ant-Man', 2015, '2021-01-27 18:30:00'),
    (1, 'Doctor Strange', 2016, '2021-01-27 20:45:00'),
    (1, 'Thor', 2011, '2021-01-28 14:00:00'),
    (1, 'Guardians of the Galaxy', 2014, '2021-01-28 16:10:00'),
    (1, 'Ant-Man', 2015, '2021-01-28 18:30:00'),
    (1, 'Doctor Strange', 2016, '2021-01-28 20:45:00'),
    (1, 'Thor', 2011, '2021-01-29 14:00:00'),
    (1, 'Guardians of the Galaxy', 2014, '2021-01-29 16:10:00'),
    (1, 'Ant-Man', 2015, '2021-01-29 18:30:00'),
    (1, 'Doctor Strange', 2016, '2021-01-29 20:45:00');
INSERT INTO on_site_tickets (ticket_code, refund_date, price, screening_id, seat_row, seat_col, cinema_id)
VALUES
	('WE6Z25', '2021-01-22', 10, 1, 3, 'C', 1),
    ('ZV2XDS', '2021-01-22', 10, 7, 3, 'D', 1);
INSERT INTO stream_tickets (ticket_code, price, screening_id)
VALUES
	('Z6XV8F', 10, 2),
    ('NAZ467', 10, 8);
INSERT INTO users (email, password, first_name, family_name, birthdate)
VALUES
	('kristof.juhasz@uniwien.at', 'fc66961a2ee7d37faa352ad9a4a94ab61a322f75dd5b3e9f9360205fab30760b', 'Kristof', 'Juhasz', '1994-06-22'),
    ('mehrudin.sabani@uniwien.at', 'fc66961a2ee7d37faa352ad9a4a94ab61a322f75dd5b3e9f9360205fab30760b', 'Mehrudin', 'Sabani', '1997-05-05');
INSERT INTO stream_sales (ticket_code, email)
VALUES ('Z6XV8F', 'mehrudin.sabani@uniwien.at'), ('NAZ467', 'kristof.juhasz@uniwien.at');
INSERT INTO on_site_sales (ticket_code, email)
VALUES ('WE6Z25', 'mehrudin.sabani@uniwien.at'), ('ZV2XDS', 'kristof.juhasz@uniwien.at');