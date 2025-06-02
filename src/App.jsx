import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import AddPlayer from "./components/AddPlayer";
import PlayerList from "./components/PlayerList";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login"); // login, register, home

  useEffect(() => {
    // Escuchar cambios de auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPage("home");
      } else {
        setUser(null);
        setPage("login");
      }
    });

    // Escuchar cambios de hash para cambiar páginas (sin router)
    function onHashChange() {
      const hash = window.location.hash.replace("#", "");
      if (hash === "login" || hash === "register" || hash === "home") {
        setPage(hash);
      }
    }
    window.addEventListener("hashchange", onHashChange);

    return () => {
      unsubscribe();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  function handleLogout() {
    signOut(auth);
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <main style={{ padding: "1rem" }}>
        {page === "register" && <Register />}
        {page === "login" && <Login />}
        {page === "home" && user && (
          <>
            <AddPlayer />
            <PlayerList />
          </>
        )}
      </main>
    </>
  );
}
