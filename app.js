require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sendMail = require('./sendmail.js');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Orígenes permitidos
const allowedOrigins = [
    'https://igalmes.com',         // Producción (dominio sin www)
    'https://www.igalmes.com',     // Producción (dominio con www)
    'http://127.0.0.1:5500',       // Desarrollo local
    'http://localhost:5500'        // Alternativa válida en local
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
    allowedHeaders: ['Content-Type']
};

// ✅ Middleware de CORS
app.use(cors(corsOptions));


// ✅ Middleware de parseo de cuerpo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Archivos estáticos
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Endpoint de envío de correo
app.post('./send-email', async (req, res) => {
    console.log('Datos recibidos:', req.body);

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
        console.error('❌ Error al enviar el correo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el mensaje.'
        });
    }
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
