require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sendMail = require('./sendmail'); // llamamos a sendmail en subdirectorio.

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS solo permite solicitudes desde igalmes.com
const corsOptions = {
    origin: 'https://igalmes.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
const publicPath = path.join(__dirname, 'public');
console.log('Express sirviendo archivos estáticos desde:', publicPath);
app.use(express.static(publicPath));

// Endpoint para enviar correo
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    }

    try {
        await sendMail(name, email, subject, message);
        res.status(200).json({ success: true, message: '¡Mensaje enviado con éxito!' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ success: false, message: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
