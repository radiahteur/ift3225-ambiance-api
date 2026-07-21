import { useState, useEffect } from "react";
import { getMe, getMyObservations } from "../api/auth.js";

function Account() {
  const [user, setUser] = useState(null);
  const [observations, setObservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchData();
  }, []);

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