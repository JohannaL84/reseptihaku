const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("models/user.js");
require("dotenv").config();

const router = express.Router();

// 🔹 Rekisteröi käyttäjä
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, nickname, profileImage } = req.body;

        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) return res.status(400).json({ msg: "❌ Käyttäjänimi tai sähköposti on jo käytössä!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ 
            username, 
            email, 
            password: hashedPassword,
            nickname: nickname || username,
            profileImage: profileImage || "default-profile.png",
            completedChallenges: 0,
            points: 0,
            savedRecipes: []
        });
        await user.save();

        res.status(201).json({ msg: "✅ Käyttäjä rekisteröity onnistuneesti!" });
    } catch (error) {
        console.error("Rekisteröinti epäonnistui:", error);
        res.status(500).json({ msg: "❌ Palvelinvirhe! Yritä uudelleen." });
    }
});

// 🔹 Kirjaudu sisään
router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
        if (!user) return res.status(400).json({ msg: "❌ Virheellinen tunnus tai salasana!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "❌ Virheellinen tunnus tai salasana!" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                nickname: user.nickname,
                completedChallenges: user.completedChallenges,
                points: user.points,
                savedRecipes: user.savedRecipes,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error("Kirjautuminen epäonnistui:", error);
        res.status(500).json({ msg: "❌ Palvelinvirhe! Yritä uudelleen." });
    }
});

// 🔹 Salasanan palautuspyyntö
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ msg: "❌ Käyttäjää ei löydy!" });

        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const resetLink = `http://localhost:3000/reset-password.html?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Ruokareseptihaku" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔑 Salasanan palautus",
            html: `<p>Hei ${user.username},</p>
                   <p>Voit palauttaa salasanasi klikkaamalla alla olevaa linkkiä:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>Terveisin,<br>Ruokareseptihaku-tiimi</p>`
        });

        res.json({ msg: "✅ Salasanan palautuslinkki lähetetty sähköpostiisi!" });
    } catch (error) {
        console.error("Salasanan palautus epäonnistui:", error);
        res.status(500).json({ msg: "❌ Palvelinvirhe! Yritä uudelleen." });
    }
});

// 🔹 Salasanan vaihtaminen palautuslinkin kautta
router.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(404).json({ msg: "❌ Käyttäjää ei löydy!" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ msg: "✅ Salasana vaihdettu onnistuneesti!" });
    } catch (error) {
        console.error("Salasanan vaihto epäonnistui:", error);
        res.status(500).json({ msg: "❌ Palvelinvirhe! Yritä uudelleen." });
    }
});

module.exports = router;
