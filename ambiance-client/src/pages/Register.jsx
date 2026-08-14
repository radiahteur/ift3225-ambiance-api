import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAsyncAction } from "../hooks/useAsyncAction";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerAction = useAsyncAction(() => register(name, email, password));

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerAction.run();
      navigate("/login");
    } catch {
      // l'erreur est déjà exposée via registerAction.error
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Inscription</h1>

      <form onSubmit={handleRegister}>
        <div>
          <label>Nom</label><br />
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <br />

        <div>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Mot de passe</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit" disabled={registerAction.loading}>
          {registerAction.loading ? "Création..." : "S'inscrire"}
        </button>

        {registerAction.error && (
          <p style={{ color: "#c0392b" }}>{registerAction.error}</p>
        )}
        {registerAction.success && (
          <p style={{ color: "#27ae60" }}>
            Compte créé avec succès ! Vous pouvez vous connecter.
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;