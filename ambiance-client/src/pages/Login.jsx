import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth.js";
import { useAuth } from "../context/AuthContext";
import { useAsyncAction } from "../hooks/useAsyncAction";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginAction = useAsyncAction(async () => {
    const result = await loginApi(email, password);
    login(result.data.token);
    return result;
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await loginAction.run();
      navigate("/account");
    } catch {
      // l'erreur est déjà exposée via loginAction.error
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Connexion</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Mot de passe</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loginAction.loading}>
          {loginAction.loading ? "Connexion..." : "Se connecter"}
        </button>

        {loginAction.error && (
          <p style={{ color: "#c0392b" }}>{loginAction.error}</p>
        )}
      </form>
    </div>
  );
}

export default Login;