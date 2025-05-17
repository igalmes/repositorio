// server/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // ¡Necesitas importar 'path' para rutas absolutas!
const sendMail = require('./sendmail');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ¡NUEVO! Servir archivos estáticos desde la carpeta 'public' ---
// Esto hace que todo lo que esté en 'public' sea accesible directamente.
// Por ejemplo, si tienes 'public/index.html', se accederá vía http://localhost:3000/index.html
// Si tienes 'public/css/style.css', se accederá vía http://localhost:3000/css/style.css
app.use(express.static(path.join(__dirname, '../public'))); // Ajusta la ruta a tu carpeta 'public'

// --- ¡NUEVO! Ruta para servir tu index.html como la página principal ---
// Cuando alguien acceda a http://localhost:3000/, se le enviará el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Contact form submission endpoint
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

// Start the server
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log('¡Listo para recibir tus mensajes!');
});