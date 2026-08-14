// Composant réutilisable pour afficher un état d'erreur,
// avec un bouton "Réessayer" optionnel quand l'action est relancée.

function ErrorState({ message, onRetry }) {
  return (
    <div style={{ padding: "20px" }}>
      <p style={{ color: "#c0392b" }}>{message}</p>
      {onRetry && <button onClick={onRetry}>Réessayer</button>}
    </div>
  );
}

export default ErrorState;