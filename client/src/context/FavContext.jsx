import { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export const FavContext = createContext(null);

export default function FavProvider({ children }) {
  const [favIds, setFavIds] = useState([]);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    if (authTokens) {
      handleFavIds();
    }
  }, [authTokens]);

  const clearFav = () => {
    setFavIds([]);
  };

  const handleFavIds = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/profile/favorites/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFavIds(data.favorite_wines);
      } else {
        console.error("Failed to fetch favourites:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while fetching favourites:", error);
    }
  };

  const removeFav = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/wines/${id}/remove_from_favorites/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      if (response.ok) {
        handleFavIds();
      } else {
        console.error("Failed to delete favourite:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while deleting favourite:", error);
    }
  };

  const addFav = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/wines/${id}/add_to_favorites/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      if (response.ok) {
        // setFavIds((prevFav) => [...prevFav, { id }]);
        handleFavIds();
      } else {
        console.error("Failed to add favourite:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while adding favourite:", error);
    }
  };

  return (
    <FavContext.Provider value={{ favIds, removeFav, addFav, clearFav }}>
      {children}
    </FavContext.Provider>
  );
}
