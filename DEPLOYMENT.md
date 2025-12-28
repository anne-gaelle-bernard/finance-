# Guide de Déploiement - Application Finance

## ✅ État actuel du déploiement

### Backend (Railway)
- URL: https://finance-production-b622.up.railway.app
- Status: ✅ Déployé et fonctionnel
- Database: MongoDB Atlas (cluster0.ottcut8.mongodb.net)

### Frontend
- Status: 🔄 Prêt pour déploiement Vercel
- Intégration API: ✅ Complète

## 🔧 Variables d'environnement configurées

### Backend (Railway) - DÉJÀ CONFIGURÉ

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://Annefinance:Mahlika.16@cluster0.ottcut8.mongodb.net/Finance?retryWrites=true&w=majority
JWT_SECRET=5cd7e37a-8791-4d66-8d5c-514831dc4dc6
CLIENT_URL=http://localhost:3000
```

**⚠️ À METTRE À JOUR après déploiement Vercel:**
```
CLIENT_URL=https://votre-projet.vercel.app
```

### Frontend Variables - DÉJÀ CONFIGURÉ

Fichier `.env.production` dans frontend:

```
VITE_API_URL=https://finance-production-b622.up.railway.app/api
```

Fichier `.env.local` pour développement local:
```
VITE_API_URL=http://localhost:5000/api
```

## 📋 Déploiement Frontend sur Vercel (ÉTAPES À SUIVRE)

### 1. Créer le projet sur Vercel

1. Allez sur https://vercel.com
2. Cliquez sur "Add New Project"
3. Importez le repo: `anne-gaelle-bernard/finance-`

### 2. Configuration du projet

- **Framework Preset**: Vite
- **Root Directory**: `frontend` ⚠️ TRÈS IMPORTANT!
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Variables d'environnement

Ajoutez cette variable:
```
VITE_API_URL=https://finance-production-b622.up.railway.app/api
```

### 4. Déployer

- Cliquez sur "Deploy"
- Attendez 2-3 minutes
- Récupérez l'URL de déploiement

### 5. Mise à jour du Backend (Railway)

Après avoir obtenu l'URL Vercel (ex: https://finance-xyz.vercel.app):

1. Allez sur Railway dashboard
2. Sélectionnez votre projet
3. Variables → Modifier CLIENT_URL:
   ```
   CLIENT_URL=https://finance-xyz.vercel.app
   ```
4. Le backend redémarrera automatiquement

## 🧪 Tests après déploiement

### 1. Test Backend
```bash
curl https://finance-production-b622.up.railway.app/api/health
```

Résultat attendu:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### 2. Test Frontend
1. Allez sur votre URL Vercel
2. Créez un compte
3. Ajoutez une transaction
4. Vérifiez dans MongoDB Atlas que les données sont sauvegardées

### 3. Vérification MongoDB
- URL: https://cloud.mongodb.com
- Database: Finance
- Collection: transactions / users
- Vérifiez que vos données apparaissent

## 🔄 Flux de données complet

```
Utilisateur (Vercel)
    ↓
    ↓ HTTPS Request
    ↓
React Frontend (Vercel)
    ↓
    ↓ axios + JWT Token
    ↓
Express Backend (Railway)
    ↓
    ↓ Mongoose ODM
    ↓
MongoDB Atlas (Cloud)
```

## 📝 Fonctionnalités implémentées

✅ **Authentification**
- Inscription/Connexion avec JWT
- Stockage sécurisé dans MongoDB
- Token valide 7 jours

✅ **Gestion des données**
- Transactions (Create, Read, Update, Delete)
- Dossiers (CRUD)
- Objectifs (CRUD)
- Rappels (CRUD)
- Notes (CRUD)

✅ **Import/Export**
- Import CSV → Backend → MongoDB
- Export depuis MongoDB → CSV

✅ **Interface**
- Dashboard avec statistiques
- Graphiques Chart.js
- Thème clair/sombre
- Responsive design

## 🐛 Dépannage

### Erreur: "Network Error"
**Cause**: Frontend ne peut pas contacter le backend
**Solution**:
1. Vérifiez VITE_API_URL dans Vercel
2. Vérifiez que le backend Railway est en ligne
3. Vérifiez les logs Railway pour erreurs CORS

### Erreur: "Invalid credentials"
**Cause**: Email/mot de passe incorrect
**Solution**:
1. Vérifiez les informations de connexion
2. Créez un nouveau compte si nécessaire
3. Consultez les logs backend Railway

### Erreur: "Token expired"
**Cause**: Le JWT a expiré (>7 jours)
**Solution**: Reconnectez-vous pour obtenir un nouveau token

### Les données ne s'affichent pas
**Cause**: Token manquant ou invalide
**Solution**:
1. Ouvrez la console (F12)
2. Vérifiez localStorage pour le token
3. Reconnectez-vous si nécessaire

## 🔗 URLs importantes

- **Backend Production**: https://finance-production-b622.up.railway.app
- **API Health**: https://finance-production-b622.up.railway.app/api/health
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Railway Dashboard**: https://railway.app
- **GitHub**: https://github.com/anne-gaelle-bernard/finance-

## 🔒 Sécurité

- ✅ Mots de passe hashés (bcrypt)
- ✅ JWT avec secret fort
- ✅ HTTPS en production
- ✅ CORS configuré
- ✅ Variables d'environnement sécurisées
- ⚠️ Ne jamais commit les fichiers .env

## 📞 Commandes utiles

```bash
# Backend
cd backend
npm start

# Frontend (dans un autre terminal)
cd frontend
npm run dev
```

### Tester en local
```bash
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
# Health check: http://localhost:5000/api/health
```

### Voir les logs Railway
1. Allez sur https://railway.app
2. Sélectionnez votre projet
3. Onglet "Deployments" → Logs

### Commit et push
```bash
git add .
git commit -m "Your message"
git push origin main
```

## ✨ Prochaines étapes recommandées

1. **Déployer le frontend sur Vercel** (suivez les étapes ci-dessus)
2. **Mettre à jour CLIENT_URL sur Railway** avec l'URL Vercel
3. **Tester l'application complète** en production
4. **Nettoyer les collections MongoDB** (supprimer les doublons)
5. **Configurer un nom de domaine personnalisé** (optionnel)

## 🎉 Félicitations!

Votre application est maintenant:
- ✅ Connectée à MongoDB Cloud
- ✅ Backend déployé sur Railway
- ✅ Prête pour déploiement frontend sur Vercel
- ✅ Sécurisée avec JWT
- ✅ Prête pour la production
