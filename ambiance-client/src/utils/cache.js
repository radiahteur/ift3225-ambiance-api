// Cache en mémoire côté client, avec durée de vie (TTL) par entrée.

const store = new Map();

// Récupère une valeur en cache si elle existe encore et n'a pas expiré.
// Retourne undefined sinon (cache manquant ou périmé), pour que l'appelant
// sache qu'il doit refaire la requête.
export function getCached(key) {
  const entry = store.get(key);

  if (!entry) return undefined;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }

  return entry.value;
}

// Enregistre une valeur en cache pour `ttlSeconds` secondes (60 par défaut,
// aligné sur le TTL du cache backend pour /places et /ambiance).
export function setCached(key, value, ttlSeconds = 60) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

// Invalide une entrée précise (ex. après la création d'une observation,
// pour ne pas garder un historique périmé pour ce lieu).
export function invalidateCache(key) {
  store.delete(key);
}

// Invalide toutes les entrées dont la clé commence par un préfixe donné
// (ex. tout ce qui concerne un lieu : history, quiet-hours, comfort-score).
export function invalidateCacheByPrefix(prefix) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}