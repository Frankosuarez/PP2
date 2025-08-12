//FrontController
const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")

const app = express()

//motor de plantillas
app.set("view engine", "ejs")

//carpeta para archivos estaticos
app.use(express.static("public"))
app.use('/uploads', express.static('uploads'))


app.use(express.urlencoded({extended:true}))
app.use(express.json())

//variables de entorno
dotenv.config({path: "./env/env"})

//cookies
app.use(cookieParser())

//llama al router
app.use("/", require("./routes/router"))

//borrar cache
app.use(function(req, res, next) {
    if (!req.user)
        res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    next();
});

app.listen(3000, () => {
    console.log("SERVER UP running in http://localhost:3000")
})
