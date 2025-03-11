require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        enableArithAbort: true
    }
}

const dbConnection = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        return pool
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = dbConnection;