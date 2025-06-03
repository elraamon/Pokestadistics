import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { reload } from "firebase/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // nuevo estado
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar displayName en el perfil
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      await reload(userCredential.user);

      alert("Registro exitoso!");
      // Aquí podrías redirigir o limpiar campos si quieres
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div style={{ height: "48px" }} /> {/* Espacio para separar del navbar */}
      <h1 style={{ textAlign: "center", marginTop: "2rem", marginBottom: "1.5rem", fontSize: "2.2rem", color: "#2563eb" }}>
        Regístrate
      </h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
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
          minLength={6}
        />
        <button type="submit">Registrar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
  );
}
