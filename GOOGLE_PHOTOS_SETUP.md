# Configuration Google Photos

Ce guide explique comment connecter votre application à Google Photos pour récupérer automatiquement les images des albums.

## Architecture

L'application est structurée pour supporter Google Photos via un backend. Voici les fichiers clés :

- `src/services/googlePhotos.ts` - Service pour les appels API
- `src/hooks/useGallery.ts` - Hook React pour récupérer les galeries
- `src/data/mockGalleries.ts` - Données mockées (fallback)

## Option 1: Backend avec Google Photos API (Recommandé)

### Étape 1: Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez l'API **Google Photos Library API**

### Étape 2: Configurer OAuth

1. Dans **APIs & Services** > **Credentials**
2. Créez un **OAuth 2.0 Client ID** (type: "Application Web")
3. Configurez les champs suivants :

#### Origines JavaScript autorisées (Authorized JavaScript origins)
⚠️ **Important**: Mettez uniquement le domaine, SANS chemin ni slash final.

**Pour le développement local:**
- `http://localhost:5173` (si vous utilisez Vite)
- `http://localhost:3000` (si vous utilisez un autre port)

**Pour la production:**
- `https://dkshop-omega.vercel.app`

❌ **Ne mettez PAS**: `https://dkshop-omega.vercel.app/api/auth/callback`  
✅ **Mettez**: `https://dkshop-omega.vercel.app`

#### URI de redirection autorisés (Authorized redirect URIs)
Ces URLs complètes pointent vers votre backend qui gère le callback OAuth.

**Pour le développement local:**
- `http://localhost:5173/api/auth/callback` (si votre backend tourne sur le même port)
- `http://localhost:3000/api/auth/callback` (si votre backend est sur un port séparé)

**Pour la production:**
- `https://dkshop-omega.vercel.app/api/auth/callback`

### Étape 3: Créer un backend

Créez un backend (Node.js/Express, Python/Flask, etc.) qui :

1. Gère l'authentification OAuth avec Google
2. Stocke le token d'accès
3. Expose un endpoint `/api/gallery/:albumId` qui :
   - Récupère les images de l'album via l'API Google Photos
   - Retourne un JSON au format :
   ```json
   {
     "images": [
       {
         "src": "https://...",
         "alt": "Description",
         "width": 1920,
         "height": 1080
       }
     ]
   }
   ```

### Étape 4: Configurer les IDs d'albums

Dans `src/services/googlePhotos.ts`, remplissez le mapping :

```typescript
export const GOOGLE_PHOTOS_ALBUM_MAP: Record<string, string> = {
  "gallery-1": "VOTRE_ALBUM_ID_1",
  "gallery-2": "VOTRE_ALBUM_ID_2",
  // ...
};
```

Pour obtenir l'albumId :
1. Ouvrez l'album dans Google Photos
2. Cliquez sur "Partager" > "Obtenir le lien"
3. L'albumId est dans l'URL ou utilisez l'API pour lister vos albums

### Étape 5: Configurer l'URL de l'API

Créez un fichier `.env` :

```env
VITE_API_BASE_URL=https://votre-backend.com/api/gallery
```

Ou modifiez directement dans `src/services/googlePhotos.ts` :

```typescript
const API_BASE_URL = "https://votre-backend.com/api/gallery";
```

### Étape 6: Activer Google Photos dans le hook

Dans `src/hooks/useGallery.ts`, décommentez la ligne :

```typescript
const googlePhotosGallery = await fetchGalleryFromGooglePhotos(galleryId);
```

## Option 2: Backend simple avec scraping (Non recommandé)

⚠️ **Attention**: Cette méthode est fragile et peut casser si Google change le format.

Vous pouvez créer un backend qui parse le HTML de la page de partage, mais ce n'est pas recommandé pour la production.

## Option 3: Utiliser des données mockées (Actuel)

Par défaut, l'application utilise les données mockées définies dans `src/data/mockGalleries.ts`. C'est parfait pour le développement et le prototypage.

## Structure des données

### Format Gallery

```typescript
type Gallery = {
  id: string;
  title: string;
  images: GalleryImage[];
};

type GalleryImage = {
  src: string;      // URL de l'image
  alt: string;      // Texte alternatif
  width?: number;   // Largeur (optionnel)
  height?: number;  // Hauteur (optionnel)
};
```

## Exemple de backend Node.js/Express

```javascript
const express = require('express');
const { google } = require('googleapis');

const app = express();
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Endpoint pour récupérer un album
app.get('/api/gallery/:albumId', async (req, res) => {
  try {
    const photos = google.photoslibrary({ version: 'v1', auth: oauth2Client });
    
    const response = await photos.mediaItems.search({
      albumId: req.params.albumId,
    });
    
    const images = response.data.mediaItems.map(item => ({
      src: item.baseUrl + '=w1920-h1080', // Taille personnalisée
      alt: item.filename || 'Image',
      width: item.mediaMetadata.width,
      height: item.mediaMetadata.height,
    }));
    
    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Ressources

- [Google Photos Library API Documentation](https://developers.google.com/photos/library/guides/overview)
- [OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)

