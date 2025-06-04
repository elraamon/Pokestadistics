import { Link, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";

export default function Navbar({ user, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Cierra el menú al navegar o al hacer click fuera
  const handleNavClick = () => setMenuOpen(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand" onClick={handleNavClick}>Pokestadistics</Link>
      </div>
      {user ? (
        <>
          {/* Hamburger button visible only on small screens */}
          <button
            className="hamburger"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              position: "fixed",
              right: 12,
              top: 12,
              zIndex: 1100,
              display: "block",
              width: 32,
              height: 32,
              padding: 0,
              background: "#2563eb", // azul principal
              border: "none",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(37,99,235,0.08)"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect y="3" width="20" height="2.2" rx="1.1" fill="#fff" />
              <rect y="8.5" width="20" height="2.2" rx="1.1" fill="#fff" />
              <rect y="14" width="20" height="2.2" rx="1.1" fill="#fff" />
            </svg>
          </button>
          {/* Responsive side drawer menu */}
          <nav
            ref={menuRef}
            className={`nav-views side-drawer${menuOpen ? " open" : ""}`}
            style={{
              display: menuOpen ? "flex" : "none"
            }}
          >
            <Link to="/list" className="side-link" onClick={handleNavClick}>Jugadores</Link>
            <Link to="/add" className="side-link" onClick={handleNavClick}>Añadir/Editar</Link>
            <Link to="/profile" className="navbar-user" style={{ textDecoration: "underline", cursor: "pointer", marginTop: 24 }} onClick={handleNavClick}>
              {user.displayName || "Perfil"}
            </Link>
            <button
              className="navbar-btn"
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => setShowLogoutModal(true)}
            >
              Cerrar sesión
            </button>
          </nav>
          {/* Inline nav for desktop */}
          <nav className="nav-views desktop-nav navbar-right">
            <Link to="/list" className="side-link" onClick={handleNavClick}>Jugadores</Link>
            <Link to="/add" className="side-link" onClick={handleNavClick}>Añadir/Editar</Link>
            <Link to="/profile" className="navbar-user" style={{ textDecoration: "underline", marginLeft: 16 }} onClick={handleNavClick}>
              {user.displayName || "Perfil"}
            </Link>
            <button
              className="navbar-btn"
              style={{ marginLeft: 8 }}
              onClick={() => setShowLogoutModal(true)}
            >
              Cerrar sesión
            </button>
          </nav>
          {/* Modal de confirmación */}
          {showLogoutModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "2rem 1.5rem",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                  minWidth: 280,
                  textAlign: "center"
                }}
              >
                <h3 style={{ marginBottom: 16 }}>¿Seguro que quieres cerrar sesión?</h3>
                <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                  <button
                    className="navbar-btn"
                    style={{ background: "#e5e7eb", color: "#222", fontWeight: 500 }}
                    onClick={() => setShowLogoutModal(false)}
                  >
                    Cancelar
                  </button>
                  <Link
                    to="/"
                    className="navbar-btn"
                    style={{ background: "#2563eb", color: "#fff" }}
                    onClick={() => {
                      setShowLogoutModal(false);
                      setMenuOpen(false);
                      onLogout();
                    }}
                  >
                    Sí, cerrar sesión
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="navbar-right desktop-navbar-btns">
            <Link className="navbar-btn" to="/login">Iniciar Sesión</Link>
            <Link className="navbar-btn" to="/register">Registrarse</Link>
          </div>
          <button
            className="mobile-accede-btn"
            onClick={() => navigate("/login")}
          >
            Accede
          </button>
        </>
      )}
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          padding: 0 16px;
          background-color: white;
          z-index: 1300;
          box-shadow: 0 4px 16px rgba(37,99,235,0.06);
          overflow-x: hidden;
        }
        .navbar-left {
          display: flex;
          align-items: center;
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .navbar-btn {
          background: var(--primary, #2563eb);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1.1rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          margin-bottom: 0;
        }
        .navbar-btn:hover, .navbar-btn:focus {
          background:rgb(20, 68, 172);
          color:rgb(255, 255, 255);
        }
        .side-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 220px;
          background: #f5f8ff;
          flex-direction: column;
          align-items: flex-start;
          padding: 32px 16px 16px 16px;
          z-index: 1200;
          transition: transform 0.3s;
        }
        .side-drawer.open {
          display: flex;
        }
        .desktop-nav {
          display: none;
        }
        .hamburger {
          display: block;
        }
        .mobile-accede-btn {
          display: none;
        }
        @media (max-width: 767px) {
          .navbar-right.desktop-navbar-btns {
            display: none !important;
          }
          .mobile-accede-btn {
            display: block;
            background: var(--primary, #2563eb);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 0.5rem 1.1rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-left: auto;
            margin-right: 0;
            margin-top: 8px;
          }
        }
        @media (min-width: 768px) {
          .mobile-accede-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
