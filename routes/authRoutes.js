const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// 🔹 Rekisteröi käyttäjä
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Tarkistetaan, onko käyttäjä jo olemassa
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) return res.status(400).json({ msg: "Käyttäjänimi tai sähköposti on jo käytössä!" });

        // Salataan salasana
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Luodaan uusi käyttäjä
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ msg: "✅ Käyttäjä rekisteröity onnistuneesti!" });
    } catch (error) {
        console.error("Rekisteröinti epäonnistui:", error);
        res.status(500).json({ msg: "❌ Palvelinvirhe! Yritä uudelleen." });
    }
});

// 🔹 Kirjaudu sisään (käyttäjätunnuksella tai sähköpostilla)
router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier voi olla joko käyttäjätunnus tai sähköposti

        // Etsitään käyttäjä MongoDB:stä käyttäjätunnuksella tai sähköpostilla
        const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
        if (!user) return res.status(400).json({ msg: "❌ Virheellinen tunnus tai salasana!" });

        // Tarkistetaan salasana
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "❌ Virheellinen tunnus tai salasana!" });

        // Luodaan JWT-token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Kirjautuminen epäonnistui:", error);
        res.status(500).json({ msg: "❌ Palvelinvirhe! Yritä uudelleen." });
    }
});

// 🔹 Hae käyttäjän tiedot (JWT-autentikointi)
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ msg: "❌ Ei kirjautumista!" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) return res.status(404).json({ msg: "❌ Käyttäjää ei löydy!" });

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            completedChallenges: user.completedChallenges,
            points: user.points,
            savedRecipes: user.savedRecipes,
            profileImage: user.profileImage
        });
    } catch (error) {
        console.error("Käyttäjän tietojen haku epäonnistui:", error);
        res.status(500).json({ msg: "❌ Palvelinvirhe! Yritä uudelleen." });
    }
});
