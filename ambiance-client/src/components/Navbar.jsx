// Barre de navigation commune à toutes les pages.
// Affiche Connexion/Inscription si l'usager n'est pas connecté,
// ou Mon compte/Déconnexion s'il l'est (selon useAuth()).
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      display: "flex",
      gap: "20px",
      padding: "15px 20px",
      backgroundColor: "#1a1a2e",
      alignItems: "center"
    }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Accueil
      </Link>

      {isLoggedIn ? (
        <>
          <Link to="/account" style={{ color: "white", textDecoration: "none" }}>
            Mon compte
          </Link>
          <button onClick={handleLogout}>
            Déconnexion
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
            Connexion
          </Link>
          <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
            Inscription
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;