import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from 'framer-motion';

import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import PlayerList from "./components/PlayerList";
import AddPlayer from "./components/AddPlayer";
import UserProfile from "./components/UserProfile";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const publicRoutes = ["/login", "/register"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
   <div style={{ display: "flex", flexDirection: "column" }}>
      <Navbar user={user} onLogout={handleLogout}>
        {user && (
          <nav className="nav-views">
            <Link to="/list">Jugadores</Link>
            <Link to="/add">Añadir/Editar</Link>
          </nav>
        )}
      </Navbar>
      <main className="main-responsive" style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div style={{ height: "48px" }} /> {/* Espacio para separar del navbar */}
                <section className="home-hero">
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="home-title" >Pokestadistics</h1>
                  </motion.div>
                  <p className="home-subtitle">¡Gestiona y analiza tu entorno competitivo de Pokémon TCG!</p>
                  {/* Nuevo formato para features-grid */}
                  <div className="features-grid">
                    <div className="feature-card">
                      <div className="feature-icon">
                        <span role="img" aria-label="estadísticas">📊</span>
                      </div>
                      <div className="feature-content">
                        <h3>Guarda tus estadísticas cómodamente</h3>
                      </div>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon">
                        <span role="img" aria-label="orden">🗂️</span>
                      </div>
                      <div className="feature-content">
                        <h3>Ten un orden de tu entorno competitivo de Pokémon TCG</h3>
                      </div>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon">
                        <span role="img" aria-label="editar">✏️</span>
                      </div>
                      <div className="feature-content">
                        <h3>Crea y edita tus datos fácilmente</h3>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Botón Comenzar */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem", marginBottom: "2rem" }}>
                  {!user ? (
                    <button
                      className="navbar-btn"
                      style={{ fontSize: "1.2rem", padding: "0.8rem 2.2rem" }}
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      Comenzar
                    </button>
                  ) : (
                    <button
                      className="navbar-btn"
                      style={{ fontSize: "1.2rem", padding: "0.8rem 2.2rem" }}
                      onClick={() => {
                        navigate("/list");
                      }}
                    >
                      Ver Jugadores
                    </button>
                  )}
                </div>

                <hr className="section-separator" />

                <motion.section
                  className="highlight-section"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: false, amount: 0.3 }}
                >
                  <div className="highlight-container">
                    <h2 className="home-title">¿Por qué usar PokéStatdistics?</h2>
                    
                    <div className="highlight-cards" style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                      alignItems: "center",
                      marginTop: "2rem"
                    }}>
                      <motion.div
                        className="highlight-card"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: false, amount: 0.3 }}
                        style={{
                          width: "100%",
                          maxWidth: 420,
                          borderRadius: "18px",
                          background: "#fff",
                          boxShadow: "0 2px 16px 0 rgba(37,99,235,0.08)",
                          padding: "2rem 1.5rem",
                          fontSize: "1.2rem",
                          textAlign: "center",
                          fontWeight: 500,
                          transition: "box-shadow 0.2s"
                        }}
                      >
                        🔍 Búsqueda avanzada de jugadores
                      </motion.div>
                      <motion.div
                        className="highlight-card"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: false, amount: 0.3 }}
                        style={{
                          width: "100%",
                          maxWidth: 420,
                          borderRadius: "18px",
                          background: "#fff",
                          boxShadow: "0 2px 16px 0 rgba(37,99,235,0.08)",
                          padding: "2rem 1.5rem",
                          fontSize: "1.2rem",
                          textAlign: "center",
                          fontWeight: 500,
                          transition: "box-shadow 0.2s"
                        }}
                      >
                        ⚡ Estadísticas actualizadas
                      </motion.div>
                      <motion.div
                        className="highlight-card"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: false, amount: 0.3 }}
                        style={{
                          width: "100%",
                          maxWidth: 420,
                          borderRadius: "18px",
                          background: "#fff",
                          boxShadow: "0 2px 16px 0 rgba(37,99,235,0.08)",
                          padding: "2rem 1.5rem",
                          fontSize: "1.2rem",
                          textAlign: "center",
                          fontWeight: 500,
                          transition: "box-shadow 0.2s"
                        }}
                      >
                        🎯 Herramientas de mejora continua
                      </motion.div>
                    </div>
                  </div>
                </motion.section>

                
              </>
            }
          />
          <Route path="/list" element={user ? <PlayerList /> : <p>Inicia sesión para acceder.</p>} />
          <Route path="/add" element={user ? <AddPlayer /> : <p>Inicia sesión para acceder.</p>} />
          <Route path="/profile" element={user ? <UserProfile /> : <p>Inicia sesión para acceder.</p>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
