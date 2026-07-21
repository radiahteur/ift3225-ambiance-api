import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
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

      {token ? (
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