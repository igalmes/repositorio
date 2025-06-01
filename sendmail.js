// server/sendmail.js
const nodemailer = require('nodemailer');


const sendMail = async (name, senderEmail, subject, message) => {
    
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Especificamos Gmail
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS 
        }
    });

    
    const mailOptions = {
        from: `"${name}" <${senderEmail}>`, 
        to: process.env.RECEIVER_EMAIL,     
        subject: `Mensaje de Contacto - ${subject}`, 
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

   
    await transporter.sendMail(mailOptions);
};

// Exporta función para app.js
module.exports = sendMail;  