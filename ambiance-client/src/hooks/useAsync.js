// Hook générique pour exécuter une fonction ex get

import { useState, useEffect, useCallback } from "react";

export function useAsync(asyncFn, deps = [], errorMessage = "Une erreur est survenue.") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      console.error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
    // asyncFn doit être mémorisée par l'appelant (useCallback) : on ne la
    // met pas dans les deps pour laisser l'appelant contrôler quand
    // l'effet se relance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}