// src/routes/files.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Configuration de multer (dynamique par utilisateur)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const username = req.user.username;
    const userFolder = path.join("/mnt/drive_data", username);

    // Crée le dossier s’il n'existe pas
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    cb(null, userFolder);
  },
  filename: (req, file, cb) => {
    // On garde le nom d’origine du fichier
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", verifyToken, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier fourni" });
  }

  res.status(201).json({
    message: "Fichier uploadé avec succès",
    filename: req.file.originalname,
    path: req.file.path,
  });
});

// GET /api/files/list
router.get("/list", verifyToken, (req, res) => {
  const username = req.user.username;
  const userFolder = path.join("/mnt/drive_data", username);

  // Vérifie que le dossier existe
  if (!fs.existsSync(userFolder)) {
    return res.status(200).json({ files: [] }); // Aucun fichier encore
  }

  // Lis les fichiers
  fs.readdir(userFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lecture du dossier", error: err.message });
    }

    res.status(200).json({ files });
  });
});

// GET /api/files/download/:filename
router.get("/download/:filename", verifyToken, (req, res) => {
  const username = req.user.username;
  const filename = req.params.filename;
  const filePath = path.join("/mnt/drive_data", username, filename);

  // Vérifie que le fichier existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Fichier introuvable" });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      res.status(500).json({ message: "Erreur lors du téléchargement", error: err.message });
    }
  });
});

// DELETE /api/files/:filename
router.delete("/:filename", verifyToken, (req, res) => {
  const username = req.user.username;
  const filename = req.params.filename;
  const filePath = path.join("/mnt/drive_data", username, filename);

  // Vérifie que le fichier existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Fichier introuvable" });
  }

  // Supprime le fichier
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
    }

    res.status(200).json({ message: "Fichier supprimé avec succès" });
  });
});

// GET /api/files/stats
router.get("/stats", verifyToken, (req, res) => {
  const username = req.user.username;
  const userFolder = path.join("/mnt/drive_data", username);

  if (!fs.existsSync(userFolder)) {
    return res.status(200).json({ totalFiles: 0, totalSizeBytes: 0 });
  }

  fs.readdir(userFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lecture dossier", error: err.message });
    }

    let totalSize = 0;
    let pending = files.length;

    if (pending === 0) {
      return res.status(200).json({ totalFiles: 0, totalSizeBytes: 0 });
    }

    files.forEach((file) => {
      const filePath = path.join(userFolder, file);
      fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
          totalSize += stats.size;
        }
        pending--;
        if (pending === 0) {
          res.status(200).json({
            totalFiles: files.length,
            totalSizeBytes: totalSize,
            totalSizeHuman: `${(totalSize / (1024 * 1024)).toFixed(2)} Mo`,
          });
        }
      });
    });
  });
});

module.exports = router;
