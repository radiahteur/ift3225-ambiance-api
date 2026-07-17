import { useParams } from "react-router-dom";
import { useState } from "react";
import HistoryChart from "./HistoryChart";

function PlaceDetails() {
  const { id } = useParams();

  const [level, setLevel] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      place: id,
      level,
      comment,
    });

    alert("Observation enregistrée !");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📍 Lieu #{id}</h1>

      <hr />

      <h2>Indice d'ambiance</h2>
      <h3 style={{ color: "green" }}>🟢 Calme</h3>

      <hr />

      <h2>Historique</h2>

      <HistoryChart />

      <hr />

      <h2>Ajouter une observation</h2>

      <form onSubmit={handleSubmit}>
        <label>Niveau de bruit</label>

        <br />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">Choisir...</option>
          <option value="Faible">Faible</option>
          <option value="Moyen">Moyen</option>
          <option value="Élevé">Élevé</option>
        </select>

        <br />
        <br />

        <label>Commentaire</label>

        <br />

        <textarea
          rows="4"
          cols="40"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Envoyer l'observation
        </button>
      </form>
    </div>
  );
}

export default PlaceDetails;