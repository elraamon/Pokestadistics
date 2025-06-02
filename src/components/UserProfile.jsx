import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const user = auth.currentUser;
  const [stats, setStats] = useState({
    gamesWon: 0,
    gamesLost: 0,
    totalGames: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      try {
        const playersRef = collection(db, "users", user.uid, "players");
        const snapshot = await getDocs(playersRef);
        let gamesWon = 0;
        let gamesLost = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          gamesWon += Number(data.gamesWon) || 0;
          gamesLost += Number(data.gamesLost) || 0;
        });
        setStats({
          gamesWon,
          gamesLost,
          totalGames: gamesWon + gamesLost,
        });
      } catch {
        setStats({
          gamesWon: 0,
          gamesLost: 0,
          totalGames: 0,
        });
      }
      setLoading(false);
    }
    fetchStats();
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (!user) return <p>Debes iniciar sesión para ver tu perfil.</p>;

  return (
    <div className="card" style={{ maxWidth: 420, margin: "2rem auto", textAlign: "center" }}>
      <h2>Resumen del usuario</h2>
      {loading ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <table style={{
          margin: "1.5rem auto 2rem auto",
          borderCollapse: "separate",
          borderSpacing: "0 12px",
          width: "100%",
          background: "#f9fafb",
          borderRadius: "12px",
          boxShadow: "0 2px 12px 0 rgba(37,99,235,0.08)",
        }}>
          <tbody>
            <tr>
              <td style={{
                fontWeight: 700,
                color: "#059669",
                fontSize: "1.1rem",
                padding: "1rem 0.5rem",
                borderRadius: "8px 0 0 8px",
                background: "#d1fae5"
              }}>
                Partidas ganadas
              </td>
              <td style={{
                fontWeight: 600,
                fontSize: "1.1rem",
                padding: "1rem 0.5rem",
                background: "#fff",
                borderRadius: "0 8px 8px 0"
              }}>
                {stats.gamesWon}
              </td>
            </tr>
            <tr>
              <td style={{
                fontWeight: 700,
                color: "#ef4444",
                fontSize: "1.1rem",
                padding: "1rem 0.5rem",
                borderRadius: "8px 0 0 8px",
                background: "#fee2e2"
              }}>
                Partidas perdidas
              </td>
              <td style={{
                fontWeight: 600,
                fontSize: "1.1rem",
                padding: "1rem 0.5rem",
                background: "#fff",
                borderRadius: "0 8px 8px 0"
              }}>
                {stats.gamesLost}
              </td>
            </tr>
            <tr>
              <td style={{
                fontWeight: 700,
                color: "#2563eb",
                fontSize: "1.1rem",
                padding: "1rem 0.5rem",
                borderRadius: "8px 0 0 8px",
                background: "#e0e7ff"
              }}>
                Total de partidas
              </td>
              <td style={{
                fontWeight: 600,
                fontSize: "1.1rem",
                padding: "1rem 0.5rem",
                background: "#fff",
                borderRadius: "0 8px 8px 0"
              }}>
                {stats.totalGames}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="navbar-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
