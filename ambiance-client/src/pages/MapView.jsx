import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { getPlaces } from "../api/places";

function MapView() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    async function loadPlaces() {
      try {
        const response = await getPlaces();
        setPlaces(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadPlaces();
  }, []);

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
        <Marker
          key={place._id}
          position={[place.latitude, place.longitude]}
        >
          <Popup>
            <h3>{place.name}</h3>

            <p>{place.description}</p>

            <Link to={`/place/${place._id}`}>
              Voir les détails
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;