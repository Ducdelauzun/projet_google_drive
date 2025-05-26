// src/app.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const authRoutes = require("./routes/auth");

// Middlewares globaux
app.use(cors());
app.use(express.json()); // pour parser application/json
app.use(express.urlencoded({ extended: true })); // pour parser application/x-www-form-urlencoded

app.use("/api/auth", authRoutes);

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err.message));

// Exemple de route de test
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur le backend du drive personnel !" });
});

module.exports = app;

const protectedRoutes = require("./routes/protected");
app.use("/api", protectedRoutes);

const fileRoutes = require("./routes/files");
app.use("/api/files", fileRoutes);
