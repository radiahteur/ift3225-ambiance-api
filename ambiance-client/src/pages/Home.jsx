import MapView from "./MapView";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>🎧 Ambiance API</h1>

      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Accueil</Link>{" "}
        <Link to="/login">Connexion</Link>{" "}
        <Link to="/account">Mon compte</Link>
      </nav>

      <h2>Carte des lieux</h2>

      <MapView />
    </div>
  );
}

export default Home;