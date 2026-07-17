import { useState } from "react";
import { login } from "../api/auth.js";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const data = await login(email, password);

    console.log(data);

    alert("Connexion réussie !");
  } catch (error) {
    console.error(error);

    alert("Erreur de connexion");
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