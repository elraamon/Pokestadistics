import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);

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

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!players.length) return <p>No tienes jugadores añadidos.</p>;

  // Calcula winrates
  const getWinrate = (won, lost) => {
    const total = Number(won) + Number(lost);
    if (total === 0) return "0%";
    return ((Number(won) / total) * 100).toFixed(1) + "%";
  };

  return (
    <div>
      <h3>Jugadores</h3>
      <div style={{ overflowX: "auto" }}>
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rondas Ganadas</th>
              <th>Rondas Perdidas</th>
              <th>Winrate Rondas</th>
              <th>Partidas Ganadas</th>
              <th>Partidas Perdidas</th>
              <th>Winrate Partidas</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id}>
                <td data-label="Nombre">{player.name}</td>
                <td data-label="Rondas Ganadas">{player.roundsWon}</td>
                <td data-label="Rondas Perdidas">{player.roundsLost}</td>
                <td data-label="Winrate Rondas">
                  {getWinrate(player.roundsWon, player.roundsLost)}
                </td>
                <td data-label="Partidas Ganadas">{player.gamesWon}</td>
                <td data-label="Partidas Perdidas">{player.gamesLost}</td>
                <td data-label="Winrate Partidas">
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
