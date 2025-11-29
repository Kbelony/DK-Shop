# Configuration du Backend Google Photos pour Vercel

Ce guide explique comment configurer et déployer le backend Google Photos sur Vercel.

## Structure du Backend

Le backend est composé de fonctions serverless Vercel dans le dossier `/api` :

- `/api/auth/login.ts` - Initie l'authentification OAuth
- `/api/auth/callback.ts` - Gère le callback OAuth de Google
- `/api/gallery/[albumId].ts` - Récupère les images d'un album

## Installation

1. **Installer les dépendances** :

```bash
npm install @vercel/node googleapis
```

2. **Configurer les variables d'environnement** :

Créez un fichier `.env.local` (pour le développement local) :

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/api/auth/callback
NODE_ENV=development
```

## Configuration Vercel

### 1. Variables d'environnement sur Vercel

Dans votre dashboard Vercel :

1. Allez dans **Settings** > **Environment Variables**
2. Ajoutez les variables suivantes :

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://dkshop-omega.vercel.app/api/auth/callback
NODE_ENV=production
```

⚠️ **Important** : Pour `GOOGLE_REDIRECT_URI`, utilisez votre URL de production Vercel.

### 2. Configuration OAuth dans Google Cloud Console

Assurez-vous que vos **URI de redirection autorisés** incluent :

- `http://localhost:5173/api/auth/callback` (développement)
- `https://dkshop-omega.vercel.app/api/auth/callback` (production)

## Utilisation

### 1. Authentification

Pour authentifier un utilisateur, redirigez-le vers :

```
/api/auth/login
```

Après l'authentification, Google redirigera vers `/api/auth/callback` qui stockera les tokens dans des cookies.

### 2. Récupérer les images d'un album

Une fois authentifié, appelez :

```
GET /api/gallery/[albumId]
```

Exemple :
```
GET /api/gallery/AF1QipOJqJff-5owDQSggspJeUWJAxH9t9DYwVckl3JNob1vdX7N1mwiXjFnSMumAeaehQ
```

Réponse :
```json
{
  "images": [
    {
      "src": "https://...",
      "alt": "image.jpg",
      "width": 1920,
      "height": 1080
    }
  ]
}
```

## Obtenir l'Album ID

Pour obtenir l'ID d'un album Google Photos :

1. **Méthode 1 - Via l'API** :
   - Utilisez l'endpoint `albums.list` de l'API Google Photos
   - L'ID sera dans la réponse

2. **Méthode 2 - Via le lien de partage** :
   - Partagez l'album et copiez le lien
   - L'ID peut être extrait du lien (mais ce n'est pas toujours l'albumId exact)

3. **Méthode 3 - Via Google Photos** :
   - Ouvrez l'album dans Google Photos
   - L'URL contient parfois l'ID, mais pour l'API, vous devez utiliser l'API pour lister les albums

## Mise à jour du Frontend

Dans `src/services/googlePhotos.ts`, configurez :

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/gallery";
```

Et dans `src/hooks/useGallery.ts`, décommentez :

```typescript
const googlePhotosGallery = await fetchGalleryFromGooglePhotos(galleryId);
```

## Déploiement

1. **Pousser le code sur Git** (GitHub, GitLab, etc.)

2. **Connecter à Vercel** :
   - Importez le projet depuis votre repo Git
   - Vercel détectera automatiquement les fonctions dans `/api`

3. **Configurer les variables d'environnement** (voir ci-dessus)

4. **Déployer** : Vercel déploiera automatiquement

## Test Local

Pour tester localement avec Vercel CLI :

```bash
# Installer Vercel CLI
npm i -g vercel

# Démarrer le serveur de développement
vercel dev
```

Cela lancera votre app avec les fonctions serverless.

## Limitations et Améliorations Futures

### Stockage des Tokens

Actuellement, les tokens sont stockés dans des cookies. Pour la production, considérez :

- **Vercel KV** (Redis) pour stocker les tokens
- **Base de données** (PostgreSQL, MongoDB) pour une gestion plus robuste
- **JWT** pour des tokens signés

### Gestion Multi-utilisateur

Si vous avez plusieurs utilisateurs, vous devrez :

- Associer les tokens à des sessions utilisateur
- Utiliser une base de données pour stocker les tokens par utilisateur
- Implémenter un système de refresh automatique

## Dépannage

### Erreur 401 (Non authentifié)

- Vérifiez que l'utilisateur a visité `/api/auth/login` au moins une fois
- Vérifiez que les cookies sont bien envoyés avec les requêtes
- Vérifiez que le refresh token fonctionne

### Erreur 404 (Album non trouvé)

- Vérifiez que l'albumId est correct
- Vérifiez que l'utilisateur a accès à l'album
- Vérifiez que l'album existe dans Google Photos

### Erreur CORS

- Vercel gère automatiquement CORS pour les fonctions serverless
- Si vous avez des problèmes, vérifiez les headers dans `vercel.json`

