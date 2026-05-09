# PoissyShop - Gestion de poissonnerie

PoissyShop est une application web de gestion opérationnelle pour poissonnerie. Le projet couvre les flux essentiels d'un point de vente : authentification, tableau de bord, catalogue produits, ventes au kilo, suivi du stock, clients et notifications.

## Architecture

Le projet suit une architecture microservices avec séparation claire entre frontend et backend :

- **Frontend** : Application Next.js dans le dossier `frontend/`
- **Backend** : API REST Node.js/Express avec MongoDB dans le dossier `backend/`

Cette architecture permet une évolutivité et une maintenance facilitée, avec possibilité de déploiement séparé des services.

## Stack

### Frontend
| Couche | Technologies |
| --- | --- |
| Framework | Next.js 15, React 18, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Radix UI, Lucide React |
| State | Zustand |
| Graphiques | Recharts |
| Formulaires | React Hook Form, Zod |
| Authentification | Client-side (localStorage) |

### Backend
| Couche | Technologies |
| --- | --- |
| Runtime | Node.js, TypeScript |
| Framework | Express.js |
| Base de données | MongoDB + Mongoose |
| Authentification | JWT + bcrypt |
| Validation | Zod |
| Sécurité | Helmet, CORS, rate limiting |
| Documentation | Swagger UI |
| Données | Migration depuis fichier JSON vers MongoDB |

## Fonctionnalités

### Authentification et permissions

- Connexion client-side via `lib/auth.tsx`.
- Sessions stockées dans `localStorage` sous `fish_shop_user`.
- Deux rôles applicatifs : `admin` et `vendeur`.
- Protection de pages via `components/protected-route.tsx`.
- Navigation filtrée par rôle dans `components/app-sidebar.tsx`.

Comptes de test :

| Rôle | Identifiant | Mot de passe |
| --- | --- | --- |
| Administrateur | `admin` | `admin123` |
| Vendeur | `vendeur1` | `vendeur123` |

Note sécurité : les identifiants sont mockés côté client avec un encodage base64. Ce n'est pas une authentification production.

### Tableau de bord

- KPIs d'activité dans `components/dashboard-stats.tsx`.
- Graphique de revenus avec Recharts.
- Top produits vendus.
- Ventes récentes.
- Alertes de stock faible.

### Produits

- Liste, recherche, tri et pagination côté API.
- Création, modification et suppression de produits.
- Champs principaux : nom, catégorie, prix au kg, quantité en stock, image.
- Accès réservé au rôle `admin`.

### Ventes

- Enregistrement d'une vente au kilo depuis `components/sale-form.tsx`.
- Support de plusieurs lignes produits dans une même saisie.
- Calcul automatique du total par ligne et du total global.
- Vérification du stock disponible côté formulaire.
- Historique des ventes dans `components/sales-history.tsx`.
- Accès aux rôles `admin` et `vendeur`.

Point d'attention actuel : après la création d'une vente, le formulaire appelle directement `/api/sales`, puis appelle aussi `addSale`, qui poste à nouveau vers `/api/sales`. Cela peut créer des ventes en double. À corriger avant production.

### Stock

- Consultation des quantités disponibles.
- Mise à jour du stock via l'endpoint produit.
- Décrémentation après vente.
- Alertes visuelles pour les produits sous seuil.
- Accès aux rôles `admin` et `vendeur`.

### Clients et notifications

- Gestion des clients avec recherche, tri et pagination.
- Préférences produits par client.
- Notifications manuelles, promotions et réapprovisionnement.
- Ciblage de tous les clients actifs ou de clients correspondant aux préférences produit.
- Historique des notifications.
- Accès réservé au rôle `admin` via la navigation.

### Vendeurs

- Page d'administration des vendeurs.
- Données actuellement mockées dans `app/vendeurs/page.tsx`.
- Statistiques locales simulées : total vendeurs, ventes totales, moyenne par vendeur.

## Architecture

```txt
Poissonnerie/
├── frontend/                      # Application Next.js
│   ├── app/                       # Pages Next.js App Router
│   │   ├── api/                   # API routes (legacy - proxy vers backend)
│   │   ├── clients/               # Clients + notifications
│   │   ├── dashboard/             # Analytics opérationnelles
│   │   ├── login/                 # Connexion
│   │   ├── produits/              # Catalogue produits
│   │   ├── stock/                 # Stock
│   │   ├── vendeurs/              # Gestion vendeurs mockée
│   │   └── ventes/                # Création et historique de ventes
│   ├── components/                # Composants React
│   │   ├── ui/                    # Composants shadcn/Radix
│   │   ├── app-sidebar.tsx        # Navigation par rôle
│   │   ├── protected-route.tsx    # Guard client-side
│   │   ├── sale-form.tsx          # Formulaire de vente multi-lignes
│   │   └── ...
│   ├── lib/                       # Utilitaires et logique métier
│   │   ├── auth.tsx               # Auth mock + contexte React
│   │   ├── store.ts               # Store Zustand et appels API
│   │   ├── types.ts               # Types métier partagés
│   │   └── ...
│   ├── data/                      # Données de démonstration (JSON)
│   ├── public/                    # Images produits et assets statiques
│   └── DESIGN.md                  # Documentation du design system
├── backend/                       # API REST Node.js/Express
│   ├── src/
│   │   ├── controllers/           # Handlers HTTP
│   │   ├── models/                # Schémas Mongoose
│   │   ├── routes/                # Routage REST
│   │   ├── middlewares/           # Auth, validation, sécurité
│   │   ├── services/              # Logique métier
│   │   ├── schemas/               # Validation Zod
│   │   ├── docs/                  # Swagger
│   │   └── utils/
│   ├── docker-compose.yml         # MongoDB local
│   └── .env.example               # Variables d'environnement
└── README.md                      # Documentation principale
```

## Modèle de données

Les types métier principaux sont définis dans `lib/types.ts`.

```ts
interface Product {
  id: number
  nom: string
  categorie: string
  prix_kg: number
  quantite_stock: number
  image: string
  created_at?: string
  updated_at?: string
}

interface Sale {
  id: number
  produit_id: number
  produit_nom: string
  poids_kg: number
  prix_total: number
  date_vente: string
  vendeur_id: number
  vendeur_nom: string
  created_at?: string
}

interface Client {
  id: number
  nom: string
  prenom: string
  telephone: string
  email: string
  adresse: string
  preferences: string[]
  actif: boolean
  created_at: string
  updated_at: string
}

interface Notification {
  id: number
  type: "restock" | "promotion" | "manual"
  titre: string
  message: string
  produits: string[]
  destinataires_type: "all" | "cibles"
  destinataires_ids: number[]
  envoye_par: string
  created_at: string
  lu: boolean
}
```

Relations métier :

```txt
User 1 ──< Sale
Product 1 ──< Sale
Client N ──< Notification via destinataires_ids
Product N ──< Notification via produits
```

## APIs

### Frontend (Legacy - Next.js API Routes)
Les API routes Next.js dans `frontend/app/api/` servent actuellement de proxy vers le backend Express. Elles maintiennent la compatibilité avec l'interface existante.

### Backend (Express.js - Production)
API REST complète avec authentification JWT, validation Zod et persistance MongoDB.

| Route | Méthodes | Description |
| --- | --- | --- |
| `/api/auth/login` | `POST` | Authentification utilisateur |
| `/api/auth/register` | `POST` | Enregistrement utilisateur |
| `/api/initial-data` | `GET` | Données initiales du store frontend |
| `/api/products` | `GET`, `POST` | Liste paginée et création produit |
| `/api/products/:id` | `PUT`, `DELETE` | Modification/suppression produit |
| `/api/sales` | `GET`, `POST` | Liste et création de ventes |
| `/api/clients` | `GET`, `POST` | Liste paginée et création client |
| `/api/clients/:id` | `GET`, `PUT`, `DELETE` | CRUD client |
| `/api/notifications` | `GET`, `POST`, `PUT` | Historique, création, statut lu |
| `/api/notifications/send` | `POST` | Notification de réapprovisionnement |

**Sécurité** : Authentification JWT, validation Zod, rate limiting, CORS, headers de sécurité.

## Design system

Le design system est documenté dans `DESIGN.md` et implémenté principalement dans `app/globals.css`.

Principes actuels :

- Interface SaaS opérationnelle, claire et dense.
- Couleurs en OKLCH avec tokens Tailwind v4.
- Sidebar responsive desktop/mobile.
- Cartes, tableaux, formulaires, tabs, dialogs et feedback toast via shadcn/ui.
- Icônes Lucide pour la navigation et les actions.
- Graphiques Recharts pour les vues analytiques.

## Installation et démarrage

### Prérequis

- Node.js 18+
- npm ou pnpm
- Docker (pour MongoDB local)

### Configuration

1. **Backend** :
```bash
cd backend
npm install
cp .env.example .env
# Modifier .env avec vos configurations
```

2. **Frontend** :
```bash
cd frontend
npm install
```

### Démarrage

1. **Base de données** (dans `backend/`) :
```bash
docker compose up -d
```

2. **Backend** (port 4000) :
```bash
cd backend
npm run seed  # Importer données depuis frontend/data/data.json
npm run dev
```

3. **Frontend** (port 3000) :
```bash
cd frontend
npm run dev
```

### URLs locales

- **Frontend** : `http://localhost:3000`
- **Backend API** : `http://localhost:4000/api`
- **Documentation API** : `http://localhost:4000/docs` (Swagger UI)

### Variables d'environnement

#### Backend (`.env`)
```env
PORT=4000
API_PREFIX=/api
MONGODB_URI=mongodb://localhost:27017/poissyshop
JWT_SECRET=votre-secret-jwt-long-et-complexe
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
AUTH_REQUIRED=true
SALE_DECREMENTS_STOCK=true
```

#### Frontend (optionnel)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Scripts disponibles

#### Frontend (`frontend/`)
| Script | Description |
| --- | --- |
| `npm run dev` | Démarre Next.js en développement |
| `npm run build` | Compile l'application |
| `npm run start` | Lance la version production |
| `npm run lint` | Vérification du code |

#### Backend (`backend/`)
| Script | Description |
| --- | --- |
| `npm run dev` | Démarre Express avec tsx watch |
| `npm run build` | Compile TypeScript |
| `npm run start` | Lance la version production |
| `npm run seed` | Importe données depuis JSON vers MongoDB |
| `npm run lint` | Vérification ESLint |

## Données de démonstration

Le fichier `data/data.json` contient actuellement :

- 2 utilisateurs.
- 4 produits.
- 21 ventes.
- 4 clients.
- 3 notifications.

Ce fichier est modifié directement par les API routes lors des créations, mises à jour et suppressions.

## Analyse technique

### Points solides

- **Architecture modulaire** : Séparation claire frontend/backend facilitant la maintenance et l'évolutivité
- **TypeScript end-to-end** : Types partagés entre frontend et backend assurant la cohérence
- **Design system cohérent** : UI/UX unifiée avec shadcn/ui et Tailwind CSS
- **Sécurité renforcée** : Authentification JWT, validation Zod, middlewares de sécurité
- **Documentation API** : Swagger UI pour faciliter l'intégration et les tests
- **Base de données moderne** : MongoDB avec Mongoose pour une persistance scalable

### Améliorations apportées

- ✅ Migration de la persistance JSON vers MongoDB
- ✅ Authentification serveur avec JWT au lieu du stockage localStorage uniquement
- ✅ Validation serveur complète avec Zod
- ✅ Séparation des responsabilités entre contrôleurs, services et modèles
- ✅ Architecture prête pour le multi-tenant

### Points d'attention restants

- 🔄 Migration progressive des appels API frontend vers le backend
- 🔄 Nettoyage du flux de vente (double appel API)
- 🔄 Tests automatisés à implémenter
- 🔄 Configuration de production et déploiement

## État du projet

### ✅ Implémenté

- Architecture microservices (frontend Next.js + backend Express/MongoDB)
- API REST complète avec authentification JWT
- Migration des données JSON vers MongoDB
- Validation Zod côté serveur
- Sécurité (Helmet, CORS, rate limiting)
- Documentation Swagger
- Authentification et autorisation par rôles

### 🔄 En cours

- Migration progressive du frontend vers les APIs backend
- Nettoyage du double appel API dans le flux de vente
- Tests d'intégration pour les endpoints critiques

### 📋 Feuille de route

#### Priorité 1 - Migration et intégration

- Configurer le proxy Next.js vers le backend Express
- Migrer tous les appels API frontend vers le backend
- Supprimer les API routes Next.js legacy
- Tester l'intégration complète frontend/backend

#### Priorité 2 - Tests et qualité

- Ajouter des tests unitaires (Jest/Vitest)
- Tests d'intégration pour les flux métier critiques
- Tests end-to-end avec Playwright
- Configuration CI/CD

#### Priorité 3 - Architecture SaaS multi-tenant

- Introduire une entité `tenant` ou `shop`
- Ajouter `tenant_id` sur toutes les entités
- Isoler les requêtes par tenant
- Rôles par boutique : owner, manager, seller
- Audit log pour les actions sensibles

#### Priorité 4 - Fonctionnalités produit

- Export PDF/CSV des rapports
- Notifications réelles (email/SMS/WhatsApp)
- Gestion des fournisseurs et réapprovisionnements
- Inventaires et ajustements de stock
- Analytics avancées par période/vendeur/produit

#### Priorité 5 - Production et déploiement

- Containerisation complète (Docker)
- Configuration production (PM2, nginx)
- Monitoring et logging
- Backup et récupération des données
- Sécurité avancée (HTTPS, secrets management)

## Captures d'écran

Des captures sont référencées dans `screenshots/`. Voir `screenshots/README.md` pour le suivi des visuels.

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Structure des commits

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` modification de documentation
- `style:` formatage, points-virgules, etc.
- `refactor:` refactorisation de code
- `test:` ajout ou modification de tests
- `chore:` tâches de maintenance

## Licence

Projet privé de démonstration. Voir `backend/LICENSE` et `frontend/LICENSE` pour les détails.
