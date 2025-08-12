const mysql = require("mysql")
require('dotenv').config({ path: './env/.env' });

const conexion = mysql.createConnection({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,

})

conexion.connect( (error) =>{
    if(error){
        console.log("La conexion se detuvo por un: "+error)
        return
    }
    console.log("MYSQL: todo bien :)")
})

module.exports = conexion