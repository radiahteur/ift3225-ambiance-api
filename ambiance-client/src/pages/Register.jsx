import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    console.log({
      name,
      email,
      password,
    });

    alert("Inscription envoyée !");
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