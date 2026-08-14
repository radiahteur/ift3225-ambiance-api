// Contexte d'authentification et de profil utilisateur.
// Centralise le token JWT, les infos du profil et la liste des favoris,
// pour que Navbar, Account et PlaceDetails partagent le même état sans
// que chaque page ne refasse son propre appel à /users/me.


import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getMe } from "../api/auth";
import { addFavorite, removeFavorite } from "../api/favorites";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      setUserLoading(true);
      const result = await getMe();
      setUser(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUserLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback((newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  // Bascule un lieu en favori / hors favori, avec mise à jour optimiste de
  // user.favorites pour que Account et PlaceDetails restent synchronisés
  // sans refaire un appel à /users/me à chaque changement.
  // `place` peut être soit l'id du lieu (string), soit l'objet lieu complet.
  const toggleFavorite = useCallback(
    async (place) => {
      const placeId = typeof place === "string" ? place : place._id;
      const currentlyFavorite = user?.favorites?.some((fav) => fav._id === placeId);

      if (currentlyFavorite) {
        await removeFavorite(placeId);
        setUser((prev) => ({
          ...prev,
          favorites: prev.favorites.filter((fav) => fav._id !== placeId),
        }));
      } else {
        await addFavorite(placeId);
        setUser((prev) => ({
          ...prev,
          favorites: [
            ...(prev.favorites || []),
            typeof place === "string" ? { _id: place } : place,
          ],
        }));
      }
    },
    [user]
  );

  const isFavorite = useCallback(
    (placeId) => !!user?.favorites?.some((fav) => fav._id === placeId),
    [user]
  );

  const value = {
    token,
    isLoggedIn: !!token,
    login,
    logout,
    user,
    userLoading,
    refreshUser,
    toggleFavorite,
    isFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  }

  return context;
}