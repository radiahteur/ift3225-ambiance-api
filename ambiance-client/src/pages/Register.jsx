import { useState } from "react";
import { register } from "../api/auth";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register(name, email, password);

      alert("Compte créé avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Inscription</h1>

      <form onSubmit={handleRegister}>
        <div>
          <label>Nom</label><br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Mot de passe</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Register;