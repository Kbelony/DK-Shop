# Comment obtenir les vrais Album IDs Google Photos

Les liens de partage (`https://photos.app.goo.gl/...`) ne sont **PAS** les vrais `albumId` nécessaires pour l'API Google Photos.

## Méthode 1: Utiliser l'endpoint `/api/albums/list` (Recommandé)

### Étape 1: Authentifiez-vous

1. Visitez: `http://localhost:5173/api/auth/login` (ou votre URL de production)
2. Autorisez l'application à accéder à Google Photos
3. Vous serez redirigé vers la page d'accueil

### Étape 2: Listez vos albums

1. Visitez: `http://localhost:5173/api/albums/list` (ou votre URL de production)
2. Vous verrez une réponse JSON avec tous vos albums :

```json
{
  "albums": [
    {
      "id": "AF1QipOJqJff-5owDQSggspJeUWJAxH9t9DYwVckl3JNob1vdX7N1mwiXjFnSMumAeaehQ",
      "title": "Mon Album",
      "productUrl": "https://photos.app.goo.gl/...",
      "coverPhotoUrl": "https://...",
      "mediaItemsCount": "25",
      "isWriteable": true
    }
  ],
  "total": 1
}
```

### Étape 3: Copiez les IDs

1. Copiez les valeurs du champ `"id"` (pas `productUrl`)
2. Collez-les dans `src/services/googlePhotos.ts` dans `GOOGLE_PHOTOS_ALBUM_MAP`

Exemple :

```typescript
export const GOOGLE_PHOTOS_ALBUM_MAP: Record<string, string> = {
  "gallery-1": "AF1QipOJqJff-5owDQSggspJeUWJAxH9t9DYwVckl3JNob1vdX7N1mwiXjFnSMumAeaehQ",
  "gallery-2": "un-autre-album-id",
  // ...
};
```

## Méthode 2: Via Google Photos Web (Alternative)

Si vous connaissez le nom de vos albums :

1. Ouvrez Google Photos dans votre navigateur
2. Ouvrez l'album que vous voulez utiliser
3. L'URL peut contenir l'albumId, mais ce n'est pas toujours fiable
4. **Recommandation**: Utilisez plutôt la Méthode 1

## Vérification

Une fois les IDs configurés :

1. Visitez une galerie: `/gallery/gallery-1`
2. Les images devraient se charger depuis Google Photos
3. Si vous voyez une erreur, vérifiez :
   - Que vous êtes authentifié (`/api/auth/login`)
   - Que l'albumId est correct
   - Que vous avez accès à l'album dans Google Photos

## Exemple de workflow complet

```bash
# 1. Démarrer le serveur de développement
npm run dev

# 2. Dans le navigateur, visitez:
# http://localhost:5173/api/auth/login

# 3. Après authentification, visitez:
# http://localhost:5173/api/albums/list

# 4. Copiez les IDs et mettez-les dans GOOGLE_PHOTOS_ALBUM_MAP

# 5. Testez:
# http://localhost:5173/gallery/gallery-1
```

