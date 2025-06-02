import React, { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddPlayer() {
  const [name, setName] = useState("");
  const [roundsWon, setRoundsWon] = useState(0);
  const [roundsLost, setRoundsLost] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [gamesLost, setGamesLost] = useState(0);
  const [error, setError] = useState(null);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    setError(null);

    if (!auth.currentUser) {
      setError("Debes iniciar sesión primero.");
      return;
    }

    try {
      const playersRef = collection(db, "users", auth.currentUser.uid, "players");
      await addDoc(playersRef, {
        name,
        roundsWon: Number(roundsWon),
        roundsLost: Number(roundsLost),
        gamesWon: Number(gamesWon),
        gamesLost: Number(gamesLost),
      });
      alert("Jugador añadido");
      setName("");
      setRoundsWon(0);
      setRoundsLost(0);
      setGamesWon(0);
      setGamesLost(0);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleAddPlayer}>
      <h3>Añadir jugador</h3>
      <input type="text" placeholder="Nombre jugador" value={name} onChange={e => setName(e.target.value)} required />
      <input type="number" placeholder="Rondas ganadas" value={roundsWon} onChange={e => setRoundsWon(e.target.value)} min="0" required />
      <input type="number" placeholder="Rondas perdidas" value={roundsLost} onChange={e => setRoundsLost(e.target.value)} min="0" required />
      <input type="number" placeholder="Partidas ganadas" value={gamesWon} onChange={e => setGamesWon(e.target.value)} min="0" required />
      <input type="number" placeholder="Partidas perdidas" value={gamesLost} onChange={e => setGamesLost(e.target.value)} min="0" required />
      <button type="submit">Añadir jugador</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
