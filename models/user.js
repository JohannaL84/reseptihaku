const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, default: "" }, // Nimimerkki
    completedChallenges: { type: Number, default: 0 }, // Suoritetut haasteet
    points: { type: Number, default: 0 }, // Pisteet
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }], // Tallennetut reseptit
    profileImage: { type: String, default: "default-profile.png" } // Profiilikuva
});

module.exports = mongoose.model("User", UserSchema);
