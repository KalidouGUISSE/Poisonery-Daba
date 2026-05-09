# PoissyShop Backend

Backend REST séparé pour le frontend PoissyShop existant. Il reprend les contrats `/api/...` utilisés par l'application Next.js et ajoute une vraie couche serveur : MongoDB, JWT, validation, sécurité, services, contrôleurs et documentation Swagger.

## Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT + bcrypt
- Zod pour la validation
- Helmet, CORS, rate limiting, compression
- Swagger UI

## Structure

```txt
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/          # env, database
│   ├── controllers/     # handlers HTTP
│   ├── docs/            # Swagger
│   ├── middlewares/     # auth, validation, errors, security
│   ├── models/          # Mongoose schemas
│   ├── routes/          # REST routing
│   ├── schemas/         # Zod validation schemas
│   ├── services/        # business logic
│   ├── scripts/         # seed
│   └── utils/
├── docker-compose.yml
├── .env.example
└── package.json
```

## Installation

```bash
cd backend
npm install
cp .env.example .env
```

Démarrer MongoDB :

```bash
docker compose up -d
```

Importer les données actuelles du frontend depuis `../data/data.json` :

```bash
npm run seed
```

Démarrer en développement :

```bash
npm run dev
```

API :

```txt
http://localhost:4000/api
```

Swagger :

```txt
http://localhost:4000/docs
```

## Variables d'environnement

| Variable | Description |
| --- | --- |
| `PORT` | Port du backend, défaut `4000` |
| `API_PREFIX` | Préfixe REST, défaut `/api` |
| `MONGODB_URI` | URI MongoDB |
| `JWT_SECRET` | Secret de signature JWT |
| `JWT_EXPIRES_IN` | Durée du token, défaut `7d` |
| `CORS_ORIGIN` | Origines autorisées, exemple `http://localhost:3000` |
| `AUTH_REQUIRED` | `false` pour compatibilité immédiate avec le frontend actuel, `true` pour imposer JWT |
| `SALE_DECREMENTS_STOCK` | `false` tant que le frontend appelle `updateStock` après vente, `true` après nettoyage du flux vente |

Le frontend actuel n'envoie pas encore de header `Authorization`. Pour cette raison, `AUTH_REQUIRED=false` permet de consommer les endpoints directement pendant la migration. Une fois le frontend branché sur `/api/auth/login`, passer `AUTH_REQUIRED=true`.

Le frontend actuel met aussi le stock à jour après la création de vente. Pour éviter une double décrémentation, `SALE_DECREMENTS_STOCK=false` par défaut. Quand `components/sale-form.tsx` sera corrigé pour laisser le backend gérer vente + stock, passer cette variable à `true`.

## Intégration avec le frontend Next.js

Le frontend appelle aujourd'hui des API routes internes comme `/api/products`. Deux options :

1. Ajouter un proxy Next.js vers le backend dans `next.config.mjs`.
2. Remplacer les appels `fetch('/api/...')` par une variable `NEXT_PUBLIC_API_URL`.

Exemple de proxy Next.js :

```js
async rewrites() {
  return [
    {
      source: "/api/:path*",
      destination: "http://localhost:4000/api/:path*",
    },
  ]
}
```

## Authentification

### POST `/api/auth/login`

Request :

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response :

```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "nom": "Administrateur"
  },
  "token": "jwt-token"
}
```

Header pour les routes protégées quand `AUTH_REQUIRED=true` :

```txt
Authorization: Bearer jwt-token
```

### POST `/api/auth/register`

```json
{
  "username": "vendeur2",
  "password": "vendeur123",
  "role": "vendeur",
  "nom": "Vendeur 2"
}
```

## Endpoints compatibles frontend

| Route | Méthodes | Description |
| --- | --- | --- |
| `/api/initial-data` | `GET` | Données initiales du store frontend |
| `/api/products` | `GET`, `POST` | Liste paginée et création produit |
| `/api/products/:id` | `PUT`, `DELETE` | Modification/suppression produit |
| `/api/sales` | `GET`, `POST` | Liste et création de ventes |
| `/api/clients` | `GET`, `POST` | Liste paginée et création client |
| `/api/clients/:id` | `GET`, `PUT`, `DELETE` | CRUD client |
| `/api/notifications` | `GET`, `POST`, `PUT` | Historique, création, statut lu |
| `/api/notifications/send` | `POST` | Notification de réapprovisionnement |

## Exemples API

### Lister les produits

```bash
curl "http://localhost:4000/api/products?page=1&limit=10&sortBy=nom&sortOrder=asc&search=thiof"
```

Response :

```json
{
  "products": [
    {
      "id": 1,
      "nom": "Thiof",
      "categorie": "Poisson frais",
      "prix_kg": 2500,
      "quantite_stock": 12,
      "image": "/fresh-thiof-fish.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false,
    "totalProducts": 1
  }
}
```

### Créer un produit

```bash
curl -X POST "http://localhost:4000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Bar",
    "categorie": "Poisson frais",
    "prix_kg": 3500,
    "quantite_stock": 10,
    "image": "/bar.jpg"
  }'
```

### Créer une vente multi-produits

```bash
curl -X POST "http://localhost:4000/api/sales" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "produit_id": 1,
        "produit_nom": "Thiof",
        "poids_kg": 2,
        "prix_total": 5000,
        "vendeur_id": 1,
        "vendeur_nom": "Administrateur"
      }
    ]
  }'
```

Avec `SALE_DECREMENTS_STOCK=true`, la création d'une vente décrémente le stock avec une mise à jour atomique conditionnelle par produit (`quantite_stock >= poids_kg`). Pour une garantie transactionnelle multi-produits stricte, utiliser MongoDB en replica set et adapter le service vente avec une transaction.

### Créer un client

```bash
curl -X POST "http://localhost:4000/api/clients" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Ndiaye",
    "prenom": "Awa",
    "telephone": "771112233",
    "email": "awa@example.com",
    "adresse": "Dakar",
    "preferences": ["Thiof", "Crevettes"],
    "actif": true
  }'
```

### Envoyer une notification

```bash
curl -X POST "http://localhost:4000/api/notifications" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "promotion",
    "titre": "Offre spéciale",
    "message": "Promotion sur les poissons frais.",
    "produits": ["Thiof"],
    "destinataires_type": "all",
    "destinataires_ids": []
  }'
```

### Notification de réapprovisionnement

```bash
curl -X POST "http://localhost:4000/api/notifications/send" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [{ "id": 1, "nom": "Thiof" }],
    "sendToAll": false,
    "envoyePar": "Administrateur"
  }'
```

## Sécurité

- Hash des mots de passe avec bcrypt.
- JWT signé côté serveur.
- CORS configurable.
- Helmet pour les headers HTTP.
- Rate limiting global.
- Validation Zod sur body, query et params.
- Middleware d'erreurs centralisé.
- Rôles `admin` et `vendeur` préparés sur les routes sensibles.

## Notes de production

- Passer `AUTH_REQUIRED=true`.
- Utiliser un `JWT_SECRET` long et aléatoire.
- Héberger MongoDB sur un service managé ou un cluster sécurisé.
- Ajouter une stratégie de refresh token si les sessions longues sont nécessaires.
- Ajouter des tests d'intégration sur ventes, stock et notifications.
- Utiliser un replica set MongoDB si les transactions multi-documents deviennent obligatoires.
