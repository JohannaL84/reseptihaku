// UNOHTUNUT SALASANALINKKI TESTAUSTIEDOSTO
const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendTestEmail() {
    try {
        // Luo SMTP-yhteys
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true vain jos käytät porttia 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Määritä sähköpostin tiedot
        const mailOptions = {
            from: `"Testilähettäjä" <${process.env.EMAIL_USER}>`,
            to: "vastaanottaja@email.com", // Testivastaanottajan osoite
            subject: "Testiviesti",
            text: "Tämä on testiviesti",
            html: "<p>Tämä on <strong>testiviesti</strong>!</p>"
        };

        // Lähetä sähköposti
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Sähköposti lähetetty:", info.messageId);

    } catch (error) {
        console.error("❌ Virhe sähköpostin lähetyksessä:", error);
    }
}

sendTestEmail();
