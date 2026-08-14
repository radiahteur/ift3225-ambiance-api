// Hook générique pour une action déclenchée par l'utilisateur (soumission de
// formulaire, clic sur un bouton) qui appelle une fonction asynchrone.

import { useState, useCallback } from "react";

export function useAsyncAction(actionFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const run = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await actionFn(...args);
        setSuccess(true);
        return result;
      } catch (err) {
        console.error(err);
        const message = err.response?.data?.message || "Une erreur est survenue.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [actionFn]
  );

  return { run, loading, error, success, setError };
}