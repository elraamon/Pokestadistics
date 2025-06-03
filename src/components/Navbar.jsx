import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";

export default function Navbar({ user, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

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
        <Link to="/" onClick={handleNavClick} style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/public/logo.png"
            alt="Logo"
            style={{
              height: 64,
              width: 64,
              marginRight: 0,
              objectFit: "contain",
              verticalAlign: "middle"
            }}
          />
        </Link>
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
              {user.displayName || "Usuario"}
            </Link>
            <button className="navbar-btn" style={{ width: "100%", marginTop: 8 }} onClick={() => { onLogout(); setMenuOpen(false); }}>
              Cerrar sesión
            </button>
          </nav>
          {/* Inline nav for desktop */}
          <nav className="nav-views desktop-nav navbar-right">
            <Link to="/list" className="side-link" onClick={handleNavClick}>Jugadores</Link>
            <Link to="/add" className="side-link" onClick={handleNavClick}>Añadir/Editar</Link>
            <Link to="/profile" className="navbar-user" style={{ textDecoration: "underline", marginLeft: 16 }} onClick={handleNavClick}>
              {user.displayName || "Usuario"}
            </Link>
            <button className="navbar-btn" style={{ marginLeft: 8 }} onClick={() => { onLogout(); setMenuOpen(false); }}>
              Cerrar sesión
            </button>
          </nav>
        </>
      ) : (
        <div className="navbar-right">
          <Link className="navbar-btn" to="/login">Iniciar Sesión</Link>
          <Link className="navbar-btn" to="/register">Registrarse</Link>
        </div>
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
        @media (min-width: 768px) {
          .side-drawer, .hamburger {
            display: none !important;
          }
          .desktop-nav {
            display: flex;
            gap: 16px;
            align-items: center;
            margin-left: auto;
          }
          .navbar-right {
            margin-left: auto;
          }
          .navbar img {
            max-width: 100%;
            height: auto;
            display: block;
          }
        }
      `}</style>
    </header>
  );
}
