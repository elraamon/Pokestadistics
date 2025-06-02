import React from "react";
import { db, auth } from "./firebase"; 
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

export default function InsertTestData() {
  const insertData = async () => {
    if (!auth.currentUser) {
      alert("Primero inicia sesión");
      return;
    }

    const userUid = auth.currentUser.uid;

    try {
      // Crear documento de usuario con info básica
      await setDoc(doc(db, "users", userUid), {
        email: auth.currentUser.email,
        createdAt: new Date(),
      });

      // Referencia a subcolección players
      const playersColRef = collection(db, "users", userUid, "players");

      // Añadir jugadores de prueba
      await addDoc(playersColRef, {
        name: "Jugador1",
        roundsWon: 10,
        roundsLost: 5,
        gamesWon: 3,
        gamesLost: 2,
      });

      await addDoc(playersColRef, {
        name: "Jugador2",
        roundsWon: 7,
        roundsLost: 8,
        gamesWon: 4,
        gamesLost: 5,
      });

      alert("Datos de prueba insertados");
    } catch (error) {
      alert("Error al insertar datos: " + error.message);
    }
  };

  return (
    <div>
      <button onClick={insertData}>Insertar datos de prueba</button>
    </div>
  );
}
