const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta para recibir los datos del formulario
app.post("/guardar", (req, res) => {
    const { nombre, telefono, email } = req.body;

    if (!nombre || !telefono || !email) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO usuarios (nombre, telefono, email) VALUES (?, ?, ?)";
    db.query(sql, [nombre, telefono, email], (err, result) => {
        if (err) {
            console.error("Error al insertar datos:", err);
            return res.status(500).json({ error: "Error al guardar en la base de datos" });
        }
        res.status(201).json({ message: "Datos guardados correctamente", id: result.insertId });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
});