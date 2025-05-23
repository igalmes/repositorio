require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sendMail = require('./sendmail'); // Asegúrate de que sendmail.js está en el mismo directorio

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
const publicPath = path.join(__dirname, 'public');
console.log('Express sirviendo archivos estáticos desde:', publicPath); // <-- Línea añadida para depuración
app.use(express.static(publicPath));

// La ruta principal '/' ha sido comentada, confiando en express.static para servir index.html
/*
app.get('/', (req, res) => {
    console.log('¡Request recibido para la ruta principal!');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
*/

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