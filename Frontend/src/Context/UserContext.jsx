import  { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  const loginUser = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setWishlist([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("wishlist");
  };

  const addToWishlist = (property) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === property.id);
      if (!exists) {
        const updated = [...prev, property];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const removeFromWishlist = (propertyId) => {
    setWishlist((prev) => {
      const updated = prev.filter((item) => item.id !== propertyId);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, token, loginUser, logoutUser, wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </UserContext.Provider>
  );
};
