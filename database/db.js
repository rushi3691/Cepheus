// db.js
const postgres = require('postgres');
const sql = postgres({
    host: process.env['DB_HOST'],
    port: parseInt(process.env['DB_PORT'],10),
    database: process.env['DB_NAME'],
    username: process.env['DB_USERNAME'],
    password: process.env['DB_PASS'],
    ssl: true,
    max: parseInt(process.env['MAX_CONN'], 10),
    idle_timeout: parseInt(process.env['IDLE_TIMEOUT'], 10)
    // debug: console.log
}) 
module.exports = {sql};
