const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 🔹 Käytä Google App Passwordia!
    },
});

async function sendPasswordResetEmail(to, resetLink) {
    const mailOptions = {
        from: `"Ruokareseptihaku" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Salasanan palautuslinkki",
        text: `Voit nollata salasanasi klikkaamalla tästä linkistä: ${resetLink}`,
        html: `<p>Voit nollata salasanasi klikkaamalla tästä linkistä:</p><a href="${resetLink}">${resetLink}</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Salasanan palautuslinkki lähetetty:", to);
    } catch (error) {
        console.error("❌ Sähköpostin lähetys epäonnistui:", error);
    }
}

module.exports = { sendPasswordResetEmail };