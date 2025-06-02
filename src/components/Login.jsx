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
    <form onSubmit={handleLogin} style={formStyle}>
      <h2 style={titleStyle}>Login</h2>
      <input
        style={inputStyle}
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        style={inputStyle}
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" style={buttonStyle}>Iniciar sesión</button>
      {error && <p style={errorStyle}>{error}</p>}
    </form>
  );
}

const formStyle = {
  maxWidth: "400px",
  margin: "2rem auto",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  backgroundColor: "white",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const titleStyle = {
  marginBottom: "1.5rem",
  color: "#007aff",
  textAlign: "center"
};

const inputStyle = {
  width: "100%",
  padding: "0.7rem 1rem",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "0.7rem 1rem",
  backgroundColor: "#007aff",
  color: "white",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s"
};

const errorStyle = {
  color: "red",
  marginTop: "1rem",
  textAlign: "center"
};


