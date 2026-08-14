import { useParams } from "react-router-dom";
import { useState } from "react";
import HistoryChart from "./HistoryChart";
import { submitObservation } from "../api/observations";
import { useAuth } from "../context/AuthContext";
import { usePlaceDetails } from "../hooks/usePlaceDetails";
import { useAsyncAction } from "../hooks/useAsyncAction";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const noiseLabels = {
  quiet: { emoji: "🟢", label: "Calme" },
  normal: { emoji: "🟢", label: "Normal" },
  noisy: { emoji: "🟡", label: "Animé" },
  very_noisy: { emoji: "🔴", label: "Très animé" },
  unknown: { emoji: "⚪", label: "Inconnu" },
};

function PlaceDetails() {
  const { id } = useParams();
  const { place, history, quietHours, loading, error, reload } = usePlaceDetails(id);
  const { isLoggedIn, isFavorite, toggleFavorite } = useAuth();

  const [crowdLevel, setCrowdLevel] = useState("");
  const [ambiance, setAmbiance] = useState("");
  const [notes, setNotes] = useState("");

  const favoriteAction = useAsyncAction(() => toggleFavorite(place));
  const observationAction = useAsyncAction(() =>
    submitObservation(place.location, crowdLevel, ambiance, notes)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await observationAction.run();
      setCrowdLevel("");
      setAmbiance("");
      setNotes("");
      reload();
    } catch {
      // l'erreur est déjà exposée via observationAction.error
    }
  };

  if (loading) return <LoadingState message="Chargement du lieu..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const classification = history?.summary?.noiseClassification || "unknown";
  const badge = noiseLabels[classification];
  const favorite = isFavorite(id);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📍 {place.name}</h1>
      <p>{place.description}</p>

      {isLoggedIn && (
        <>
          <button onClick={() => favoriteAction.run()} disabled={favoriteAction.loading}>
            {favorite ? "★ Retirer des favoris" : "☆ Ajouter aux favoris"}
          </button>
          {favoriteAction.error && (
            <p style={{ color: "#c0392b" }}>{favoriteAction.error}</p>
          )}
        </>
      )}

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

          <button type="submit" disabled={observationAction.loading}>
            {observationAction.loading ? "Envoi..." : "Envoyer l'observation"}
          </button>

          {observationAction.error && (
            <p style={{ color: "#c0392b" }}>{observationAction.error}</p>
          )}
          {observationAction.success && (
            <p style={{ color: "#27ae60" }}>Observation enregistrée !</p>
          )}
        </form>
      ) : (
        <p>Vous devez être connecté pour soumettre une observation.</p>
      )}
    </div>
  );
}

export default PlaceDetails;