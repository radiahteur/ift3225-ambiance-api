import { useCallback } from "react";
import { Link } from "react-router-dom";
import { getMyObservations } from "../api/auth.js";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { useAsyncAction } from "../hooks/useAsyncAction";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

function Account() {
  const { user, userLoading, toggleFavorite } = useAuth();

  const fetchObservations = useCallback(() => getMyObservations(), []);
  const {
    data: obsResult,
    loading: obsLoading,
    error: obsError,
    refetch: refetchObservations,
  } = useAsync(fetchObservations, [], "Impossible de charger vos observations.");

  const removeFavoriteAction = useAsyncAction((placeId) => toggleFavorite(placeId));

  if (userLoading || !user) {
    return <LoadingState message="Chargement du compte..." />;
  }

  const observations = obsResult?.data || [];

  return (
    <div style={{ padding: "20px" }}>
      <h1>👤 Mon compte</h1>

      <hr />

      <h2>Informations</h2>

      <p><strong>Nom :</strong> {user.username}</p>
      <p><strong>Email :</strong> {user.email}</p>

      <hr />

      <h2>Mes favoris</h2>

      {!user.favorites || user.favorites.length === 0 ? (
        <p>Aucun lieu favori pour le moment.</p>
      ) : (
        <ul>
          {user.favorites.map((place) => (
            <li key={place._id} style={{ marginBottom: "8px" }}>
              <Link to={`/place/${place._id}`}>{place.name}</Link>
              {" — "}
              <button
                onClick={() => removeFavoriteAction.run(place._id)}
                disabled={removeFavoriteAction.loading}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}
      {removeFavoriteAction.error && (
        <p style={{ color: "#c0392b" }}>{removeFavoriteAction.error}</p>
      )}

      <hr />

      <h2>Mes observations</h2>

      {obsLoading ? (
        <LoadingState message="Chargement des observations..." />
      ) : obsError ? (
        <ErrorState message={obsError} onRetry={refetchObservations} />
      ) : observations.length === 0 ? (
        <p>Aucune observation pour le moment.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Lieu</th>
              <th>Date</th>
              <th>Niveau</th>
            </tr>
          </thead>

          <tbody>
            {observations.map((obs) => (
              <tr key={obs._id}>
                <td>{obs.location}</td>
                <td>{new Date(obs.timestamp).toLocaleDateString("fr-FR")}</td>
                <td>{obs.crowdLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Account;