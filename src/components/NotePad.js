import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const NotePad = ({ encryptionKey }) => {
  const [note, setNote] = useState("");

  const saveNote = async () => {
    if (!encryptionKey) return alert('Please enter encryption key');
    const encryptedNote = CryptoJS.AES.encrypt(note, encryptionKey).toString();
    try {
      await setDoc(doc(db, "notes", encryptionKey), {
        content: encryptedNote,
        createdAt: new Date().toISOString(),
      });
      alert("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type your notes here..."
      />
      <button onClick={saveNote}>Save Note</button>
    </div>
  );
};

export default NotePad;
