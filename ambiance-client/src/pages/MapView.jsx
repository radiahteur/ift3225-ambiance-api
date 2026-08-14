import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import { getPlaces } from "../api/places";
import { useAsync } from "../hooks/useAsync";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

function FavoriteToggle({ place }) {
  const { isFavorite, toggleFavorite } = useAuth();
  const favoriteAction = useAsyncAction(() => toggleFavorite(place));
  const favorite = isFavorite(place._id);

  return (
    <>
      <button onClick={() => favoriteAction.run()} disabled={favoriteAction.loading}>
        {favorite ? "★ Retirer des favoris" : "☆ Ajouter aux favoris"}
      </button>
      {favoriteAction.error && (
        <p style={{ color: "#c0392b", fontSize: "0.85em" }}>{favoriteAction.error}</p>
      )}
    </>
  );
}

function MapView() {
  const { isLoggedIn } = useAuth();
  const fetchPlaces = useCallback(() => getPlaces(), []);

  const { data: result, loading, error, refetch } = useAsync(
    fetchPlaces,
    [],
    "Impossible de charger les lieux. Vérifiez votre connexion et réessayez."
  );

  if (loading) {
    return <LoadingState message="Chargement de la carte..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const places = result?.data || [];

  return (
    <>
      {places.length === 0 && (
        <p style={{ padding: "0 20px" }}>Aucun lieu à afficher pour le moment.</p>
      )}

      <MapContainer
        center={[45.5019, -73.5674]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.map((place) => (
          <Marker key={place._id} position={[place.latitude, place.longitude]}>
            <Popup>
              <h3>{place.name}</h3>
              <p>{place.description}</p>

              {isLoggedIn && <FavoriteToggle place={place} />}

              <br />

              <Link to={`/place/${place._id}`}>Voir les détails</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default MapView;