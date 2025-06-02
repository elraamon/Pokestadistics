import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout, children }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">Pokestadistics</Link>
        {children}
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/profile" className="navbar-user" style={{ textDecoration: "underline", cursor: "pointer" }}>
              {user.displayName || "Usuario"}
            </Link>
            <button className="navbar-btn" onClick={onLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link className="navbar-btn" to="/login">Login</Link>
            <Link className="navbar-btn" to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
