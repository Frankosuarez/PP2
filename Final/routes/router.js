const express = require("express")
const router = express.Router()
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const conexion = require("../database/db")
const authController = require("../controllers/authController")

// Configuración de Multer para guardar en /uploads con nombre único
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // carpeta destino
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // nombre único
    }
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".mp3" && ext !== ".wav") {
      return cb(new Error("Solo se permiten archivos .mp3 o .wav"));
    }
    cb(null, true);
  }
});

// Ruta principal "/" con listado de canciones y formulario de subida
router.get("/", authController.isAuthenticated, (req, res) => {
  const rutaUploads = path.join(__dirname, "..", "uploads");

  let canciones = [];
  if (fs.existsSync(rutaUploads)) {
    canciones = fs
      .readdirSync(rutaUploads)
      .filter((file) => [".mp3", ".wav"].includes(path.extname(file).toLowerCase()))
      .sort((a, b) => fs.statSync(path.join(rutaUploads, b)).mtimeMs - fs.statSync(path.join(rutaUploads, a)).mtimeMs); // más recientes primero
  }

  res.render("index", {
    user: req.user,
    canciones: canciones,
  });
});

router.get("/login", (req,res) => {
    res.render("login", {alert:false});
});

router.get("/register", (req,res) => {
    res.render("register")
})

//metodos del controller
router.post("/register", authController.register)
router.post("/login" , authController.login)
router.get("/logout" , authController.logout)

// Ruta para subir archivos
router.post(
  "/upload",
  authController.isAuthenticated,
  upload.single("audio"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send("No se subió ningún archivo.");
    }
    res.redirect("/");
  }
);

router.post('/delete', authController.deleteSong);


module.exports = router
