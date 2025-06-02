import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import PlayerList from "./components/PlayerList";
import AddPlayer from "./components/AddPlayer"; // Nuevo componente
import UserProfile from "./components/UserProfile";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Define rutas públicas
  const publicRoutes = ["/login", "/register"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // Si está autenticado y está en una ruta pública, redirige a /
      if (currentUser && publicRoutes.includes(location.pathname)) {
        navigate("/", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  function handleLogout() {
    signOut(auth);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar user={user} onLogout={handleLogout}>
        {user && (
          <nav className="nav-views">
            <Link to="/list">Jugadores</Link>
            <Link to="/add">Añadir/Editar</Link>
          </nav>
        )}
      </Navbar>
      <main className="main-responsive">
        <Routes>
          <Route
            path="/"
            element={
                <section className="home-hero">
                  <h1 className="home-title">Pokestadistics</h1>
                  <p className="home-subtitle">¡Gestiona y analiza tu entorno competitivo de Pokémon TCG!</p>
                  <div className="features-grid">
                    <div className="feature-card">
                      <span role="img" aria-label="estadísticas">📊</span>
                      <h3>Guarda tus estadísticas cómodamente</h3>
                    </div>
                    <div className="feature-card">
                      <span role="img" aria-label="orden">🗂️</span>
                      <h3>Ten un orden de tu entorno competitivo de Pokémon TCG</h3>
                    </div>
                    <div className="feature-card">
                      <span role="img" aria-label="editar">✏️</span>
                      <h3>Crea y edita tus datos fácilmente</h3>
                    </div>
                  </div>
                </section>
            }
          />
          <Route
            path="/list"
            element={
              user ? (
                <PlayerList />
              ) : (
                <p>Inicia sesión para acceder.</p>
              )
            }
          />
          <Route
            path="/add"
            element={
              user ? (
                <AddPlayer />
              ) : (
                <p>Inicia sesión para acceder.</p>
              )
            }
          />
          <Route
            path="/profile"
            element={
              user ? (
                <UserProfile />
              ) : (
                <p>Inicia sesión para acceder.</p>
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
