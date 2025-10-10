# 🐟 Gestionnaire de Poissonnerie

Une application web moderne et complète pour la gestion d'une poissonnerie, développée avec Next.js 15, TypeScript et Tailwind CSS.

## ✨ Fonctionnalités

### 🔐 Système d'Authentification
- **Authentification sécurisée** avec gestion des rôles
- **Deux types d'utilisateurs :**
  - **Administrateur** : Accès complet à toutes les fonctionnalités
  - **Vendeur** : Accès limité aux ventes et au stock
- **Protection des routes** basée sur les rôles

### 📊 Dashboard Analytique
- **Vue d'ensemble** de l'activité avec statistiques en temps réel
- **Métriques clés :**
  - Ventes du jour, semaine et mois
  - Valeur totale du stock
  - Performance par vendeur
- **Graphiques interactifs** pour la visualisation des données

### 🐠 Gestion des Produits
- **Catalogue de produits** avec images et catégories
- **Gestion complète :** ajout, modification, suppression
- **Catégories disponibles :**
  - Poisson frais (Thiof, Dorade)
  - Fruits de mer (Crevettes)
  - Poisson congelé (Saumon)
- **Suivi des prix** par kilogramme

### 💰 Gestion des Ventes
- **Enregistrement des ventes** avec détails complets
- **Calcul automatique** du prix total
- **Historique des transactions** avec filtrage par date
- **Association vendeur-produit** pour le suivi des performances

### 📦 Gestion du Stock
- **Suivi en temps réel** des quantités disponibles
- **Alertes de stock faible** pour éviter les ruptures
- **Mise à jour automatique** lors des ventes
- **Valorisation du stock** en temps réel

### 👥 Gestion des Vendeurs (Nouveau !)
- **Interface d'administration** pour gérer les vendeurs
- **Ajout de nouveaux vendeurs** avec validation des données
- **Statistiques par vendeur** (ventes totales, nombre de transactions)
- **Gestion des rôles** et permissions

## 🎨 Design & UX

### Interface Moderne
- **Design épuré** avec palette de couleurs professionnelle
- **Animations fluides** et transitions élégantes
- **Effets visuels** modernes (gradients, ombres, hover effects)
- **Interface responsive** adaptée à tous les appareils

### Thème Personnalisé
- **Couleurs optimisées** pour le secteur de la poissonnerie
- **Mode sombre** supporté
- **Typographie** soignée avec Inter font
- **Composants UI** cohérents (shadcn/ui)

## 🚀 Technologies Utilisées

### Frontend
- **Next.js 15** - Framework React moderne
- **TypeScript** - Typage statique pour plus de sécurité
- **Tailwind CSS** - Framework CSS utilitaire
- **Radix UI** - Composants accessibles de haute qualité

### État & Données
- **Zustand** - Gestion d'état légère et performante
- **React Hook Form** - Gestion des formulaires
- **date-fns** - Manipulation des dates

### Développement
- **Turbopack** - Bundler ultra-rapide pour le développement
- **ESLint** - Linting du code
- **PostCSS** - Traitement CSS avancé

## 📁 Structure du Projet

```
fish-shop-app/
├── app/                          # Pages Next.js App Router
│   ├── dashboard/               # Page principale du tableau de bord
│   ├── login/                   # Page de connexion
│   ├── produits/                # Gestion des produits
│   ├── stock/                   # Gestion du stock
│   ├── vendeurs/                # Gestion des vendeurs (nouveau)
│   ├── ventes/                  # Gestion des ventes
│   ├── globals.css              # Styles globaux personnalisés
│   ├── layout.tsx               # Layout racine
│   └── page.tsx                 # Page d'accueil
├── components/                  # Composants React réutilisables
│   ├── ui/                     # Composants UI de base (shadcn/ui)
│   ├── app-sidebar.tsx         # Sidebar de navigation
│   ├── dashboard-stats.tsx     # Statistiques du dashboard
│   ├── product-form.tsx        # Formulaire de produit
│   └── [autres composants...]
├── lib/                        # Utilitaires et configuration
│   ├── auth.tsx               # Système d'authentification
│   ├── store.ts               # Store Zustand avec données mockées
│   └── utils.ts               # Fonctions utilitaires
├── hooks/                     # Hooks personnalisés
├── public/                    # Assets statiques
└── styles/                    # Styles globaux
```

## 🛠️ Installation & Démarrage

### Prérequis
- **Node.js** 18+
- **npm** ou **yarn**

### Installation

```bash
# Cloner le projet
git clone [url-du-repo]
cd fish-shop-app

# Installer les dépendances
npm install

# Démarrer le serveur de développement (avec Turbopack)
npm run dev

# Construire pour la production
npm run build

# Démarrer en production
npm start
```

### Comptes de Test

#### Administrateur
- **Username :** `admin`
- **Mot de passe :** `admin123`

#### Vendeur
- **Username :** `vendeur1`
- **Mot de passe :** `vendeur123`

## 📈 Performances

### Optimisations Implémentées
- **Turbopack** activé pour un développement ultra-rapide
- **Images optimisées** avec Next.js Image
- **CSS purgé** avec Tailwind CSS
- **Tree shaking** automatique
- **Code splitting** intelligent

### Temps de Chargement
- **Développement :** Rechargement instantané avec Turbopack
- **Production :** Optimisé avec Next.js 15

## 🔒 Sécurité

### Mesures de Sécurité
- **Validation des données** côté client et serveur
- **Protection CSRF** automatique avec Next.js
- **Sécurisation des routes** basée sur les rôles
- **Stockage sécurisé** des sessions utilisateur
- **Validation des formulaires** complète

## 🌟 Fonctionnalités Avancées

### Gestion des Données
- **Persistance locale** avec Zustand Persist
- **Données mockées** pour le développement
- **Structure évolutive** prête pour une API

### Accessibilité
- **Navigation au clavier** complète
- **Contraste des couleurs** optimisé
- **Labels et descriptions** pour les screen readers
- **Focus management** automatique

## 🚧 Développement Futur

### Évolutions Possibles
- [ ] **API REST** pour connecter une vraie base de données
- [ ] **Rapports PDF** pour les ventes et stocks
- [ ] **Notifications push** pour les alertes de stock
- [ ] **Application mobile** React Native
- [ ] **Module de facturation** intégré
- [ ] **Analyse prédictive** des ventes
- [ ] **Intégration WhatsApp** pour les commandes

## 📞 Support

Pour toute question ou problème :
- Créer une **issue** sur le repository
- Consulter la **documentation** des composants utilisés
- Vérifier les **scripts npm** disponibles

## 📄 Licence

Ce projet est développé pour la gestion d'une poissonnerie locale et peut être adapté selon les besoins spécifiques.

---

**Développé avec ❤️ pour la gestion moderne des poissonneries**