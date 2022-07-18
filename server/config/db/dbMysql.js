// get the client
const mysql = require('mysql2');

const SERVER= 'db4free.net'
const NAME= 'webmovie'
const USERNAME = 'webmovie'
const PASSWORD = '340c02c5'
const POST_NUMBER = '3306'

try {
    const connectMySQL = mysql.createPool({
        host: SERVER,
        port: POST_NUMBER,
        user: USERNAME,
        password: PASSWORD,
        database: NAME,
        connectionLimit: 100,
        });   
        console.log('Mysql connect successfully');
        module.exports = connectMySQL;
} catch (error) {
    console.log(err);
}             



