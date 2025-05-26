# 🔗 Plan d'intégration Frontend ↔️ Backend – Projet Google Drive Personnel

## 🎯 Objectif

Créer une interface web moderne et intuitive permettant à un utilisateur :
- De s'enregistrer et se connecter.
- De visualiser ses fichiers et dossiers.
- D'uploader, télécharger, supprimer et partager des fichiers.
- De visualiser l'espace de stockage utilisé.

---

## 🌐 API Backend disponible (Node.js + Express + MongoDB)

Toutes les routes sont en JSON. Base URL : `http://localhost:5000`

### 🔐 Authentification

| Méthode | Route       | Description                |
|--------|-------------|----------------------------|
| POST   | /register    | Enregistrement utilisateur |
| POST   | /login       | Connexion, retourne un token JWT |

**Token JWT** : à inclure dans le header des requêtes protégées :
```
Authorization: Bearer <token>
```

---

### 📁 Fichiers

| Méthode | Route               | Description                  |
|--------|---------------------|------------------------------|
| GET    | /files/list         | Liste des fichiers utilisateur (option : dossier courant) |
| POST   | /files/upload       | Upload de fichier (multipart/form-data) |
| GET    | /files/:id          | Télécharger un fichier       |
| DELETE | /files/:id          | Supprimer un fichier         |

---

### 📂 Dossiers

| Méthode | Route               | Description         |
|--------|---------------------|---------------------|
| POST   | /folders/create     | Créer un dossier    |

---

### 👥 Partage

| Méthode | Route               | Description                        |
|--------|---------------------|------------------------------------|
| POST   | /share/:id          | Partager un fichier/dossier        |

---

### 📊 Statistiques

| Méthode | Route               | Description         |
|--------|---------------------|---------------------|
| GET    | /stats              | Espace utilisé, nombre de fichiers |

---

## 🗂️ Structure minimale du frontend à prévoir

- **Login / Register Page**
- **Dashboard** :
  - Liste des fichiers/dossiers
  - Bouton Upload
  - Bouton Créer dossier
  - Espace utilisé
- **Viewer** :
  - Affichage/preview possible ?
  - Téléchargement
  - Suppression
  - Partage

---

## 🔧 Détails techniques

- **Framework suggéré** : React (ou Vue)
- **Connexion API** : via `fetch` ou Axios
- **Stockage du token JWT** : `localStorage` ou `sessionStorage`
- **Routing interne** : React Router ou équivalent
- **Sécurité** : protéger les routes par vérification de token

---

## 📞 Communication

Le backend sera disponible en local sur `localhost:5000`, ou sur un réseau interne (si partagé). En cas de CORS, une configuration sera ajoutée.

---

## ✅ À discuter ensemble

- Besoins UI/UX
- Gestion des erreurs (ex : quota atteint)
- Prévisualisation fichiers supportés (PDF, image ?)
- Responsive design / mobile ?

---

## 🧪 Tests

Utiliser Postman ou Swagger pour tester les routes pendant le dev. Le backend peut simuler des erreurs (ex : mauvaise authentification, fichier manquant, etc.)
