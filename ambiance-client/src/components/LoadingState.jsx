// Composant réutilisable pour afficher un état de chargement uniforme
// à travers toutes les pages.

function LoadingState({ message = "Chargement..." }) {
  return <div style={{ padding: "20px" }}>{message}</div>;
}

export default LoadingState;