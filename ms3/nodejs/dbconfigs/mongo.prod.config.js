// database config from docker
module.exports = {
    HOST: process.env.MONGO_HOST,
    USER: process.env.MONGO_USER,
    PASSWORD: process.env.MONGO_PASSWORD,
    DB: process.env.MONGO_DB,
    dialect: "mongodb"
};