import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    async function fetchPlayers() {
      if (!auth.currentUser) {
        setError("Debes iniciar sesión");
        return;
      }

      try {
        const playersRef = collection(db, "users", auth.currentUser.uid, "players");
        const snapshot = await getDocs(playersRef);
        const playersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlayers(playersData);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchPlayers();
  }, []);

  // Ordenar jugadores según la columna seleccionada
  const sortedPlayers = React.useMemo(() => {
    if (!sortConfig.key) return players;
    if (!Array.isArray(players) || players.length === 0) return [];
    const sorted = [...players];
    sorted.sort((a, b) => {
      let aValue, bValue;
      if (sortConfig.key === "winrateRounds") {
        const aTotal = Number(a.roundsWon) + Number(a.roundsLost);
        const bTotal = Number(b.roundsWon) + Number(b.roundsLost);
        aValue = aTotal === 0 ? 0 : Number(a.roundsWon) / aTotal;
        bValue = bTotal === 0 ? 0 : Number(b.roundsWon) / bTotal;
      } else if (sortConfig.key === "winrateGames") {
        const aTotal = Number(a.gamesWon) + Number(a.gamesLost);
        const bTotal = Number(b.gamesWon) + Number(b.gamesLost);
        aValue = aTotal === 0 ? 0 : Number(a.gamesWon) / aTotal;
        bValue = bTotal === 0 ? 0 : Number(b.gamesWon) / bTotal;
      } else {
        aValue = a[sortConfig.key] ?? "";
        bValue = b[sortConfig.key] ?? "";
      }
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [players, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!players.length) return <p>No tienes jugadores añadidos.</p>;

  // Calcula winrates
  const getWinrate = (won, lost) => {
    const total = Number(won) + Number(lost);
    if (total === 0) return "0%";
    return ((Number(won) / total) * 100).toFixed(1) + "%";
  };

  return (
    <div style={{ width: "100%", maxWidth: 900 }}>
      <nav>
        <h3 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.3rem", marginTop: "1.5rem" }}>
          Jugadores
        </h3>
      </nav>
      <div style={{
        overflowX: "auto",
        width: "100%",
        boxSizing: "border-box",
      }}>
        <table className="responsive-table" style={{
          minWidth: 700,
          width: "100%",
          fontSize: "1rem",
          tableLayout: "auto",
          borderCollapse: "separate",
          borderSpacing: 0,
          border: "1px solid #b6c3e6",
        }}>
          <thead style={{ background: "#2563eb" }}>
            <tr>
              <th
                style={{
                  cursor: "pointer",
                  background: "#2563eb",
                  color: "#fff"
                }}
                onClick={() => handleSort("name")}
              >
                Nombre {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
              </th>
              <th
                style={{
                  cursor: "pointer",
                  background: "#2563eb",
                  color: "#fff"
                }}
                onClick={() => handleSort("roundsWon")}
              >
                Rondas Ganadas {sortConfig.key === "roundsWon" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
              </th>
              <th
                style={{
                  cursor: "pointer",
                  background: "#2563eb",
                  color: "#fff"
                }}
                onClick={() => handleSort("roundsLost")}
              >
                Rondas Perdidas {sortConfig.key === "roundsLost" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
              </th>
              <th
                style={{
                  cursor: "pointer",
                  background: "#2563eb",
                  color: "#fff"
                }}
                onClick={() => handleSort("winrateRounds")}
              >
                Winrate Rondas {sortConfig.key === "winrateRounds" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
              </th>
              <th
                style={{
                  cursor: "pointer",
                  background: "#2563eb",
                  color: "#fff"
                }}
                onClick={() => handleSort("gamesWon")}
              >
                Partidas Ganadas {sortConfig.key === "gamesWon" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
              </th>
              <th
                style={{
                  cursor: "pointer",
                  background: "#2563eb",
                  color: "#fff"
                }}
                onClick={() => handleSort("gamesLost")}
              >
                Partidas Perdidas {sortConfig.key === "gamesLost" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
              </th>
              <th
                style={{
                  cursor: "pointer",
                  background: "#2563eb",
                  color: "#fff"
                }}
                onClick={() => handleSort("winrateGames")}
              >
                Winrate Partidas {sortConfig.key === "winrateGames" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map(player => (
              <tr key={player.id} style={{ borderBottom: "2px solid #e0e7ef" }}>
                <td data-label="Nombre" style={{ border: "1px solid #b6c3e6", background: "#fff" }}>{player.name}</td>
                <td data-label="Rondas Ganadas" style={{ border: "1px solid #b6c3e6", background: "#fff" }}>{player.roundsWon}</td>
                <td data-label="Rondas Perdidas" style={{ border: "1px solid #b6c3e6", background: "#fff" }}>{player.roundsLost}</td>
                <td data-label="Winrate Rondas" style={{ border: "1px solid #b6c3e6", background: "#fff" }}>
                  {getWinrate(player.roundsWon, player.roundsLost)}
                </td>
                <td data-label="Partidas Ganadas" style={{ border: "1px solid #b6c3e6", background: "#fff" }}>{player.gamesWon}</td>
                <td data-label="Partidas Perdidas" style={{ border: "1px solid #b6c3e6", background: "#fff" }}>{player.gamesLost}</td>
                <td data-label="Winrate Partidas" style={{ border: "1px solid #b6c3e6", background: "#fff" }}>
                  {getWinrate(player.gamesWon, player.gamesLost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
