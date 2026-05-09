import swaggerJSDoc from "swagger-jsdoc"

// Configuration Swagger centralisée et simplifiée
const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PoissyShop API",
      version: "1.0.0",
      description: `
# 🐟 PoissyShop - API de Gestion de Poissonnerie

API REST complète pour la gestion opérationnelle d'une poissonnerie utilisant **Prisma ORM** et **PostgreSQL**.

## 🎯 Fonctionnalités

- **Authentification JWT** avec rôles (admin/vendeur)
- **Gestion des produits** avec inventaire et catégories
- **Suivi des ventes** avec mise à jour automatique du stock
- **Base clients** avec préférences produits
- **Système de notifications** pour communications et alertes

## 🔐 Authentification

Tous les endpoints (sauf login/register) nécessitent un token JWT dans le header :
\`\`\`
Authorization: Bearer <token>
\`\`\`

## 📊 Pagination

Les endpoints de liste supportent la pagination :
- \`page\`: numéro de page (défaut: 1)
- \`limit\`: éléments par page (défaut: 10, max: 100)

## 🔍 Recherche et Tri

- \`search\`: recherche textuelle dans les champs appropriés
- \`sortBy\`: champ de tri
- \`sortOrder\`: ordre de tri (asc/desc)

## 🗄️ Base de Données

- **ORM**: Prisma 5.22.0
- **Base**: PostgreSQL
- **Utilisateur**: kalidou/kalidou123
      `,
      contact: {
        name: "Équipe PoissyShop",
        email: "contact@poissyshop.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Types de base réutilisables
        Id: {
          type: "integer",
          minimum: 1,
          example: 1,
        },
        Price: {
          type: "number",
          format: "float",
          minimum: 0,
          example: 2500.50,
        },
        Weight: {
          type: "number",
          format: "float",
          minimum: 0,
          example: 2.5,
        },

        // Enums
        UserRole: {
          type: "string",
          enum: ["admin", "vendeur"],
          example: "admin",
        },
        NotificationType: {
          type: "string",
          enum: ["restock", "promotion", "manual"],
          example: "restock",
        },

        // Modèles principaux
        User: {
          type: "object",
          properties: {
            id: { $ref: "#/components/schemas/Id" },
            username: { type: "string", example: "admin" },
            role: { $ref: "#/components/schemas/UserRole" },
            nom: { type: "string", example: "Administrateur" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },

        Product: {
          type: "object",
          properties: {
            id: { $ref: "#/components/schemas/Id" },
            nom: { type: "string", example: "Thiof" },
            categorie: { type: "string", example: "Poisson frais" },
            prix_kg: { $ref: "#/components/schemas/Price" },
            quantite_stock: { $ref: "#/components/schemas/Weight" },
            image: { type: "string", example: "/fresh-thiof-fish.jpg" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },

        Client: {
          type: "object",
          properties: {
            id: { $ref: "#/components/schemas/Id" },
            nom: { type: "string", example: "Ndiaye" },
            prenom: { type: "string", example: "Awa" },
            telephone: { type: "string", example: "771112233" },
            email: { type: "string", example: "awa@example.com" },
            adresse: { type: "string", example: "Dakar" },
            preferences: {
              type: "array",
              items: { type: "string" },
              example: ["Thiof", "Crevettes"],
            },
            actif: { type: "boolean", example: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },

        Sale: {
          type: "object",
          properties: {
            id: { $ref: "#/components/schemas/Id" },
            produit_id: { $ref: "#/components/schemas/Id" },
            produit_nom: { type: "string", example: "Thiof" },
            poids_kg: { $ref: "#/components/schemas/Weight" },
            prix_total: { $ref: "#/components/schemas/Price" },
            date_vente: { type: "string", format: "date-time" },
            vendeur_id: { $ref: "#/components/schemas/Id" },
            vendeur_nom: { type: "string", example: "Administrateur" },
            created_at: { type: "string", format: "date-time" },
          },
        },

        Notification: {
          type: "object",
          properties: {
            id: { $ref: "#/components/schemas/Id" },
            type: { $ref: "#/components/schemas/NotificationType" },
            titre: { type: "string", example: "Réapprovisionnement disponible" },
            message: { type: "string", example: "Les produits suivants sont maintenant disponibles" },
            produits: {
              type: "array",
              items: { type: "string" },
              example: ["Thiof", "Crevettes"],
            },
            destinataires_type: {
              type: "string",
              enum: ["all", "cibles"],
              example: "all",
            },
            destinataires_ids: {
              type: "array",
              items: { $ref: "#/components/schemas/Id" },
              example: [1, 2, 3],
            },
            envoye_par: { type: "string", example: "Administrateur" },
            created_at: { type: "string", format: "date-time" },
            lu: { type: "boolean", example: false },
          },
        },

        // Schémas de requête
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "admin" },
            password: { type: "string", example: "admin123" },
          },
        },

        LoginResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
            token: { type: "string", example: "jwt-token-here" },
          },
        },

        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Message d'erreur descriptif" },
          },
        },
      },
      parameters: {
        // Paramètres de path
        idParam: {
          name: "id",
          in: "path",
          required: true,
          schema: { $ref: "#/components/schemas/Id" },
          description: "ID de la ressource",
        },

        // Paramètres de query pour pagination
        pageParam: {
          name: "page",
          in: "query",
          schema: { type: "integer", minimum: 1, default: 1 },
          description: "Numéro de la page",
        },

        limitParam: {
          name: "limit",
          in: "query",
          schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          description: "Nombre d'éléments par page",
        },

        // Paramètres de recherche
        searchParam: {
          name: "search",
          in: "query",
          schema: { type: "string" },
          description: "Recherche textuelle",
        },
      },
    },

    // Définition des chemins (endpoints)
    paths: {
      // Authentification
      "/auth/login": {
        post: {
          tags: ["Authentification"],
          summary: "Connexion utilisateur",
          description: "Authentifie un utilisateur et retourne un token JWT",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Connexion réussie",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" },
                },
              },
            },
            400: { description: "Données manquantes" },
            401: { description: "Identifiants invalides" },
          },
        },
      },

      "/auth/register": {
        post: {
          tags: ["Authentification"],
          summary: "Inscription utilisateur",
          description: "Crée un nouveau compte utilisateur (réservé aux administrateurs)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["username", "password", "role"],
                  properties: {
                    username: { type: "string", example: "vendeur2" },
                    password: { type: "string", example: "vendeur123" },
                    role: { $ref: "#/components/schemas/UserRole" },
                    nom: { type: "string", example: "Vendeur 2" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Utilisateur créé",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/User" } },
              },
            },
            400: { description: "Données invalides" },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
            409: { description: "Utilisateur existe déjà" },
          },
        },
      },

      // Produits
      "/products": {
        get: {
          tags: ["Produits"],
          summary: "Lister les produits",
          description: "Récupère la liste des produits avec pagination, recherche et tri",
          parameters: [
            { $ref: "#/components/parameters/pageParam" },
            { $ref: "#/components/parameters/limitParam" },
            { $ref: "#/components/parameters/searchParam" },
          ],
          responses: {
            200: {
              description: "Liste des produits récupérée",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      products: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Product" },
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          page: { type: "integer" },
                          limit: { type: "integer" },
                          totalProducts: { type: "integer" },
                          totalPages: { type: "integer" },
                          hasNextPage: { type: "boolean" },
                          hasPrevPage: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Produits"],
          summary: "Créer un produit",
          description: "Ajoute un nouveau produit au catalogue (réservé aux administrateurs)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["nom", "categorie", "prix_kg", "quantite_stock"],
                  properties: {
                    nom: { type: "string", example: "Bar" },
                    categorie: { type: "string", example: "Poisson frais" },
                    prix_kg: { $ref: "#/components/schemas/Price" },
                    quantite_stock: { $ref: "#/components/schemas/Weight" },
                    image: { type: "string", example: "/bar.jpg" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Produit créé",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Product" } },
              },
            },
            400: { description: "Données invalides" },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
          },
        },
      },

      "/products/{id}": {
        get: {
          tags: ["Produits"],
          summary: "Récupérer un produit",
          description: "Retourne les détails d'un produit spécifique",
          parameters: [{ $ref: "#/components/parameters/idParam" }],
          responses: {
            200: {
              description: "Produit trouvé",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Product" } },
              },
            },
            404: { description: "Produit non trouvé" },
          },
        },
        put: {
          tags: ["Produits"],
          summary: "Mettre à jour un produit",
          description: "Modifie les informations d'un produit existant",
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: "#/components/parameters/idParam" }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nom: { type: "string", example: "Nouveau nom" },
                    categorie: { type: "string", example: "Poisson frais" },
                    prix_kg: { $ref: "#/components/schemas/Price" },
                    quantite_stock: { $ref: "#/components/schemas/Weight" },
                    image: { type: "string", example: "/new-image.jpg" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Produit mis à jour",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Product" } },
              },
            },
            400: { description: "Données invalides" },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
            404: { description: "Produit non trouvé" },
          },
        },
        delete: {
          tags: ["Produits"],
          summary: "Supprimer un produit",
          description: "Supprime un produit du catalogue (réservé aux administrateurs)",
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: "#/components/parameters/idParam" }],
          responses: {
            200: {
              description: "Produit supprimé",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Product" } },
              },
            },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
            404: { description: "Produit non trouvé" },
          },
        },
      },

      // Clients
      "/clients": {
        get: {
          tags: ["Clients"],
          summary: "Lister les clients",
          description: "Récupère la liste des clients avec pagination et recherche",
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: "#/components/parameters/pageParam" },
            { $ref: "#/components/parameters/limitParam" },
            { $ref: "#/components/parameters/searchParam" },
          ],
          responses: {
            200: {
              description: "Liste des clients récupérée",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      clients: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Client" },
                      },
                      pagination: { type: "object" },
                    },
                  },
                },
              },
            },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
          },
        },
        post: {
          tags: ["Clients"],
          summary: "Créer un client",
          description: "Ajoute un nouveau client à la base de données",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["nom", "prenom", "telephone"],
                  properties: {
                    nom: { type: "string", example: "Ndiaye" },
                    prenom: { type: "string", example: "Awa" },
                    telephone: { type: "string", example: "771112233" },
                    email: { type: "string", example: "awa@example.com" },
                    adresse: { type: "string", example: "Dakar" },
                    preferences: {
                      type: "array",
                      items: { type: "string" },
                      example: ["Thiof", "Crevettes"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Client créé",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Client" } },
              },
            },
            400: { description: "Données invalides" },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
          },
        },
      },

      "/clients/{id}": {
        get: {
          tags: ["Clients"],
          summary: "Récupérer un client",
          description: "Retourne les détails d'un client spécifique",
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: "#/components/parameters/idParam" }],
          responses: {
            200: {
              description: "Client trouvé",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Client" } },
              },
            },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
            404: { description: "Client non trouvé" },
          },
        },
        put: {
          tags: ["Clients"],
          summary: "Mettre à jour un client",
          description: "Modifie les informations d'un client existant",
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: "#/components/parameters/idParam" }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nom: { type: "string", example: "Nouveau nom" },
                    prenom: { type: "string", example: "Nouveau prénom" },
                    telephone: { type: "string", example: "771112233" },
                    email: { type: "string", example: "nouveau@email.com" },
                    adresse: { type: "string", example: "Nouvelle adresse" },
                    preferences: {
                      type: "array",
                      items: { type: "string" },
                      example: ["Nouveau produit"],
                    },
                    actif: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Client mis à jour",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Client" } },
              },
            },
            400: { description: "Données invalides" },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
            404: { description: "Client non trouvé" },
          },
        },
        delete: {
          tags: ["Clients"],
          summary: "Supprimer un client",
          description: "Supprime un client de la base de données",
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: "#/components/parameters/idParam" }],
          responses: {
            200: {
              description: "Client supprimé",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Client" } },
              },
            },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
            404: { description: "Client non trouvé" },
          },
        },
      },

      // Ventes
      "/sales": {
        get: {
          tags: ["Ventes"],
          summary: "Lister les ventes",
          description: "Récupère la liste des ventes avec pagination",
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: "#/components/parameters/pageParam" },
            { $ref: "#/components/parameters/limitParam" },
          ],
          responses: {
            200: {
              description: "Liste des ventes récupérée",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      sales: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Sale" },
                      },
                      pagination: { type: "object" },
                    },
                  },
                },
              },
            },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
          },
        },
        post: {
          tags: ["Ventes"],
          summary: "Créer une vente",
          description: "Enregistre une nouvelle vente avec mise à jour automatique du stock",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateSaleRequest" },
                example: {
                  produit_id: 1,
                  produit_nom: "Thiof",
                  poids_kg: 2,
                  prix_total: 5000,
                  vendeur_id: 1,
                  vendeur_nom: "Administrateur",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Vente créée avec succès",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Sale" } },
              },
            },
            400: { description: "Données invalides ou stock insuffisant" },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
          },
        },
      },

      "/sales/{id}": {
        get: {
          tags: ["Ventes"],
          summary: "Récupérer une vente",
          description: "Retourne les détails d'une vente spécifique",
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: "#/components/parameters/idParam" }],
          responses: {
            200: {
              description: "Vente trouvée",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Sale" } },
              },
            },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
            404: { description: "Vente non trouvée" },
          },
        },
      },

      // Notifications
      "/notifications": {
        get: {
          tags: ["Notifications"],
          summary: "Lister les notifications",
          description: "Récupère la liste des notifications avec pagination",
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: "#/components/parameters/pageParam" },
            { $ref: "#/components/parameters/limitParam" },
          ],
          responses: {
            200: {
              description: "Liste des notifications récupérée",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      notifications: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Notification" },
                      },
                      pagination: { type: "object" },
                    },
                  },
                },
              },
            },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
          },
        },
        post: {
          tags: ["Notifications"],
          summary: "Créer une notification",
          description: "Crée une nouvelle notification manuelle",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateNotificationRequest" },
                example: {
                  type: "promotion",
                  titre: "Offre spéciale",
                  message: "Promotion sur les poissons frais ce weekend !",
                  produits: ["Thiof"],
                  destinataires_type: "all",
                  envoye_par: "Administrateur",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Notification créée",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Notification" } },
              },
            },
            400: { description: "Données invalides" },
            401: { description: "Non autorisé" },
            403: { description: "Permissions insuffisantes" },
          },
        },
      },

      // Données initiales
      "/initial-data": {
        get: {
          tags: ["Données Initiales"],
          summary: "Récupérer les données initiales",
          description: "Retourne toutes les données nécessaires au chargement initial du frontend",
          responses: {
            200: {
              description: "Données récupérées avec succès",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      products: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Product" },
                      },
                      users: {
                        type: "array",
                        items: { $ref: "#/components/schemas/User" },
                      },
                      sales: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Sale" },
                      },
                      clients: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Client" },
                      },
                      notifications: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Notification" },
                      },
                    },
                  },
                },
              },
            },
            500: { description: "Erreur interne du serveur" },
          },
        },
      },
    },
  },
  apis: [], // Vide car on définit tout inline
}

export const swaggerSpec = swaggerJSDoc(swaggerConfig)