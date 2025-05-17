// server/sendmail.js
const nodemailer = require('nodemailer');

// Función asíncrona para enviar el correo electrónico
const sendMail = async (name, senderEmail, subject, message) => {
    // 1. Configura el transportador de Nodemailer
    // Aquí usamos Gmail. Es crucial usar una "Contraseña de Aplicación" de Google
    // si tienes la verificación en dos pasos activada en tu cuenta de Gmail,
    // ya que es más seguro que usar tu contraseña principal.
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Especificamos que usaremos el servicio de Gmail
        auth: {
            user: process.env.EMAIL_USER, // Tu dirección de Gmail desde el archivo .env
            pass: process.env.EMAIL_PASS  // Tu Contraseña de Aplicación de Gmail desde el archivo .env
        }
    });

    // 2. Define las opciones del correo electrónico
    const mailOptions = {
        from: `"${name}" <${senderEmail}>`, // El remitente que se mostrará (nombre y correo del que llenó el form)
        to: process.env.RECEIVER_EMAIL,     // Tu correo personal (ignaciogalmes79@gmail.com) donde recibirás los mensajes
        subject: `Mensaje de Contacto - ${subject}`, // El asunto del correo que recibirás
        html: `
            <p style="font-family: sans-serif; font-size: 14px; color: #333;">
                <strong>De:</strong> ${name}
            </p>
            <p style="font-family: sans-serif; font-size: 14px; color: #333;">
                <strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a>
            </p>
            <p style="font-family: sans-serif; font-size: 14px; color: #333;">
                <strong>Asunto:</strong> ${subject}
            </p>
            <p style="font-family: sans-serif; font-size: 14px; color: #333;">
                <strong>Mensaje:</strong>
            </p>
            <p style="font-family: sans-serif; font-size: 14px; color: #333; white-space: pre-wrap;">
                ${message}
            </p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-family: sans-serif; font-size: 12px; color: #777;">
                Este mensaje fue enviado desde tu formulario de contacto.
            </p>
        `
    };

    // 3. Envía el correo electrónico
    // Si hay un error aquí (ej. credenciales incorrectas, problemas de conexión),
    // la promesa será rechazada y el error será capturado en el try-catch de app.js.
    await transporter.sendMail(mailOptions);
};

// Exporta la función para que pueda ser usada por app.js
module.exports = sendMail;