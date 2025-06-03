import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login exitoso!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div style={{ height: "48px" }} /> {/* Espacio para separar del navbar */}
      <h1
        style={{
          textAlign: "center",
          marginTop: "2rem",
          marginBottom: "1.5rem",
          fontSize: "2.2rem",
          color: "#2563eb",
        }}
      >
        Inicia sesión
      </h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar sesión</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
  );
}


