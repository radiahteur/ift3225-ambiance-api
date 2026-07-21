import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await login(email, password);

      localStorage.setItem(
        "token",
        result.data.token
      );

      alert("Connexion réussie !");

      console.log(result);

      navigate("/account");

    } catch (error) {
      console.error(error);
      console.error(error.response?.data);
      alert(JSON.stringify(error.response?.data));
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
          />
        </div>

        <br />

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;