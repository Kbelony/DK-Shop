# Guide de Développement Local

## Démarrage Rapide

### Option 1: Avec Vercel CLI (Recommandé)

Cette option permet de tester les fonctions serverless localement :

```bash
# 1. Installer Vercel CLI globalement
npm i -g vercel

# 2. Démarrer Vercel en mode développement
vercel dev
```

Cela lancera :
- Votre app React sur `http://localhost:3000`
- Les fonctions serverless dans `/api` seront disponibles

### Option 2: Sans Vercel CLI (Frontend seulement)

Si vous voulez juste tester le frontend sans les fonctions serverless :

```bash
# Démarrer Vite normalement
npm run dev
```

⚠️ **Note**: Les routes `/api/*` ne fonctionneront pas sans Vercel CLI. Vous verrez des erreurs de proxy, mais le reste de l'app fonctionnera.

## Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
NODE_ENV=development
```

**Important**: Avec `vercel dev`, Vercel utilise le port 3000 par défaut, donc `GOOGLE_REDIRECT_URI` doit pointer vers `http://localhost:3000`.

## Workflow de Développement

### 1. Démarrer le serveur

```bash
vercel dev
```

### 2. Authentifier avec Google Photos

1. Visitez: `http://localhost:3000/api/auth/login`
2. Autorisez l'accès à Google Photos
3. Vous serez redirigé vers la page d'accueil

### 3. Obtenir les IDs d'albums

1. Visitez: `http://localhost:3000/api/albums/list`
2. Copiez les `id` des albums
3. Collez-les dans `src/services/googlePhotos.ts`

### 4. Tester les galeries

Visitez: `http://localhost:3000/gallery/gallery-1`

## Dépannage

### Erreur: "connect ECONNREFUSED ::1:3000"

**Cause**: Vite essaie de proxy vers `localhost:3000` mais Vercel CLI n'est pas lancé.

**Solution**: 
- Lancez `vercel dev` au lieu de `npm run dev`
- Ou désactivez temporairement le proxy dans `vite.config.ts`

### Les fonctions `/api/*` ne fonctionnent pas

**Vérifiez**:
1. Que `vercel dev` est lancé
2. Que les variables d'environnement sont configurées dans `.env.local`
3. Que vous êtes authentifié (`/api/auth/login`)

### Erreur CORS

Les fonctions serverless Vercel gèrent automatiquement CORS. Si vous avez des problèmes, vérifiez que vous utilisez bien `vercel dev`.

## Commandes Utiles

```bash
# Démarrer en mode développement (avec fonctions serverless)
vercel dev

# Build pour production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint
```

## Structure des Ports

- **Vercel CLI (`vercel dev`)**: Port 3000 (app + API)
- **Vite seul (`npm run dev`)**: Port 5173 (app seulement, pas d'API)

Pour un développement complet avec les fonctions serverless, utilisez toujours `vercel dev`.

