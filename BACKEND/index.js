const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
const publicPath = path.join(__dirname, "..", "FRONTEND", "public");
app.use(express.static(publicPath));

// Ruta para recibir los datos del formulario
app.post("/guardar", (req, res) => {
    const { nombre, telefono, email } = req.body;

    if (!nombre || !telefono || !email) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO usuarios (nombre, telefono, email) VALUES ($1, $2, $3) RETURNING id";
    db.query(sql, [nombre, telefono, email])
        .then(result => {
            res.status(201).json({ message: "Datos guardados correctamente", id: result.rows[0].id });
        })
        .catch(err => {
            console.error("Error al insertar datos:", err);
            res.status(500).json({ error: "Error al guardar en la base de datos" });
        });
}); // ← cerramos correctamente la ruta

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
});