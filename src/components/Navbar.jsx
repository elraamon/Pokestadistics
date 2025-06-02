export default function Navbar({ user, onLogout }) {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#007aff", color: "white" }}>
      <div><strong>PokestadisticsTCG</strong></div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: "1rem" }}> {user.displayName || user.email}</span>
            <button onClick={onLogout} style={{ borderRadius: "8px", padding: "0.3rem 0.6rem", cursor: "pointer" }}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <button style={{ marginRight: "1rem", borderRadius: "8px", padding: "0.3rem 0.6rem", cursor: "pointer" }} onClick={() => window.location.hash = "#login"}>Login</button>
            <button style={{ borderRadius: "8px", padding: "0.3rem 0.6rem", cursor: "pointer" }} onClick={() => window.location.hash = "#register"}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}
