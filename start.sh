#!/bin/bash

# Script de démarrage pour PoissyShop (Frontend + Backend)
# Utilise concurrently pour démarrer les deux services en parallèle

echo "🚀 Démarrage de PoissyShop (Frontend + Backend)"
echo ""

# Vérifier si concurrently est installé globalement
if ! command -v concurrently &> /dev/null; then
    echo "❌ concurrently n'est pas installé. Installez-le avec : npm install -g concurrently"
    exit 1
fi

# Vérifier si les répertoires existent
if [ ! -d "frontend" ]; then
    echo "❌ Dossier frontend non trouvé"
    exit 1
fi

if [ ! -d "backend" ]; then
    echo "❌ Dossier backend non trouvé"
    exit 1
fi

# Fonction pour vérifier si MongoDB est disponible
check_mongodb() {
    if command -v mongosh &> /dev/null; then
        if mongosh --eval "db.adminCommand('ping')" mongodb://127.0.0.1:27017/poissyshop --quiet &> /dev/null; then
            return 0
        fi
    fi
    return 1
}

echo "📋 Vérifications préalables..."

# Vérifier MongoDB
if check_mongodb; then
    echo "✅ MongoDB est accessible"
else
    echo "⚠️  MongoDB n'est pas accessible. Assurez-vous qu'il tourne sur localhost:27017"
    echo "   Lancez : docker compose -f backend/docker-compose.yml up -d"
fi

echo ""
echo "🔧 Installation des dépendances..."

# Installer les dépendances du backend si nécessaire
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installation des dépendances backend..."
    cd backend && npm install && cd ..
fi

# Installer les dépendances du frontend si nécessaire
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "🌱 Import des données de démonstration dans MongoDB..."
cd backend && npm run seed && cd ..

echo ""
echo "🚀 Démarrage des services..."
echo ""
echo "📱 Frontend : http://localhost:3000"
echo "🔧 Backend  : http://localhost:4000"
echo "📚 Docs API : http://localhost:4000/docs"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les services"
echo ""

# Démarrer les deux services en parallèle
concurrently \
    --names "frontend,backend" \
    --prefix name \
    --prefix-colors "cyan,magenta" \
    "cd frontend && npm run dev" \
    "cd backend && npm run dev"