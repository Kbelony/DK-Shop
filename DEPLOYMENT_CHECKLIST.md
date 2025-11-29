# Checklist de Déploiement Vercel

## Vérifications avant déploiement

### 1. Fichiers API présents

Vérifiez que tous les fichiers dans `/api` sont bien commités :

```bash
git status api/
```

Les fichiers suivants doivent être présents :
- ✅ `api/auth/login.ts`
- ✅ `api/auth/callback.ts`
- ✅ `api/gallery/[albumId].ts`
- ✅ `api/albums/list.ts`

### 2. Variables d'environnement sur Vercel

Dans le dashboard Vercel, vérifiez que ces variables sont configurées :

- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `GOOGLE_REDIRECT_URI` (doit être `https://dkshop-omega.vercel.app/api/auth/callback`)
- ✅ `NODE_ENV=production`

### 3. Dépendances installées

Vérifiez que `package.json` contient :

```json
{
  "dependencies": {
    "@vercel/node": "^3.2.29",
    "googleapis": "^144.0.0"
  }
}
```

### 4. Structure des fichiers

Vercel détecte automatiquement les fonctions serverless dans `/api`. Assurez-vous que :

- Les fichiers exportent un `handler` par défaut
- Les fichiers sont en `.ts` (TypeScript)
- La structure de dossiers est correcte

## Si vous avez une erreur 404

### Vérification 1: Les fichiers sont-ils déployés ?

1. Allez dans votre dashboard Vercel
2. Cliquez sur votre projet
3. Allez dans l'onglet "Functions"
4. Vérifiez que vous voyez :
   - `api/auth/callback`
   - `api/auth/login`
   - `api/gallery/[albumId]`
   - `api/albums/list`

Si vous ne les voyez pas, les fichiers ne sont pas déployés.

### Vérification 2: Les fichiers sont-ils dans Git ?

```bash
git add api/
git commit -m "Add API serverless functions"
git push
```

Puis redéployez sur Vercel.

### Vérification 3: Vercel détecte-t-il les fonctions ?

Vercel détecte automatiquement les fonctions dans `/api`. Si ce n'est pas le cas :

1. Vérifiez que `vercel.json` n'a pas de configuration qui bloque
2. Vérifiez que les fichiers sont bien dans `/api` (pas dans `src/api`)
3. Redéployez après avoir commité les fichiers

## Test après déploiement

1. **Test de l'authentification** :
   ```
   https://dkshop-omega.vercel.app/api/auth/login
   ```

2. **Test du callback** (après authentification) :
   ```
   https://dkshop-omega.vercel.app/api/auth/callback?code=...
   ```

3. **Test de la liste d'albums** :
   ```
   https://dkshop-omega.vercel.app/api/albums/list
   ```

## Commandes utiles

```bash
# Vérifier les fichiers API
ls -la api/

# Vérifier le statut Git
git status api/

# Ajouter et commiter les fichiers API
git add api/
git commit -m "Add API functions"
git push

# Vérifier les logs Vercel
vercel logs
```

