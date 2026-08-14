// Regroupe le chargement des données nécessaires à la page de détail d'un
// lieu (infos du lieu, historique, créneaux calmes).

import { useState, useEffect, useCallback } from "react";
import { getPlaceById } from "../api/places";
import { getHistory, getQuietHours } from "../api/ambiance";

export function usePlaceDetails(id) {
  const [place, setPlace] = useState(null);
  const [history, setHistory] = useState(null);
  const [quietHours, setQuietHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const placeResult = await getPlaceById(id);
      setPlace(placeResult.data);

      const location = placeResult.data.location;

      const [historyResult, quietResult] = await Promise.all([
        getHistory(location),
        getQuietHours(location),
      ]);

      setHistory(historyResult.data);
      setQuietHours(quietResult.data.quietHours);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les données de ce lieu.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { place, history, quietHours, loading, error, reload: load };
}