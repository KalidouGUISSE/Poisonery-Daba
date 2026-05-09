#!/bin/bash

# Script de vérification du .gitignore pour PoissyShop
# Vérifie que les fichiers sensibles ne sont pas trackés

echo "🔍 Vérification du .gitignore - PoissyShop"
echo "=========================================="

# Fonction pour vérifier si un fichier est ignoré
check_ignored() {
    local file="$1"
    if git check-ignore "$file" 2>/dev/null; then
        echo "✅ $file - Correctement ignoré"
    else
        echo "❌ $file - PAS ignoré (problème!)"
        return 1
    fi
}

# Fonction pour vérifier si un fichier est tracké
check_tracked() {
    local file="$1"
    if git ls-files "$file" 2>/dev/null | grep -q "$file"; then
        echo "❌ $file - Tracké (ne devrait pas l'être!)"
        return 1
    else
        echo "✅ $file - Non tracké"
    fi
}

echo ""
echo "📁 Vérifications des dossiers critiques:"
echo "--------------------------------------"

# Vérifier les dossiers qui doivent être ignorés
check_ignored "node_modules/"
check_ignored ".next/"
check_ignored "frontend/.next/"
check_ignored "backend/node_modules/"
check_ignored "frontend/node_modules/"

echo ""
echo "🔐 Vérifications des fichiers sensibles:"
echo "---------------------------------------"

# Vérifier les fichiers d'environnement
check_ignored ".env"
check_ignored ".env.local"
check_ignored "backend/.env"
check_ignored "frontend/.env.local"

echo ""
echo "📊 Statistiques du repository:"
echo "-----------------------------"

# Afficher les statistiques
git count-objects -vH

echo ""
echo "📂 Fichiers trackés suspects:"
echo "----------------------------"

# Chercher des fichiers suspects
git ls-files | grep -E "\.(log|tmp|cache|DS_Store|swp|swo)$" | head -10

echo ""
echo "💡 Conseils:"
echo "------------"
echo "- Si des fichiers '❌' apparaissent, ajoutez-les au .gitignore approprié"
echo "- Vérifiez régulièrement avec ce script"
echo "- Commitez uniquement les fichiers nécessaires au projet"
echo ""
echo "✅ Vérification terminée!"