# 🎯 Test de l'Application Finance - Stockage MongoDB

## ✅ Ce qui a été configuré

L'application utilise maintenant MongoDB Cloud pour stocker toutes les données:

### Architecture actuelle
```
Frontend (React) → Backend API (Express) → MongoDB Atlas (Cloud)
```

### Changements effectués

1. **AuthContext mis à jour**
   - Utilise maintenant l'API backend pour l'authentification
   - Les utilisateurs sont stockés dans MongoDB (collection `users`)
   - JWT token stocké dans localStorage (validité: 7 jours)

2. **DataContext mis à jour**
   - Toutes les données utilisent l'API backend
   - Plus de localStorage pour les transactions/dossiers/etc
   - Chargement automatique des données après connexion

3. **Collections MongoDB**
   - `users` - Comptes utilisateurs
   - `transactions` - Transactions financières
   - `folders` - Dossiers d'organisation
   - `goals` - Objectifs financiers
   - `reminders` - Rappels
   - `notes` - Notes

## 🧪 Comment tester localement

### 1. Démarrer le backend
```bash
cd backend
npm start
```
✅ Vous devriez voir: "MongoDB Connected: ac-rwy5cnm-shard-00-02.ottcut8.mongodb.net"

### 2. Démarrer le frontend
```bash
cd frontend
npm run dev
```
✅ Ouvrez http://localhost:3000

### 3. Créer un compte
1. Allez sur http://localhost:3000
2. Cliquez sur "S'inscrire"
3. Remplissez le formulaire:
   - Nom: Test User
   - Email: test@example.com
   - Mot de passe: password123

### 4. Vérifier dans MongoDB
1. Allez sur https://cloud.mongodb.com
2. Connectez-vous (Annefinance / Mahlika.16)
3. Database: Finance → Collection: users
4. Vous devriez voir votre utilisateur créé!

### 5. Ajouter une transaction
1. Dans l'application, allez sur "Transactions"
2. Cliquez sur "Nouvelle transaction"
3. Remplissez:
   - Type: Dépense
   - Montant: 50
   - Description: Test Restaurant
   - Catégorie: Food
   - Date: Aujourd'hui

### 6. Vérifier dans MongoDB
1. Retournez sur MongoDB Atlas
2. Collection: transactions
3. Vous devriez voir votre transaction!

## 🔍 Vérifications importantes

### Le token JWT est-il stocké?
Ouvrez la console (F12) et tapez:
```javascript
localStorage.getItem('token')
```
Vous devriez voir un long token JWT

### L'utilisateur est-il connecté?
```javascript
localStorage.getItem('currentUser')
```
Vous devriez voir vos informations utilisateur

### Le backend est-il accessible?
Ouvrez: http://localhost:5000/api/health

Vous devriez voir:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

## 📊 Tester toutes les fonctionnalités

### Transactions
- ✅ Créer une transaction
- ✅ Modifier une transaction
- ✅ Supprimer une transaction
- ✅ Filtrer par catégorie/type/date
- ✅ Import CSV
- ✅ Export CSV

### Dossiers
- ✅ Créer un dossier
- ✅ Ajouter des fichiers
- ✅ Supprimer un dossier

### Objectifs
- ✅ Créer un objectif
- ✅ Mettre à jour la progression
- ✅ Marquer comme complété

### Rappels
- ✅ Créer un rappel
- ✅ Marquer comme fait
- ✅ Supprimer un rappel

### Notes
- ✅ Créer une note
- ✅ Modifier une note
- ✅ Supprimer une note

## 🐛 Dépannage

### Erreur: "Network Error"
**Problème**: Le frontend ne peut pas contacter le backend

**Solution**:
1. Vérifiez que le backend est en cours d'exécution (npm start)
2. Vérifiez l'URL dans la console: doit être http://localhost:5000/api
3. Ouvrez http://localhost:5000/api/health pour tester

### Erreur: "Invalid credentials"
**Problème**: Email/mot de passe incorrect

**Solution**:
1. Vérifiez vos informations
2. Si vous avez oublié, créez un nouveau compte
3. Consultez MongoDB Atlas → users pour voir les comptes existants

### Les données ne s'affichent pas
**Problème**: Pas de token JWT ou token expiré

**Solution**:
1. Ouvrez F12 → Console
2. Tapez: `localStorage.getItem('token')`
3. Si null ou expiré, reconnectez-vous
4. Les données se chargeront automatiquement après connexion

### Erreur: "MongoServerError"
**Problème**: Connexion MongoDB perdue

**Solution**:
1. Vérifiez votre connexion internet
2. Vérifiez que le cluster MongoDB est actif sur Atlas
3. Redémarrez le backend

## 🌐 Déploiement en production

### Backend (Railway) - ✅ DÉPLOYÉ
- URL: https://finance-production-b622.up.railway.app
- Status: Connecté à MongoDB
- Test: https://finance-production-b622.up.railway.app/api/health

### Frontend (Vercel) - 🔄 À DÉPLOYER
Suivez les instructions dans [DEPLOYMENT.md](DEPLOYMENT.md)

## 📞 URLs importantes

- **Frontend local**: http://localhost:3000
- **Backend local**: http://localhost:5000
- **Backend Health**: http://localhost:5000/api/health
- **Backend production**: https://finance-production-b622.up.railway.app
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Documentation**: [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎉 Résultat attendu

Après avoir suivi ces étapes, vous devriez:

✅ Pouvoir créer un compte et vous connecter
✅ Voir vos données stockées dans MongoDB Cloud
✅ Ajouter/modifier/supprimer des transactions
✅ Importer des données CSV
✅ Voir vos statistiques et graphiques
✅ Tout est sauvegardé dans le cloud!

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt
- ✅ JWT pour l'authentification
- ✅ HTTPS en production
- ✅ Variables d'environnement sécurisées
- ✅ CORS configuré

---

**Bon test! 🚀**
