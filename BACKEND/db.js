require("dotenv").config(); // Carga las variables de .env

const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saladillo2521',
    database: 'clientesdb'
});

connection.connect((err) => {
    if (err) {
        console.error("Error conectando a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL");
});

module.exports = connection;
