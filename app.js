require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sendMail = require('./sendmail.js'); // Esto es correcto para importar tu función

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Orígenes permitidos (¡Ya corregidos, excelente!)
const allowedOrigins = [
    'https://igalmes.com',
    'https://www.igalmes.com', // ¡Asegúrate de que esta línea esté presente!
    'http://127.0.0.1:5500',
    'http://localhost:5500'
];

// ✅ Configuración de CORS
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`🚫 CORS bloqueado para origen no permitido: ${origin}`);
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true // Añadir si en algún momento manejas cookies o headers de autorización
};

// ✅ Middleware de CORS (Mantén esta línea)
app.use(cors(corsOptions));
// ✅ ¡IMPORTANTE! Elimina la siguiente línea si está presente:
// app.options('*', cors(corsOptions)); // Esta línea DEBE ser eliminada.


// ✅ Middleware de parseo de cuerpo (Mantén estos aquí, antes de las rutas)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ Endpoint de envío de correo (¡Mueve esta sección AQUÍ, antes de los estáticos!)
// ✅ ¡IMPORTANTE! Cambia './send-email' por '/send-email'
app.post('/send-email', async (req, res) => {
    console.log('Datos recibidos en /send-email:', req.body); // Verás esto en los logs de Render

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son obligatorios.'
        });
    }

    try {
        await sendMail(name, email, subject, message);
        res.status(200).json({
            success: true,
            message: '¡Mensaje enviado con éxito!'
        });
    } catch (error) {
        console.error('❌ Error al enviar el correo (desde sendMail):', error); // Verás esto en los logs de Render si falla el envío
        res.status(500).json({
            success: false,
            message: 'Error al enviar el mensaje.'
        });
    }
});


// ✅ Ruta para la página principal (si tu index.html es la raíz)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Archivos estáticos (Mueve esta sección ABAJO de tus rutas de API específicas)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));


// ✅ Manejador de rutas no encontradas (opcional, para SPAs, si no tienes una ruta catch-all)
// Si quieres que cualquier otra ruta devuelva tu index.html (útil para Single Page Applications)
/*
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});
*/


// ✅ Iniciar servidor (mantenlo al final)
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});