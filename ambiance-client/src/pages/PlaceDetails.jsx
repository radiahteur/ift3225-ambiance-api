import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import HistoryChart from "./HistoryChart";
import { getPlaceById } from "../api/places";
import { getHistory, getQuietHours } from "../api/ambiance";
import { submitObservation } from "../api/observations";

const noiseLabels = {
  quiet: { emoji: "🟢", label: "Calme" },
  normal: { emoji: "🟢", label: "Normal" },
  noisy: { emoji: "🟡", label: "Animé" },
  very_noisy: { emoji: "🔴", label: "Très animé" },
  unknown: { emoji: "⚪", label: "Inconnu" },
};

function PlaceDetails() {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [history, setHistory] = useState(null);
  const [quietHours, setQuietHours] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [crowdLevel, setCrowdLevel] = useState("");
  const [ambiance, setAmbiance] = useState("");
  const [notes, setNotes] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const placeResult = await getPlaceById(id);
        setPlace(placeResult.data);

        const location = placeResult.data.location;

        const historyResult = await getHistory(location);
        setHistory(historyResult.data);

        const quietResult = await getQuietHours(location);
        setQuietHours(quietResult.data.quietHours);

      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données de ce lieu.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitObservation(place.location, crowdLevel, ambiance, notes);
      alert("Observation enregistrée !");
      setCrowdLevel("");
      setAmbiance("");
      setNotes("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de l'observation.");
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Chargement...</div>;
  if (error) return <div style={{ padding: "20px" }}>{error}</div>;

  const classification = history?.summary?.noiseClassification || "unknown";
  const badge = noiseLabels[classification];

  return (
    <div style={{ padding: "20px" }}>
      <h1>📍 {place.name}</h1>
      <p>{place.description}</p>

      <hr />

      <h2>Indice d'ambiance</h2>
      <h3>{badge.emoji} {badge.label}</h3>
      <p>Niveau sonore moyen : {history?.summary?.avgSoundDb ?? "N/A"} dBFS</p>

      <hr />

      <h2>Historique</h2>
      <HistoryChart timeline={history?.timeline} />

      <hr />

      <h2>Créneaux calmes</h2>
      {quietHours.length === 0 ? (
        <p>Pas assez de données pour déterminer des créneaux calmes.</p>
      ) : (
        <ul>
          {quietHours.map((qh) => (
            <li key={qh.hour}>
              {qh.label} — {noiseLabels[qh.classification].emoji} {noiseLabels[qh.classification].label} ({qh.avgSoundDb} dBFS, {qh.samples} mesures)
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Ajouter une observation</h2>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <label>Niveau de foule</label>
          <br />
          <select value={crowdLevel} onChange={(e) => setCrowdLevel(e.target.value)} required>
            <option value="">Choisir...</option>
            <option value="empty">Vide</option>
            <option value="low">Faible</option>
            <option value="medium">Moyen</option>
            <option value="high">Élevé</option>
          </select>

          <br /><br />

          <label>Ambiance sonore</label>
          <br />
          <select value={ambiance} onChange={(e) => setAmbiance(e.target.value)} required>
            <option value="">Choisir...</option>
            <option value="quiet">Calme</option>
            <option value="normal">Normal</option>
            <option value="noisy">Animé</option>
            <option value="very_noisy">Très animé</option>
          </select>

          <br /><br />

          <label>Commentaire</label>
          <br />
          <textarea
            rows="4"
            cols="40"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <br /><br />

          <button type="submit">Envoyer l'observation</button>
        </form>
      ) : (
        <p>Vous devez être connecté pour soumettre une observation.</p>
      )}
    </div>
  );
}

export default PlaceDetails;