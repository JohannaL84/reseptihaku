const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Rekisteröi käyttäjä
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "Käyttäjä on jo olemassa" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ msg: "Käyttäjä rekisteröity!" });
    } catch (error) {
        res.status(500).json({ msg: "Palvelinvirhe" });
    }
});

// Kirjaudu sisään
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Virheellinen tunnus tai salasana" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Virheellinen tunnus tai salasana" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, username: user.username });
    } catch (error) {
        res.status(500).json({ msg: "Palvelinvirhe" });
    }
});

module.exports = router;
