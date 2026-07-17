import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

function MapView() {
  const places = [
    { id: 1, name: "Bibliothèque", position: [45.5019, -73.5674] },
    { id: 2, name: "Métro", position: [45.5088, -73.5878] },
    { id: 3, name: "Cafétéria", position: [45.4972, -73.6104] },
  ];

  return (
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
        <Marker key={place.id} position={place.position}>
          <Popup>
            <h3>{place.name}</h3>

            <Link to={`/place/${place.id}`}>
              Voir les détails
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;