// src/routes/files.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

const tempStorage = multer.memoryStorage();
const tempUpload = multer({ storage: tempStorage }).array("file");

const parseForm = multer().none();

router.post("/upload", verifyToken, (req, res) => {
  tempUpload(req, res, (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ message: "Erreur upload", error: uploadErr.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }
    const username = req.user.username;
    const relativePath = req.body.path || "";
    const targetPath = path.join("/mnt/drive_data", username, relativePath);
    try {
      fs.mkdirSync(targetPath, { recursive: true });
    } catch (mkdirErr) {
      return res.status(500).json({ message: "Erreur création dossier", error: mkdirErr.message });
    }
    const uploadedFiles = [];
    let errorDuringWrite = null;
    req.files.forEach((file) => {
      const filePath = path.join(targetPath, file.originalname);
      try {
        fs.writeFileSync(filePath, file.buffer);
        uploadedFiles.push({ filename: file.originalname, path: filePath });
      } catch (err) {
        errorDuringWrite = err;
      }
    });
    if (errorDuringWrite) {
      return res.status(500).json({ message: "Erreur lors de l'écriture d'un ou plusieurs fichiers", error: errorDuringWrite.message });
    }
    res.status(201).json({
      message: "Fichiers uploadés avec succès",
      files: uploadedFiles
    });
  });
});

// Création d'un dossier vide pour l'utilisateur connecté
router.post("/mkdir", verifyToken, parseForm, (req, res) => {
  const username = req.user.username;
  const relativePath = req.body.path || "";
  const targetPath = path.join("/mnt/drive_data", username, relativePath);

  try {
    fs.mkdirSync(targetPath, { recursive: true });
    res.status(201).json({
      message: "Dossier créé avec succès",
      path: targetPath,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la création du dossier",
      error: err.message,
    });
  }
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
