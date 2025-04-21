require("dotenv").config();
const { Pool } = require("pg");

// Conexión a Supabase (asegurate de que DATABASE_URL esté en Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("✅ Conectado a Supabase"))
  .catch(err => console.error("Error conectando a Supabase:", err));

module.exports = pool;