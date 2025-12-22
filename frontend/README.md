# Finance Tracker - React Frontend

Application React de gestion financière avec authentification, dashboard, transactions, objectifs et rappels.

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📦 Technologies utilisées

- **React 18** - Framework frontend
- **React Router** - Navigation
- **Context API** - Gestion d'état
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Graphiques
- **Font Awesome** - Icônes

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── modals/         # Modaux (ajout expense, income, etc.)
│   ├── Navbar.jsx
│   ├── StatsCards.jsx
│   ├── QuickActions.jsx
│   ├── TransactionList.jsx
│   ├── GoalsList.jsx
│   ├── RemindersList.jsx
│   └── ExpenseChart.jsx
├── contexts/           # Contexts React
│   ├── AuthContext.jsx
│   └── DataContext.jsx
├── pages/             # Pages principales
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── App.jsx           # Composant racine
├── main.jsx          # Point d'entrée
└── index.css         # Styles globaux
```

## ✨ Fonctionnalités

### Authentification
- ✅ Inscription avec validation
- ✅ Connexion
- ✅ Déconnexion
- ✅ Routes protégées
- ✅ Stockage dans localStorage

### Dashboard
- ✅ Cartes de statistiques (revenus, dépenses, économies)
- ✅ Actions rapides
- ✅ Liste des transactions
- ✅ Graphique des dépenses par catégorie
- ✅ Objectifs financiers avec barres de progression
- ✅ Rappels programmés

### Gestion des données
- ✅ Ajout de revenus/dépenses
- ✅ Création d'objectifs financiers
- ✅ Ajout de rappels
- ✅ Données isolées par utilisateur
- ✅ Persistance localStorage

## 🎨 Personnalisation

Les couleurs et thèmes peuvent être modifiés dans :
- `tailwind.config.js` - Configuration Tailwind
- `src/index.css` - Variables CSS et styles globaux

## 📱 Responsive Design

L'application est entièrement responsive et fonctionne sur :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)

## 🔧 Scripts disponibles

```bash
npm run dev      # Démarre le serveur de développement
npm run build    # Compile pour la production
npm run preview  # Prévisualise le build de production
```

## 🌟 Prochaines fonctionnalités

- [ ] Scanner de reçus OCR
- [ ] Export de données
- [ ] Budgets par catégorie
- [ ] Notifications push
- [ ] Mode sombre
- [ ] Intégration backend API
