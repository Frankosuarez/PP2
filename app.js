const express = require("express");
const mysql = require("mysql");
const app = express();

const db = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password:'',
    database:'nodejs-login'

});

db.connect( (error) => {

    if(error) {
        console.log(error)
    }else {
        console.log("MYSQL Connected...")
    }
})

app.get("/",(req,res) => {

    res.send("<h1> home page </h1>")
});

app.listen(5000 , () => {

    console.log("server started on port 5000");
})