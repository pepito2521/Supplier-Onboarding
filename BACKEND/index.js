const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const db = require("./db");
const supabase = require("./supabase");
require("dotenv").config();
const sendEmail = require("./helpers/mailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "FRONTEND", "public")));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Esta ruta acepta archivos y datos del formulario
app.post("/guardar", upload.fields([
  { name: "afip" }, 
  { name: "iibb" }, 
  { name: "cm05" }, 
  { name: "comprobante" }
]), async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;

    // Función para subir un archivo a Supabase y devolver la URL
    const subirArchivo = async (archivo, nombreDestino) => {
      const { data: uploadData, error } = await supabase.storage
        .from("supplierdocs")
        .upload(`${Date.now()}_${nombreDestino}`, archivo.buffer, {
          contentType: archivo.mimetype,
        });
      if (error) throw error;

      const { data: publicURL } = supabase.storage
        .from("supplierdocs")
        .getPublicUrl(uploadData.path);

      return publicURL.publicUrl;
    };

    // Subimos cada archivo si existe
    const afipUrl = files.afip ? await subirArchivo(files.afip[0], "afip") : null;
    const iibbUrl = files.iibb ? await subirArchivo(files.iibb[0], "iibb") : null;
    const cm05Url = files.cm05 ? await subirArchivo(files.cm05[0], "cm05") : null;
    const comprobanteUrl = files.comprobante ? await subirArchivo(files.comprobante[0], "comprobante") : null;

    // Insertar en Supabase
    const sql = `
    INSERT INTO "Suppliers" (
      "NOMBRE", "TELEFONO", "CORREO", "RAZON SOCIAL", "CUIT", "DIRECCION FISCAL", "ACTIVIDAD PRINCIPAL",
      "CONSTANCIA DE INSCRIPCION_URL", "IIBB_URL", "CM05_URL", "COMPROBANTE CBU_URL",
      "BANCO", "CBU", "CUENTA", "MONEDA", "CODIGO DE CONDUCTA"
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    RETURNING id
  `;

    const values = [
        data.name, data.phone, data.email, data.razon_social, data.cuit, data.direccion_fiscal,
        data.actividad, afipUrl, iibbUrl, cm05Url, comprobanteUrl,
        data.banco, data.cbu, data.cuenta, data.moneda, data.codigo
      ];

    const result = await db.query(sql, values);

    // 👇 Enviar correo al email del usuario
    await sendEmail({
      to: data.email,
      subject: "Gracias por registrarte como proveedor",
      text: `Hola ${data.name}, gracias por completar el formulario.`,
      html: `
        <p>Hola <strong>${data.name}</strong>,</p>
        <p>Gracias por completar el formulario para registrarte como proveedor. Pronto nos pondremos en contacto contigo.</p>
        <p>Saludos,<br>Equipo de Administración</p>
      `
    });
    res.status(201).json({ message: "Formulario guardado y email enviado", id: result.rows[0].id });

  } catch (error) {
    console.error("Error en /guardar:", error);
    res.status(500).json({ error: "Error al procesar el formulario" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});