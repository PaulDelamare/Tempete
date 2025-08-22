# 🌩️ TEMPÊTE DE MÉTAL RUSSE

Un site web moderne pour un festival de metal russe, développé avec Next.js, Prisma et PostgreSQL.

## 📋 Vue d'ensemble

Tempête de Metal Russe est une plateforme web complète comprenant :

- **Frontend** : Interface utilisateur moderne avec Next.js et Tailwind CSS
- **Backend** : API REST avec Next.js API Routes
- **Base de données** : PostgreSQL avec Prisma ORM
- **Admin** : Interface d'administration via Prisma Studio et un dashboard

## 🏗️ Architecture

```
Tempete/
├── src/
│   ├── app/                   # Pages Next.js (App Router)
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── (main)/            # Pages principales
│   │   │   ├── areas/         # Pages des espaces
│   │   │   ├── event/         # Page des événements
│   │   │   ├── favorites/     # Page des favoris
│   │   │   ├── dashboard/     # Dashboard admin
│   │   │   └── map/           # Carte interactive
│   │   ├── (auth)/            # Pages d'authentification
│   │   └── api/               # API Routes
│   │       ├── artist/        # Endpoint des artistes
│   │       ├── areas/         # Endpoint des espaces
│   │       ├── events/        # Endpoint des événements
│   │       ├── tags/          # Endpoint des tags
│   │       ├── users/         # Endpoint des utilisateurs
│   │       ├── products/      # Endpoint des produits
│   │       ├── sponsors/      # Endpoint des sponsors
│   │       ├── auth/          # Authentification
│   │       └── mail-alerts/   # Alertes email
│   ├── components/            # Composants React réutilisables
│   ├── hooks/                 # Hooks personnalisés
│   ├── stores/                # Stores d'état
│   ├── types/                 # Types TypeScript
│   ├── services/              # Services métier
│   ├── helpers/               # Fonctions utilitaires
│   └── lib/                   # Utilitaires
│       └── prisma.ts          # Client Prisma
├── prisma/
│   └── schema.prisma          # Schéma de base de données
├── public/                    # Assets statiques
│   ├── images/
│   └── fonts/
└── package.json
```

## 🚀 Installation et lancement

### Prérequis

- Node.js (version 18 ou supérieure)
- Docker (pour la base de données)
- npm ou yarn

### 1. Cloner le projet

```bash
git clone <repository-url>
cd Tempete
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de la base de données

#### Option A : Docker Compose (recommandé)

Créez un fichier `docker-compose.yml` à la racine du projet :

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:15
    container_name: tempete-db
    environment:
      POSTGRES_DB: tempete_db
      POSTGRES_USER: tempete_user
      POSTGRES_PASSWORD: tempete_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

##### Méthode 1 : Ligne de commande

```bash
# Démarrer les services
docker-compose up -d

# Vérifier le statut
docker-compose ps

# Arrêter les services
docker-compose down
```

##### Méthode 2 : Docker Desktop

1. **Installez Docker Desktop** depuis [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Ouvrez Docker Desktop** et assurez-vous qu'il est démarré
3. **Ouvrez un terminal** dans le dossier du projet
4. **Lancez** : `docker-compose up -d`
5. **Visualisez** les conteneurs dans l'interface Docker Desktop
6. **Gérez** les conteneurs via l'interface graphique (démarrer/arrêter/logs)

**Avantages Docker Desktop :**

- Interface graphique intuitive
- Visualisation des conteneurs en temps réel
- Gestion des logs et ressources
- Monitoring des performances
- Gestion des volumes et réseaux

#### Option B : Docker simple

##### Méthode 1 : Ligne de commande

```bash
# Lancer PostgreSQL avec Docker
docker run --name tempete-db \
  -e POSTGRES_DB=tempete_db \
  -e POSTGRES_USER=tempete_user \
  -e POSTGRES_PASSWORD=tempete_password \
  -p 5432:5432 \
  -d postgres:15
```

##### Méthode 2 : Docker Desktop

1. **Ouvrez Docker Desktop**
2. **Allez dans l'onglet "Images"**
3. **Recherchez "postgres:15"** et cliquez sur "Pull"
4. **Allez dans l'onglet "Containers"**
5. **Cliquez sur "Run"** et configurez :
   - **Name** : `tempete-db`
   - **Ports** : `5432:5432`
   - **Environment variables** :
     - `POSTGRES_DB=tempete_db`
     - `POSTGRES_USER=tempete_user`
     - `POSTGRES_PASSWORD=tempete_password`
6. **Cliquez sur "Run"**

#### Option C : PostgreSQL local

Installez PostgreSQL et créez une base de données `tempete_db`.

### 4. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
DATABASE_URL="postgresql://tempete_user:tempete_password@localhost:5432/tempete_db"
```

### 5. Initialiser la base de données

```bash
# Générer le client Prisma (obligatoire après chaque modification du schéma)
npx prisma generate

# Créer et appliquer une nouvelle migration
npx prisma migrate

# Rentrer le nom de votre migration
```

**Note** : `npx prisma generate` doit être exécuté après chaque modification du fichier `schema.prisma` pour mettre à jour le client TypeScript.

### 6. Lancer le projet

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

Le site sera accessible sur `http://localhost:3000`

## 🎨 Frontend

### Technologies utilisées

- **Next.js 14** : Framework React avec App Router
- **Tailwind CSS** : Framework CSS utilitaire
- **TypeScript** : Typage statique
- **Next/Image** : Optimisation des images

### Fonctionnalités principales

- **Page d'accueil** : Présentation du festival avec artistes
- **Page des espaces** : Cartographie des zones du festival
- **Page des événements** : Liste des événements avec gestion des favoris
- **Page des favoris** : Événements favoris de l'utilisateur
- **Dashboard admin** : Interface d'administration web complète
- **Carte interactive** : Visualisation géographique du festival
- **Navigation** : Menu hamburger responsive
- **Effets visuels** : Glow effects, transitions, parallax
- **Design responsive** : Adaptation mobile/desktop
- **Système de favoris** : Sauvegarde locale des événements préférés

### Composants clés

- `Navigation.tsx` : Menu de navigation global
- `page.tsx` : Page d'accueil du festival avec tout les artistes
- `(main)/map/page.tsx` : Carte interactive du festival avec points d'interets
- `(main)/areas/page.tsx` : Page des différents espaces disponibles avec informations
- `(main)/event/page.tsx` : Page des événements avec gestion des favoris
- `(main)/favorites/page.tsx` : Page des favoris utilisateur (alertes mail)
- `(main)/dashboard/page.tsx` : Interface d'administration web complète

## 🔧 Backend API

### Endpoints disponibles

#### `/api/artist`

- **GET** : Récupère tous les artistes avec leurs tags
- **POST** : Crée un nouvel artiste
- **Réponse** : Liste des artistes avec bio, image, tags

#### `/api/artist/[id]`

- **GET** : Récupère un artiste spécifique
- **PUT** : Met à jour un artiste
- **DELETE** : Supprime un artiste

#### `/api/areas`

- **GET** : Récupère tous les espaces du festival
- **POST** : Crée un nouvel espace
- **Réponse** : Liste des espaces avec description, type, image

#### `/api/areas/[id]`

- **GET** : Récupère un espace spécifique
- **PUT** : Met à jour un espace
- **DELETE** : Supprime un espace

#### `/api/events`

- **GET** : Récupère tous les événements avec artistes et espaces
- **POST** : Crée un nouvel événement
- **Réponse** : Liste des événements avec détails complets

#### `/api/events/[id]`

- **GET** : Récupère un événement spécifique
- **PUT** : Met à jour un événement
- **DELETE** : Supprime un événement

#### `/api/tags`

- **GET** : Récupère tous les tags (style de musique)
- **POST** : Crée un nouveau tag
- **Réponse** : Liste des tags disponibles

#### `/api/tags/[id]`

- **GET** : Récupère un tag spécifique
- **PUT** : Met à jour un tag
- **DELETE** : Supprime un tag

#### `/api/users`

- **GET** : Récupère tous les utilisateurs
- **POST** : Crée un nouvel utilisateur
- **Réponse** : Liste des utilisateurs

#### `/api/users/[id]`

- **GET** : Récupère un utilisateur spécifique
- **PUT** : Met à jour un utilisateur
- **DELETE** : Supprime un utilisateur

#### `/api/products`

- **GET** : Récupère tous les produits
- **POST** : Crée un nouveau produit
- **Réponse** : Liste des produits du festival

#### `/api/products/[id]`

- **GET** : Récupère un produit spécifique
- **PUT** : Met à jour un produit
- **DELETE** : Supprime un produit

#### `/api/sponsors`

- **GET** : Récupère tous les sponsors
- **POST** : Crée un nouveau sponsor
- **Réponse** : Liste des sponsors

#### `/api/sponsors/[id]`

- **GET** : Récupère un sponsor spécifique
- **PUT** : Met à jour un sponsor
- **DELETE** : Supprime un sponsor

#### `/api/auth`

- **POST** : Authentification utilisateur
- **Réponse** : Token JWT et informations utilisateur

#### `/api/mail-alerts`

- **POST** : Envoie des alertes email
- **Réponse** : Confirmation d'envoi

## 🔐 Administration

### Prisma Studio

Accédez à l'interface de base de données :

```bash
npx prisma studio
```

Ouvrez `http://localhost:5555` dans votre navigateur.

**Note** : Prisma Studio est une interface de visualisation de la base de données, complémentaire au dashboard d'administration web.

### Accès direct à PostgreSQL

Pour des opérations SQL avancées, vous pouvez accéder directement à PostgreSQL :

```bash
# Connexion à PostgreSQL via Docker Compose
docker-compose exec postgres psql -U tempete_user -d tempete_db

# Connexion à PostgreSQL via Docker simple
docker exec -it tempete-db psql -U tempete_user -d tempete_db

# Ou depuis votre machine locale si PostgreSQL est installé
psql -h localhost -U tempete_user -d tempete_db
```

**Via Docker Desktop :**

1. **Ouvrez Docker Desktop**
2. **Allez dans l'onglet "Containers"**
3. **Cliquez sur votre conteneur `tempete-db`**
4. **Cliquez sur l'onglet "Terminal"**
5. **Tapez** : `psql -U tempete_user -d tempete_db`

### Interface d'administration

#### Dashboard (`/dashboard`)

- **Interface web complète** : Gestion de tous les aspects du festival
- **Gestion des artistes** : Ajout, modification, suppression
- **Gestion des tags** : Création et association aux artistes
- **Gestion des espaces** : Configuration des zones du festival
- **Gestion des événements** : Création et planification des événements
- **Gestion des utilisateurs** : Administration des comptes utilisateurs
- **Gestion des produits** : Catalogue des produits du festival
- **Gestion des sponsors** : Partenaires et sponsors
- **Système d'alertes** : Envoi d'emails aux utilisateurs
- **Statistiques** : Visualisation des données du festival

#### Prisma Studio

- **Interface de visualisation** : Interface graphique de la base de données
- **Visualisation des relations** : Interface graphique des données
- **Édition directe** : Modification des données en temps réel
- **Alternative au dashboard** : Pour la visualisation et l'édition des données

#### Accès PostgreSQL direct

- **Commandes SQL** : Accès direct via `docker-compose exec`, `docker exec` ou `psql`
- **Opérations avancées** : Requêtes SQL complexes, migrations manuelles
- **Debugging** : Inspection directe de la base de données
- **Gestion des volumes** : Persistance des données avec Docker Compose

## 🎯 Fonctionnalités avancées

### Système de tags

- Association automatique des artistes aux tags basée sur leur bio
- Filtrage et recherche par genre musical
- Interface de gestion intuitive

### Système de favoris

- Sauvegarde locale des événements favoris
- Interface utilisateur intuitive avec popup de confirmation
- Gestion des favoris avec email de l'utilisateur
- Synchronisation entre les pages événements et favoris

### Design system

- **Police personnalisée** : MetalMania pour les titres
- **Responsive** : Adaptation automatique aux écrans

### Performance

- **Optimisation des images** : Next.js Image avec lazy loading
- **Code splitting** : Chargement à la demande
- **SEO optimisé** : Métadonnées et structure sémantique

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement
npm run build        # Build de production
npm run start        # Lance le serveur de production

# Base de données
npx prisma studio    # Interface d'administration
npx prisma generate  # Génère le client Prisma
npx prisma migrate dev --name <nom>  # Crée et applique une migration
npx prisma migrate deploy  # Applique les migrations (production)
npx prisma migrate reset   # Réinitialise la DB (développement)
npx prisma migrate status  # Statut des migrations
npx prisma db seed   # Seeder la base de données

# Linting et formatage
npm run lint         # Vérification du code
npm run format       # Formatage automatique
```

## 📁 Structure des assets

```
public/
├── images/
│   ├── backgrounds/     # Images de fond
│   ├── borders/         # Bordures décoratives
│   ├── logos/           # Logos du festival
│   └── others/          # Images diverses
└── fonts/
    └── MetalMania-Regular.ttf  # Police personnalisée
```

## 🗂️ Organisation des dossiers

### Pages principales (`src/app/(main)/`)

- **areas/** : Pages des espaces du festival
- **event/** : Page des événements avec favoris
- **favorites/** : Page des favoris utilisateur
- **dashboard/** : Interface d'administration
- **map/** : Carte interactive

### Pages d'authentification (`src/app/(auth)/`)

- Gestion des connexions et inscriptions

### API Routes (`src/app/api/`)

- **artist/** : Gestion des artistes
- **areas/** : Gestion des espaces
- **events/** : Gestion des événements
- **tags/** : Gestion des tags
- **users/** : Gestion des utilisateurs
- **products/** : Gestion des produits
- **sponsors/** : Gestion des sponsors
- **auth/** : Authentification
- **mail-alerts/** : Système d'alertes email

## 🔧 Configuration avancée

### Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/db"

# Next.js
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Images externes (optionnel)
NEXT_PUBLIC_IMAGE_DOMAINS="example.com,cdn.example.com"
```

### Configuration Next.js

- **Images** : Domaines autorisés pour les images externes
- **Fonts** : Optimisation des polices Google Fonts
- **TypeScript** : Configuration stricte pour la sécurité

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📞 Support

Pour toute question ou problème :

- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement

---

**Tempête de Metal Russe** - 🌩️ Festival de Metal Russe en ligne
