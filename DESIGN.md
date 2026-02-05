# 🎨 Système de Design — PoissyShop

> Documentation du système de design pour l'application de gestion de poissonnerie

---

## 📋 Table des Matières

1. [Principes de Design](#1-principes-de-design)
2. [Système de Couleurs](#2-système-de-couleurs)
3. [Typographie](#3-typographie)
4. [Espacement et Grille](#4-espacement-et-grille)
5. [Composants UI](#5-composants-ui)
6. [Micro-interactions](#6-micro-interactions)
7. [Responsive Design](#7-responsive-design)
8. [Accessibilité](#8-accessibilité)

---

## 1. Principes de Design

### 1.1 Philosophie

Le design de PoissyShop repose sur trois principes fondamentaux :

- **Clarté** : Interface épurée avec hiérarchie visuelle claire
- **Cohérence** : Éléments réutilisables avec comportement prévisible
- **Efficacité** : Actions accessibles en minimum de clics

### 1.2 Style Visuel

| Aspect | Spécification |
|--------|---------------|
| **Ambiance** | Professionnelle, moderne, marine |
| **Formes** | Arrondies (radius: 12px) |
| **Profondeur** | Ombres subtiles, gradients légers |
| **Textures** | Effets glassmorphism discrets |

---

## 2. Système de Couleurs

### 2.1 Palette Principale

```css
:root {
  /* Bleu Océan — Couleur primaire */
  --color-primary: oklch(0.55 0.22 240);      /* #4A90D9 */
  --color-primary-light: oklch(0.65 0.18 240); /* Plus clair */
  --color-primary-dark: oklch(0.45 0.25 240);  /* Plus foncé */

  /* Blancs & Gris */
  --color-background: oklch(0.99 0.005 240);  /* #FDFDFF */
  --color-surface: oklch(1 0 0);              /* #FFFFFF */
  --color-border: oklch(0.92 0.01 240);        /* #E8E8EC */

  /* Texte */
  --color-text-primary: oklch(0.15 0.02 240);  /* #262626 */
  --color-text-secondary: oklch(0.55 0.05 240);/* #737373 */
  --color-text-muted: oklch(0.75 0.05 240);   /* #A3A3A3 */
}
```

### 2.2 Couleurs Sémantiques

| Usage | Couleur | Variable CSS |
|-------|---------|--------------|
| **Succès** | Vert émeraude | `--color-success: oklch(0.70 0.20 145)` |
| **Avertissement** | Orange doux | `--color-warning: oklch(0.75 0.15 70)` |
| **Erreur** | Rouge clair | `--color-error: oklch(0.55 0.22 25)` |
| **Information** | Bleu ciel | `--color-info: oklch(0.60 0.15 210)` |

### 2.3 Gradients

```css
/* Header de la sidebar */
--gradient-primary: linear-gradient(
  135deg,
  oklch(0.55 0.22 240) 0%,
  oklch(0.60 0.18 200) 100%
);

/* Accent pour les cartes */
--gradient-card: linear-gradient(
  180deg,
  oklch(1 0 0) 0%,
  oklch(0.98 0.01 240) 100%
);
```

### 2.4 Utilisation des Couleurs

```tsx
// Bouton primaire
<button className="bg-primary text-white hover:bg-primary/90">
  Action principale
</button>

// Carte avec gradient subtil
<div className="bg-gradient-to-b from-card to-card/50">
  Contenu
</div>

// Badge de statut
<span className="bg-success/10 text-success px-2 py-1 rounded">
  En stock
</span>
```

---

## 3. Typographie

### 3.1 Police Principale

| Propriété | Valeur |
|-----------|--------|
| **Famille** | Inter (Google Fonts) |
| **Weights** | 400 (regular), 500 (medium), 600 (semibold), 700 (bold) |
| **Base size** | 16px |
| **Line height** | 1.5 |

### 3.2 Échelle Typographique

```css
/* Ratio: 1.25 (Major Third) */

.text-xs    { font-size: 0.75rem;   /* 12px */ }
.text-sm    { font-size: 0.875rem;  /* 14px */ }
.text-base  { font-size: 1rem;      /* 16px */ }
.text-lg    { font-size: 1.125rem;  /* 18px */ }
.text-xl    { font-size: 1.25rem;   /* 20px */ }
.text-2xl   { font-size: 1.5rem;    /* 24px */ }
.text-3xl   { font-size: 1.875rem; /* 30px */ }
.text-4xl   { font-size: 2.25rem;   /* 36px */ }
```

### 3.3 Styles de Texte

```tsx
// Titres de page
<h1 className="text-3xl font-bold text-foreground">
  Dashboard
</h1>

// Sous-titres
<p className="text-muted-foreground text-lg">
  Vue d'ensemble de votre activité
</p>

// Texte de carte
<p className="text-sm text-muted-foreground">
  Métrique secondaire
</p>

// Texte mis en valeur
<span className="font-semibold text-primary">
  Valeur importante
</span>
```

---

## 4. Espacement et Grille

### 4.1 Système d'Espacement

```css
/* Base: 8px */
.space-1  { gap: 0.25rem;  /* 4px  */ }
.space-2  { gap: 0.5rem;   /* 8px  */ }
.space-3  { gap: 0.75rem;  /* 12px */ }
.space-4  { gap: 1rem;     /* 16px */ }
.space-6  { gap: 1.5rem;   /* 24px */ }
.space-8  { gap: 2rem;     /* 32px */ }
.space-12 { gap: 3rem;     /* 48px */ }
.space-16 { gap: 4rem;     /* 64px */ }
```

### 4.2 Grille de Layout

```tsx
// Container principal (max-width: 1280px)
<div className="max-w-7xl mx-auto p-8">
  {children}
</div>

// Colonnes responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {children}
</div>
```

### 4.3 Marges Standard

| Contexte | Margin |
|----------|--------|
| Page → contenu principal | `p-8` (32px) |
| Cartes → intérieur | `p-6` (24px) |
| Éléments de formulaire | `space-y-4` (16px) |
| Items de liste | `space-y-2` (8px) |
| Sidebar → width | `w-64` (256px) |

---

## 5. Composants UI

### 5.1 Cartes (Cards)

```tsx
import { Card } from "@/components/ui/card"

<Card className="card-hover bg-gradient-to-br from-card to-card/50 border-border/50">
  <CardHeader>
    <CardTitle>Titre de la carte</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu de la carte
  </CardContent>
</Card>
```

**Styles CSS :**

```css
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### 5.2 Boutons

```tsx
// Primaire
<Button>Action principale</Button>

// Secondaire
<Button variant="secondary">Action secondaire</Button>

// Outline
<Button variant="outline">Contour</Button>

// Ghost (subtil)
<Button variant="ghost">Sans fond</Button>

// Destructive
<Button variant="destructive">Supprimer</Button>

// Avec icône
<Button>
  <Icon className="mr-2 h-4 w-4" />
  Libellé
</Button>
```

### 5.3 Tableaux

```tsx
<Table>
  <TableHeader>
    <TableRow className="border-border hover:bg-transparent">
      <TableHead>Colonne 1</TableHead>
      <TableHead>Colonne 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="border-border hover:bg-muted/30">
      <TableCell>Donnée 1</TableCell>
      <TableCell>Donnée 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 5.4 Formulaires

```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="field">Libellé du champ</Label>
    <Input id="field" placeholder="Placeholder" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="select">Sélection</Label>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Choisir..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
```

### 5.5 Badges

```tsx
// Par défaut
<Badge>Statut</Badge>

// Secondaire
<Badge variant="secondary">Catégorie</Badge>

// Outline
<Badge variant="outline">Label</Badge>

// Destructive
<Badge variant="destructive">Erreur</Badge>

// Avec couleur sémantique
<span className="bg-success/10 text-success px-2 py-1 rounded text-sm">
  En stock
</span>
```

---

## 6. Micro-interactions

### 6.1 Transitions

```css
/* Transition standard */
.transition-all {
  transition: all 0.2s ease;
}

/* Transition rapide (boutons) */
.transition-fast {
  transition: all 0.15s ease;
}

/* Transition lente (cartes) */
.transition-slow {
  transition: all 0.3s ease;
}
```

### 6.2 Animations

```css
/* Pulse pour les indicateurs */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Shimmer pour les skeleton loaders */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.shimmer {
  background: linear-gradient(90deg, transparent, oklch(0.9 0.02 240), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
```

### 6.3 Feedbacks Visuels

```tsx
// Chargement avec skeleton
<div className="space-y-4">
  <div className="h-4 bg-muted rounded shimmer" />
  <div className="h-4 bg-muted rounded shimmer w-3/4" />
</div>

// Bouton avec spinner
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Chargement...
</Button>

// Toast de notification
<Toaster />
```

### 6.4 Hover States

```tsx
// Carte interactive
<div className="card-hover cursor-pointer">
  Contenu survolable
</div>

// Bouton avec transformation
<Button className="hover:scale-105 active:scale-95">
  Action
</Button>

// Lien avec underline
<a className="hover:underline underline-offset-4">
  Lien
</a>
```

---

## 7. Responsive Design

### 7.1 Breakpoints

| Breakpoint | Width | Classe Tailwind |
|------------|-------|----------------|
| Mobile | 320px - 767px | par défaut |
| Tablet | 768px - 1023px | `md:` |
| Desktop | 1024px - 1279px | `lg:` |
| Large | 1280px+ | `xl:` |

### 7.2 Adaptations par device

```tsx
// Sidebar: hidden sur mobile, visible sur desktop
<AppSidebar className="hidden lg:flex" />

// Grilles responsives
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</div>

// Navigation mobile
<Sheet>
  <SheetTrigger>
    <Button variant="ghost" size="icon" className="lg:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent>{/* Menu mobile */}</SheetContent>
</Sheet>
```

### 7.3 Tableaux Responsive

```tsx
// Option 1: Scroll horizontal
<div className="overflow-x-auto">
  <Table>{/* contenu */}</Table>
</div>

// Option 2: Cards sur mobile
<div className="grid grid-cols-1 md:hidden space-y-4">
  {items.map(item => (
    <Card key={item.id}>{/* Données en format card */}</Card>
  ))}
</div>
```

---

## 8. Accessibilité

### 8.1 Contrastes Recommandés

| Type de texte | Ratio minimum |
|---------------|---------------|
| Texte normal (16px+) | 4.5:1 |
| Grand texte (18px+, bold) | 3:1 |
| Composants UI | 3:1 |

### 8.2 Focus Visible

```css
/* Indicateur de focus */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Focus ring pour les composants */
.focus-ring:focus {
  box-shadow: 0 0 0 3px oklch(0.55 0.22 240 / 0.3);
}
```

### 8.3 Navigation Clavier

```tsx
// Bouton accessible au clavier
<Button
  onClick={handleClick}
  aria-label="Description de l'action"
  aria-describedby="helper-text"
>
  Action
</Button>

// Lien avec indicateur focus
<Link
  href="/page"
  className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
>
  Lien
</Link>
```

### 8.4 Images et Icônes

```tsx
// Image décorative
<img src="/icon.svg" alt="" aria-hidden="true" />

// Image informative
<img src="/diagram.png" alt="Diagramme montrant les ventes par produit" />

// Icône avec label
<Button>
  <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
  Supprimer
</Button>
```

---

## 📁 Structure des Fichiers de Style

```
styles/
├── globals.css          # Styles globaux et variables
└── components.css       # Styles des composants (si nécessaire)

app/
├── layout.tsx           # Layout avec font Inter
├── globals.css          # Import des styles
└── [page]/page.tsx     # Pages avec styles inline
```

---

## 🔧 Maintenance du Design System

### Ajout d'un Nouveau Composant

1. Créer le composant dans `components/`
2. Utiliser les tokens CSS existants
3. Ajouter les variantes responsive
4. Documenter dans ce fichier
5. Tester l'accessibilité

### Modification de Couleurs

1. Mettre à jour les variables dans `app/globals.css`
2. Tester le contraste avec [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
3. Mettre à jour la documentation ci-dessus

---

## 📚 Ressources

- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Accessibility](https://webaim.org/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

<div align="center">

**Documenté avec ❤️ pour l'équipe PoissyShop**

</div>
