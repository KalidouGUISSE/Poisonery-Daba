# 📚 Documentation Swagger PoissyShop

## Architecture Centralisée

La documentation Swagger de PoissyShop utilise une **architecture centralisée** dans un seul fichier `swagger.ts` pour une meilleure maintenabilité.

### Structure

```
backend/src/docs/
├── swagger.ts          # Configuration Swagger centralisée
└── README.md          # Cette documentation
```

### Avantages

- ✅ **Maintenance simplifiée** : Un seul fichier à modifier
- ✅ **Réutilisation des composants** : Schémas et paramètres partagés
- ✅ **Cohérence** : Formatage et structure uniformes
- ✅ **Performance** : Pas de fragmentation des fichiers
- ✅ **Évolutivité** : Facile d'ajouter de nouveaux endpoints

### Composants Réutilisables

#### Schémas de Base
- `Id` : Identifiant numérique
- `Price` : Prix monétaire
- `Weight` : Poids en kilogrammes
- `Email` : Adresse email
- `Phone` : Numéro de téléphone

#### Enums
- `UserRole` : admin, vendeur
- `NotificationType` : restock, promotion, manual

#### Modèles Principaux
- `User` : Utilisateur avec rôle
- `Product` : Produit avec stock et prix
- `Client` : Client avec préférences
- `Sale` : Vente avec références produit/vendeur
- `Notification` : Communication système

#### Paramètres Communs
- `pageParam` : Pagination
- `limitParam` : Limite d'éléments
- `searchParam` : Recherche textuelle
- `idParam` : Identifiant de ressource

### Ajout d'un Nouvel Endpoint

1. **Définir le schéma** (si nouveau) dans la section `components.schemas`
2. **Ajouter le chemin** dans `paths` avec la structure :
   ```typescript
   "/endpoint": {
     get: { // ou post, put, delete
       tags: ["TagName"],
       summary: "Titre court",
       description: "Description détaillée",
       parameters: [], // Paramètres si nécessaire
       requestBody: {}, // Pour POST/PUT
       responses: {
         200: { description: "Succès" },
         400: { description: "Erreur" },
         // ...
       }
     }
   }
   ```

3. **Utiliser les références** : `$ref: "#/components/schemas/SchemaName"`

### Bonnes Pratiques

- **Tags cohérents** : Utiliser les tags définis (Authentification, Produits, etc.)
- **Descriptions claires** : Expliquer le but et les paramètres
- **Exemples pertinents** : Fournir des exemples réalistes
- **Codes d'erreur** : Documenter tous les codes HTTP possibles
- **Sécurité** : Ajouter `security: [{ bearerAuth: [] }]` pour les endpoints protégés

### Accès à la Documentation

- **URL** : `http://localhost:4000/docs`
- **Format** : Interface Swagger UI interactive
- **Export** : Possibilité d'exporter en JSON/YAML

### Maintenance

- **Mise à jour** : Modifier uniquement `swagger.ts`
- **Validation** : Tester les endpoints après modification
- **Versionning** : Le numéro de version est dans `info.version`

Cette architecture centralisée assure une documentation API professionnelle, maintenable et évolutive ! 🚀