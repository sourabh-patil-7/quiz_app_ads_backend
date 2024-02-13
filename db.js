const { process_params } = require("express/lib/router");
const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
    host: "localhost",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});


connection.connect(function (err) 
{
    if(err) 
    {
        console.error("Error connecting: " + err.stack);
        connection = null;
        return;
    }
    console.log("connected as id " + connection.threadId);
});

module.exports = connection;
