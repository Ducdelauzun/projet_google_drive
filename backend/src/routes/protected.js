// src/routes/protected.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Tu es bien authentifié !",
    user: req.user, // contient userId et username depuis le token
  });
});

module.exports = router;
