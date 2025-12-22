# 💸 Finance Tracker - Application complète de gestion financière

Application full-stack de gestion financière avec authentification, dashboard, transactions, objectifs et rappels.

## 📁 Structure du projet

```
finance-/
├── frontend/              # Application React (Vite + Tailwind)
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── contexts/     # Context API (Auth, Data)
│   │   ├── pages/        # Pages (Login, Register, Dashboard)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # API Node.js/Express
│   ├── controllers/      # Contrôleurs
│   ├── middleware/       # Middleware (auth, etc.)
│   ├── models/          # Modèles de données
│   ├── routes/          # Routes API
│   ├── server.js        # Point d'entrée
│   └── package.json
│
├── html-version/        # Version HTML/JS vanilla (standalone)
│   ├── mk.html         # Dashboard
│   ├── login.html      # Page de connexion
│   ├── register.html   # Page d'inscription
│   └── js/
│       └── app.js      # Logique JavaScript
│
└── README.md           # Ce fichier
```

## 🚀 Démarrage rapide

### Option 1: Version React (Recommandé)

**Frontend React:**
```bash
cd frontend
npm install
npm run dev
```
→ Application accessible sur `http://localhost:3000`

**Backend Node.js (optionnel):**
```bash
cd backend
npm install
npm run dev
```
→ API accessible sur `http://localhost:5000`

### Option 2: Version HTML standalone

**Démarrer un serveur local:**
```bash
cd html-version
python -m http.server 8080
```
→ Application accessible sur `http://localhost:8080/login.html`

## ✨ Fonctionnalités

### 🔐 Authentification
- ✅ Inscription avec validation de mot de passe
- ✅ Connexion sécurisée
- ✅ Déconnexion
- ✅ Routes protégées
- ✅ Stockage localStorage (frontend) / JWT (backend)

### 📊 Dashboard
- ✅ Cartes de statistiques (revenus, dépenses, économies)
- ✅ Graphique circulaire des dépenses par catégorie
- ✅ Liste des transactions récentes
- ✅ Actions rapides (ajout revenus/dépenses)

### 💰 Gestion financière
- ✅ Ajout de revenus
- ✅ Ajout de dépenses avec catégories
- ✅ Historique complet des transactions
- ✅ Filtres par catégorie et date

### 🎯 Objectifs financiers
- ✅ Création d'objectifs avec montant cible
- ✅ Suivi de progression avec barre interactive
- ✅ Mise à jour en temps réel
- ✅ Date limite optionnelle

### ⏰ Rappels
- ✅ Création de rappels programmés
- ✅ Notifications (date + heure)
- ✅ Notes optionnelles
- ✅ Suppression facile

### 📁 Organisation
- ✅ Dossiers de reçus colorés
- ✅ Scanner OCR (Tesseract.js) - version HTML
- ✅ Notes rapides
- ✅ Calculatrice intégrée

## 🛠️ Technologies

### Frontend React
- **React 18** - Framework UI
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation
- **Context API** - Gestion d'état
- **Tailwind CSS** - Styling moderne
- **Chart.js** - Graphiques
- **Font Awesome** - Icônes

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **JWT** - Authentification
- **bcryptjs** - Hachage de mots de passe
- **CORS** - Gestion des requêtes cross-origin

### Version HTML
- **Vanilla JavaScript** - Pas de framework
- **Tailwind CSS** - Styling
- **Chart.js** - Graphiques
- **Tesseract.js** - OCR pour les reçus
- **localStorage** - Persistance des données

## 📱 Design responsive

✅ Mobile (320px+)
✅ Tablette (768px+)
✅ Desktop (1024px+)

## 🎨 Personnalisation

### Couleurs
Les couleurs principales peuvent être modifiées dans:
- `frontend/tailwind.config.js`
- `frontend/src/index.css`

### Thèmes
L'application supporte le mode clair par défaut. Le mode sombre peut être ajouté.

## 📄 API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Transactions
- `GET /api/transactions` - Liste des transactions
- `POST /api/transactions` - Ajouter une transaction
- `DELETE /api/transactions/:id` - Supprimer

### Goals
- `GET /api/goals` - Liste des objectifs
- `POST /api/goals` - Créer un objectif
- `PUT /api/goals/:id` - Mettre à jour
- `DELETE /api/goals/:id` - Supprimer

### Reminders
- `GET /api/reminders` - Liste des rappels
- `POST /api/reminders` - Créer un rappel
- `DELETE /api/reminders/:id` - Supprimer

### Folders & Notes
- `GET /api/folders` - Dossiers
- `GET /api/notes` - Notes
- `POST /api/notes` - Créer une note

## 🔧 Scripts disponibles

### Frontend
```bash
npm run dev      # Démarre le serveur de développement
npm run build    # Compile pour la production
npm run preview  # Prévisualise le build de production
```

### Backend
```bash
npm run dev      # Démarre le serveur avec nodemon
npm start        # Démarre le serveur en production
```

## 📦 Déploiement

### Frontend (Vercel/Netlify)
1. Build de production: `npm run build`
2. Déployer le dossier `dist/`

### Backend (Railway/Render/Heroku)
1. Configurer les variables d'environnement
2. Déployer depuis GitHub ou CLI

## 📄 License

MIT

## 👨‍💻 Auteur

Finance Tracker - Projet personnel
