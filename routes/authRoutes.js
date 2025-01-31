const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("../config/emailService");
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
        const resetLink = `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}`;

        await sendResetEmail(email, user.username, resetLink);

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

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ msg: "❌ Vanhentunut tai virheellinen palautuslinkki!" });
        }

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
