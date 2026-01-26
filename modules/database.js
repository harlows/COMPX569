const mariadb = require("mariadb");

const USER_NAME = process.env.USER_NAME;
const USER_PASS = process.env.USER_PASS;

const database = mariadb.createConnection({
    host: process.env.HOST,
    database: USER_NAME,
    user: USER_NAME,
    password: USER_PASS
});

module.exports = database;
