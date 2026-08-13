import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMe, getMyObservations } from "../api/auth.js";
import { removeFavorite } from "../api/favorites.js";

function Account() {
  const [user, setUser] = useState(null);
  const [observations, setObservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const userResult = await getMe();
      setUser(userResult.data);

      const obsResult = await getMyObservations();
      setObservations(obsResult.data);

    } catch (err) {
      console.error(err);
      setError("Impossible de charger les données du compte.");
    }
  }

  const handleRemoveFavorite = async (placeId) => {
    try {
      await removeFavorite(placeId);

      setUser((prevUser) => ({
        ...prevUser,
        favorites: prevUser.favorites.filter((fav) => fav._id !== placeId),
      }));
    } catch (err) {
      console.error(err);
      alert("Erreur lors du retrait du favori.");
    }
  };

  if (error) {
    return <div style={{ padding: "20px" }}>{error}</div>;
  }

  if (!user) {
    return <div style={{ padding: "20px" }}>Chargement...</div>;
  }

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
              <button onClick={() => handleRemoveFavorite(place._id)}>
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Mes observations</h2>

      {observations.length === 0 ? (
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