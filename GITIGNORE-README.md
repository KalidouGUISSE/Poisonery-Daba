# 🛡️ Guide des .gitignore - PoissyShop

## Vue d'ensemble

Ce projet utilise une stratégie multi-niveaux pour les fichiers `.gitignore` :

```
Poissonnerie/
├── .gitignore           # 🏠 Racine - Règles générales
├── frontend/.gitignore  # ⚛️  Frontend - Spécifique Next.js
├── backend/.gitignore   # 🔧 Backend - Spécifique Node.js/Prisma
└── check-gitignore.sh   # 🔍 Outil de vérification
```

## Stratégie d'organisation

### 1. `.gitignore` (Racine)
**Portée** : Règles générales applicables à tout le projet
- Frameworks (Next.js, Node.js)
- Environnements (.env*)
- Outils de développement
- Systèmes d'exploitation
- Fichiers temporaires

### 2. `frontend/.gitignore`
**Portée** : Spécifique au frontend Next.js
- Cache Next.js (.next/cache/)
- Build et compilation
- Tests et couverture
- Assets temporaires

### 3. `backend/.gitignore`
**Portée** : Spécifique au backend Node.js
- Prisma (généré automatiquement)
- Logs d'application
- Cache et temporaire
- Tests et déploiement

## Règles importantes

### ❌ NE JAMAIS COMMITTER

```bash
# Dépendances (énormes!)
node_modules/

# Cache Next.js (change constamment)
.next/
.next/cache/

# Fichiers d'environnement
.env*
backend/.env

# Logs et debug
*.log
logs/

# Fichiers système
.DS_Store
Thumbs.db

# Cache et temporaire
.cache/
*.tmp
```

### ✅ À COMMITTER

```bash
# Code source
src/
components/
routes/

# Configuration
package.json
tsconfig.json
prisma/schema.prisma

# Documentation
README.md
*.md

# Scripts
*.sh
```

## Utilisation

### Vérification automatique
```bash
# Vérifier l'état des .gitignore
./check-gitignore.sh
```

### Vérification manuelle
```bash
# Voir les fichiers non trackés
git status --porcelain

# Tester si un fichier est ignoré
git check-ignore path/to/file

# Lister les fichiers trackés
git ls-files
```

### Nettoyage d'urgence
```bash
# Retirer un fichier/dossier du suivi
git rm --cached file_or_folder/

# Retirer tous les .next
git rm -r --cached .next/
```

## Bonnes pratiques

### 1. Vérification avant commit
```bash
git status
git diff --cached
```

### 2. Tests réguliers
```bash
./check-gitignore.sh
```

### 3. Nettoyage périodique
```bash
git gc --prune=now
```

### 4. Gestion des branches
- Garder `main` propre
- Utiliser des branches feature pour les expérimentations

## Résolution de problèmes

### Fichier tracké par erreur
```bash
# Le retirer du suivi
git rm --cached bad_file.txt

# L'ajouter au .gitignore
echo "bad_file.txt" >> .gitignore

# Commiter
git commit -m "Remove bad_file.txt from tracking"
```

### Dossier entier tracké
```bash
# Pour un dossier comme node_modules
git rm -r --cached node_modules/
echo "node_modules/" >> .gitignore
git commit -m "Remove node_modules from tracking"
```

## Métriques de succès

Après optimisation :
- ✅ **Taille repository** : ~3.5 Mo (au lieu de 1.5 Go)
- ✅ **Vitesse de push** : ⚡ Rapide
- ✅ **Fichiers critiques** : Protégés
- ✅ **Maintenance** : Facile

## Maintenance

- **Révision** : Tous les 3 mois
- **Mise à jour** : Lors de nouveaux outils/ajouts
- **Formation** : Expliquer aux nouveaux développeurs

---

**Résultat** : Repository propre, rapide et sécurisé ! 🎉