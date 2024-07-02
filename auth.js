const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Función para registrar un usuario
exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    // Verificar si el correo electrónico ya está registrado
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'Ese correo electrónico ya está en uso'
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Las contraseñas no coinciden'
            });
        }

        // Hashear la contraseña antes de almacenarla
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        // Insertar el nuevo usuario en la base de datos
        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render("register", {
                    message: "Usuario registrado"
                });
            }
        });
    });
};

// Función para realizar el inicio de sesión
exports.login = async (req, res) => {
    try {
        const { user, password } = req.body;

        

        // Buscar el usuario en la base de datos
        db.query('SELECT * FROM users WHERE email = ?', [user], async (error, results) => {
            if (error) {
                console.log(error);
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error en la base de datos",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            }

            // Si no se encontró el usuario
            if (results.length === 0) {
                return res.render('/index', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o contraseña incorrectas",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            }

            // Verificar si la contraseña es correcta
            const isMatch = await bcrypt.compare(password, results[0].password);
            if (!isMatch) {
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o contraseña incorrectas",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            }

            res.render('hola', {
                alert: true,
                alertTitle: "Conexión exitosa",
                alertMessage: "¡LOGIN CORRECTO!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 800,
                ruta: ''
            });
        });

    } catch (error) {
        console.log(error);
        res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error en el servidor",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
};
