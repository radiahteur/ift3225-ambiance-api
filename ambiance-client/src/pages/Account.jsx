function Account() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>👤 Mon compte</h1>

      <hr />

      <h2>Informations</h2>

      <p><strong>Nom :</strong> Fatoumata</p>
      <p><strong>Email :</strong> fatou@email.com</p>

      <hr />

      <h2>Mes observations</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Lieu</th>
            <th>Date</th>
            <th>Niveau</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Bibliothèque</td>
            <td>17 juillet</td>
            <td>🟢 Faible</td>
          </tr>

          <tr>
            <td>Métro</td>
            <td>16 juillet</td>
            <td>🟡 Moyen</td>
          </tr>

          <tr>
            <td>Cafétéria</td>
            <td>15 juillet</td>
            <td>🔴 Élevé</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Account;