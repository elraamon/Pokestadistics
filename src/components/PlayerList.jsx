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

  return (
    <div>
      <h3>Jugadores</h3>
      <ul>
        {players.map(player => (
          <li key={player.id}>
            <strong>{player.name}</strong> — Rondas ganadas: {player.roundsWon}, Rondas perdidas: {player.roundsLost}, Partidas ganadas: {player.gamesWon}, Partidas perdidas: {player.gamesLost}
          </li>
        ))}
      </ul>
    </div>
  );
}
