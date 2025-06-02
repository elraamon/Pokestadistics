import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AddPlayer() {
  const [form, setForm] = useState({
    name: "",
    roundsWon: "",
    roundsLost: "",
    gamesWon: "",
    gamesLost: ""
  });
  const [error, setError] = useState("");
  const [mode, setMode] = useState(true); // true = Añadir, false = Editar
  const [players, setPlayers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();

  // Cargar jugadores existentes
  useEffect(() => {
    async function fetchPlayers() {
      if (!auth.currentUser) return;
      try {
        const playersRef = collection(db, "users", auth.currentUser.uid, "players");
        const snapshot = await getDocs(playersRef);
        const playersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlayers(playersData);
      } catch (err) {
        // No mostrar error aquí, solo para editar
      }
    }
    fetchPlayers();
  }, []);

  // Autocompletar datos al seleccionar jugador en modo editar
  useEffect(() => {
    if (!mode && selectedId) {
      const player = players.find(p => p.id === selectedId);
      if (player) {
        setForm({
          name: player.name || "",
          roundsWon: player.roundsWon || "",
          roundsLost: player.roundsLost || "",
          gamesWon: player.gamesWon || "",
          gamesLost: player.gamesLost || ""
        });
      }
    }
    if (mode) {
      setForm({
        name: "",
        roundsWon: "",
        roundsLost: "",
        gamesWon: "",
        gamesLost: ""
      });
      setSelectedId("");
    }
  }, [mode, selectedId, players]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleModeToggle = () => {
    setMode(m => !m);
    setError("");
  };

  const handleSelectChange = e => {
    setSelectedId(e.target.value);
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.name) {
      setError("El nombre es obligatorio");
      return;
    }
    try {
      const playersRef = collection(db, "users", auth.currentUser.uid, "players");
      if (mode) {
        // Añadir
        await addDoc(playersRef, {
          name: form.name,
          roundsWon: Number(form.roundsWon) || 0,
          roundsLost: Number(form.roundsLost) || 0,
          gamesWon: Number(form.gamesWon) || 0,
          gamesLost: Number(form.gamesLost) || 0
        });
      } else {
        // Editar
        if (!selectedId) {
          setError("Selecciona un jugador para editar");
          return;
        }
        const playerDoc = doc(db, "users", auth.currentUser.uid, "players", selectedId);
        await updateDoc(playerDoc, {
          name: form.name,
          roundsWon: Number(form.roundsWon) || 0,
          roundsLost: Number(form.roundsLost) || 0,
          gamesWon: Number(form.gamesWon) || 0,
          gamesLost: Number(form.gamesLost) || 0
        });
      }
      navigate("/list");
    } catch (err) {
      setError("Error al guardar jugador");
    }
  };

  // Detecta si es móvil para ajustar el tamaño de los inputs y el card
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 600);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="card"
      style={{
        maxWidth: isMobile ? "98vw" : 420,
        margin: isMobile ? "1rem auto" : "2rem auto",
        width: "100%",
        padding: isMobile ? "1rem 0.5rem" : "2rem 2.5rem",
        boxSizing: "border-box"
      }}
    >
      <h2 style={{ fontSize: isMobile ? "1.3rem" : undefined }}>
        {mode ? "Añadir Jugador" : "Editar Jugador"}
      </h2>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", justifyContent: "center" }}>
        <span style={{ fontWeight: 600, color: mode ?  "#888" : "#2563eb" }}>Editar</span>
        <button
          type="button"
          onClick={handleModeToggle}
          style={{
            width: 48,
            height: 28,
            borderRadius: 16,
            border: "none",
            background: mode ? "#2563eb" : "#ccc",
            position: "relative",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          aria-label="Cambiar entre añadir y editar"
        >
          <span
            style={{
              display: "block",
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#fff",
              position: "absolute",
              top: 3,
              left: mode ? 22 : 3,
              boxShadow: "0 1px 4px #0002",
              transition: "left 0.2s"
            }}
          />
        </button>
        <span style={{ fontWeight: 600, color: !mode ?  "#888" : "#2563eb" }}>Añadir</span>
      </div>
      {!mode && (
        <select
          value={selectedId}
          onChange={handleSelectChange}
          style={{
            marginBottom: "1.2rem",
            padding: "0.7rem",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: "1rem",
            width: "100%"
          }}
        >
          <option value="">Selecciona un jugador</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <label style={{ fontWeight: 600, marginBottom: 2, fontSize: isMobile ? "1rem" : undefined }}>Nombre</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              padding: isMobile ? "0.7rem 0.7rem" : "0.85rem 1rem",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              color: "#23232b",
              fontSize: isMobile ? "1rem" : "1rem",
              marginBottom: 6
            }}
          />
          <label style={{ fontWeight: 600, marginBottom: 2, fontSize: isMobile ? "1rem" : undefined }}>Rondas ganadas</label>
          <input
            name="roundsWon"
            type="number"
            value={form.roundsWon}
            onChange={handleChange}
            style={{
              padding: isMobile ? "0.7rem 0.7rem" : "0.85rem 1rem",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              color: "#23232b",
              fontSize: isMobile ? "1rem" : "1rem",
              marginBottom: 6
            }}
          />
          <label style={{ fontWeight: 600, marginBottom: 2, fontSize: isMobile ? "1rem" : undefined }}>Rondas perdidas</label>
          <input
            name="roundsLost"
            type="number"
            value={form.roundsLost}
            onChange={handleChange}
            style={{
              padding: isMobile ? "0.7rem 0.7rem" : "0.85rem 1rem",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              color: "#23232b",
              fontSize: isMobile ? "1rem" : "1rem",
              marginBottom: 6
            }}
          />
          <label style={{ fontWeight: 600, marginBottom: 2, fontSize: isMobile ? "1rem" : undefined }}>Partidas ganadas</label>
          <input
            name="gamesWon"
            type="number"
            value={form.gamesWon}
            onChange={handleChange}
            style={{
              padding: isMobile ? "0.7rem 0.7rem" : "0.85rem 1rem",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              color: "#23232b",
              fontSize: isMobile ? "1rem" : "1rem",
              marginBottom: 6
            }}
          />
          <label style={{ fontWeight: 600, marginBottom: 2, fontSize: isMobile ? "1rem" : undefined }}>Partidas perdidas</label>
          <input
            name="gamesLost"
            type="number"
            value={form.gamesLost}
            onChange={handleChange}
            style={{
              padding: isMobile ? "0.7rem 0.7rem" : "0.85rem 1rem",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              color: "#23232b",
              fontSize: isMobile ? "1rem" : "1rem",
              marginBottom: 12
            }}
          />
        </div>
        {error && <div className="text-muted" style={{ color: "red" }}>{error}</div>}
        <button
          type="submit"
          style={{
            width: "100%",
            minWidth: 0,
            fontSize: isMobile ? "1rem" : "1rem",
            padding: isMobile ? "0.8rem" : undefined
          }}
        >
          {mode ? "Añadir" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
