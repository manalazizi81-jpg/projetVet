# Projet Vet

Monorepo Next.js 16 / NestJS du site public et de l'espace d'administration
d'une clinique vétérinaire. Next.js 16 est utilisé car la branche 14 ne reçoit
plus les correctifs de sécurité nécessaires.

## Prérequis

- Node.js 20 ou supérieur
- PostgreSQL 16, directement ou avec Docker

## Installation

```bash
npm install
docker compose up -d
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run db:generate
npm run db:migrate
npm run dev
```

Le site est disponible sur `http://localhost:3000`. Les appels du navigateur à
`/api/*` passent par le proxy Next.js local vers NestJS (`localhost:4000`).

## Un seul projet Vercel

Le fichier `vercel.json` à la racine prépare un **seul projet Vercel Services** :
`apps/web` sert le site et `apps/api` sert `/api/*` sur le même domaine. Gardez
la racine du dépôt comme dossier du projet et choisissez le framework **Services**
dans Vercel. Cette fonctionnalité Vercel est actuellement en bêta. Aucun
déploiement n'est lancé par cette configuration.

La base PostgreSQL reste un service de données externe : le conteneur Docker
local n'est utilisable qu'en développement. Avant un déploiement, fournir au
projet Vercel `DATABASE_URL` (base PostgreSQL hébergée) et `JWT_SECRET` (secret
aléatoire long). Fournir aussi `NEXT_PUBLIC_SITE_URL` avec le domaine public.
`NEXT_PUBLIC_API_URL` peut rester absent ou valoir `/api`; il ne doit plus
pointer vers `localhost`. Appliquer les migrations Prisma et créer le compte
administrateur avec les commandes `db:migrate` et `db:seed` sur cette base avant
d'ouvrir le site au public.

## Organisation du site

| Emplacement | Rôle |
| --- | --- |
| `apps/web/src/app` | Pages publiques (`/`, `/services`, `/rendez-vous`, `/contact`, `/galerie`) et administration (`/admin`, `/admin/connexion`) |
| `apps/web/src/components/layout` | En-tête, pied de page et bouton WhatsApp communs |
| `apps/web/src/components/home` | Animations et sections propres à l'accueil |
| `apps/web/src/components/forms` | Formulaires de rendez-vous et de contact |
| `apps/web/src/components/admin` | Connexion et tableau de bord |
| `apps/web/src/lib/clinic.ts` | Identité, coordonnées et liste officielle des prestations |
| `apps/api/src/modules` | API NestJS par domaine : auth, rendez-vous, disponibilités, contact, galerie, statistiques |
| `apps/api/prisma` | Schéma de données et migrations PostgreSQL |

Le parcours visiteur va de l'accueil vers les services, puis le rendez-vous ou le contact. Le parcours administrateur commence à `/admin/connexion` et mène au tableau de bord protégé. Les informations publiques du cabinet doivent être mises à jour dans `apps/web/src/lib/clinic.ts` pour éviter des coordonnées contradictoires. Les horaires exacts et les capacités techniques doivent être confirmés par le cabinet avant d'être annoncés comme garantis.

L'administration permet de traiter les rendez-vous et les messages de contact, ainsi que d'ajouter, publier, ordonner et supprimer des photos. Les photos ajoutées sont conservées dans PostgreSQL (JPG, PNG ou WebP, 5 Mo maximum) et apparaissent sur l'accueil et la page Galerie. Après une mise à jour du schéma, appliquez les migrations avec `npm run db:migrate` avant de relancer l'API.
