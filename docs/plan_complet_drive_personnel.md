# 📦 Plan Complet – Projet Google Drive Personnel

## 🧭 Objectif

Créer une plateforme web de type "Google Drive personnel" permettant :
- L'upload, le téléchargement, la suppression et le partage de fichiers
- L'organisation de dossiers
- Une interface simple et sécurisée pour l'utilisateur final
- Une architecture modulaire et extensible (mise à jour future)

---

# 🛠️ I. Architecture Générale

| Élément     | Stack utilisée                        |
|-------------|----------------------------------------|
| Backend     | Node.js + Express + MongoDB            |
| Frontend    | React (ou autre framework JS moderne)  |
| Authentification | JWT + bcrypt                      |
| Stockage    | SSD externe (monté dans `/mnt/drive_data`) |
| OS de dev   | Backend : Ubuntu 20.04 / Frontend : Windows |
| API         | RESTful JSON                           |

---

# 🌐 II. Backend – Détails techniques

## 📁 Routes API (REST)

| Méthode | Route           | Description                          |
|---------|------------------|--------------------------------------|
| POST    | /register         | Enregistrement utilisateur           |
| POST    | /login            | Connexion, retourne token JWT        |
| GET     | /files/list       | Liste fichiers de l'utilisateur      |
| POST    | /files/upload     | Upload fichier (multipart)           |
| GET     | /files/:id        | Télécharger fichier                  |
| DELETE  | /files/:id        | Supprimer fichier                    |
| POST    | /folders/create   | Créer un dossier                     |
| POST    | /share/:id        | Partager un fichier/dossier          |
| GET     | /stats            | Afficher espace utilisé              |

## 🔐 Sécurité

- Token JWT stocké côté frontend
- Vérification par middleware Express
- Mot de passe hashé avec `bcrypt`
- Séparation des fichiers par utilisateur (`/mnt/drive_data/<userId>/`)
- Validation type MIME

## 📂 Structure backend

```
/drive-backend
├── server.js
├── routes/
├── controllers/
├── models/
├── middleware/
├── utils/
├── uploads/
├── .env
```

---

# 🎨 III. Frontend – Détails techniques

## 📄 Pages principales

- `/login` : page de connexion
- `/register` : page d’inscription
- `/dashboard` : liste des fichiers et dossiers
- `/shared` : (optionnel) fichiers partagés
- `/settings` : (optionnel) profil utilisateur

## 🧩 Composants React à prévoir

| Composant         | Rôle                                         |
|-------------------|----------------------------------------------|
| `LoginForm`       | Formulaire de connexion                      |
| `RegisterForm`    | Formulaire d'inscription                     |
| `FileList`        | Liste les fichiers et dossiers               |
| `FileItem`        | Affiche un fichier avec actions              |
| `UploadButton`    | Upload d'un ou plusieurs fichiers            |
| `FolderTree`      | Arborescence virtuelle                       |
| `ShareModal`      | Interface de partage                         |
| `StatsCard`       | Affiche espace utilisé                       |
| `Navbar` / `Sidebar` | Navigation principale                    |

## 🔐 Gestion du token JWT

- Stockage dans `localStorage`
- Redirection vers `/login` si token invalide
- Middleware frontend (HOC ou Context) pour sécuriser les routes

## 📦 Structure projet React

```
/frontend
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/     # appels API
│   ├── utils/
│   ├── App.js
│   ├── index.js
├── .env
```

---

# 🗓️ IV. Plan de travail (Milestones)

## ✅ Phase 1 – Mise en place

- Initialiser le repo (GitHub ou GitLab)
- Setup projet backend (Express, MongoDB, JWT)
- Setup projet frontend (React, routing, context)

## 🔐 Phase 2 – Authentification

- Backend : `/register` + `/login`
- Frontend : formulaires, stockage du token

## 📁 Phase 3 – Fichiers et dossiers

- Upload + affichage + suppression
- Création dossier
- Organisation simple

## 👥 Phase 4 – Partage

- Backend : route `/share/:id`
- Frontend : modal ou interface

## 📊 Phase 5 – Statistiques

- Backend : route `/stats`
- Frontend : affichage dans un `Card`

## 🔄 Phase 6 – Intégration finale

- Tests croisés
- Vérification responsive / UX
- Préparation à un hébergement local ou cloud

---

# ✅ Notes finales

- L’équipe frontend consommera uniquement l’API JSON REST fournie.
- La documentation des routes sera partagée (Swagger ou fichier `.md`)
- La priorité : sécurité, propreté de code, séparation des responsabilités.