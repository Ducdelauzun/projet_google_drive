# 📦 Backend – Google Drive Personnel

## 🔐 Authentification

### `POST /api/auth/register`
Créer un nouvel utilisateur.

- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "monmotdepasse"
}
```

- **Réponse**:
```json
{ "message": "Utilisateur créé avec succès" }
```

---

### `POST /api/auth/login`
Connecter un utilisateur et recevoir un token JWT.

- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "alice@example.com",
  "password": "monmotdepasse"
}
```

- **Réponse**:
```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "abc123",
    "username": "alice"
  }
}
```

---

### `GET /api/me`
Vérifie l'identité d’un utilisateur connecté.

- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`

- **Réponse**:
```json
{
  "message": "Tu es bien authentifié !",
  "user": {
    "userId": "abc123",
    "username": "alice",
    "iat": 123456,
    "exp": 123999
  }
}
```

---

## 📁 Fichiers

### `POST /api/files/upload`
Uploader un fichier vers `/mnt/drive_data/<username>/`

- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`

- **Body**:
  - Type: `form-data`
  - Clé: `file` (type `File`)

- **Réponse**:
```json
{
  "message": "Fichier uploadé avec succès",
  "filename": "document.pdf",
  "path": "/mnt/drive_data/alice/document.pdf"
}
```

---

### `GET /api/files/list`
Liste les fichiers de l'utilisateur connecté.

- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`

- **Réponse**:
```json
{
  "files": ["document.pdf", "photo.jpg"]
}
```

---

### `GET /api/files/download/:filename`
Télécharge un fichier.

- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`

- **URL Exemple**:
  `/api/files/download/document.pdf`

- **Réponse**: fichier binaire téléchargé

---

### `DELETE /api/files/:filename`
Supprime un fichier.

- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`

- **Réponse**:
```json
{
  "message": "Fichier supprimé avec succès"
}
```

---

### `GET /api/files/stats`
Retourne le nombre total de fichiers et la taille totale.

- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`

- **Réponse**:
```json
{
  "totalFiles": 3,
  "totalSizeBytes": 5242880,
  "totalSizeHuman": "5.00 Mo"
}
```
