// HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebaseConfig'; // Import your Firestore configuration
import '../styles/HomePage.css';

function HomePage({ setEncryptionKey }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (key.trim()) {
      const docRef = doc(db, "notes", key); // Assuming notes are stored with the encryption key as the document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // If the key exists, navigate to the FilePage
        setEncryptionKey(key);
        navigate(`/files`);
      } else {
        // If the key does not exist, show error or create new
        setEncryptionKey(key);
        navigate(`/files`); // Still navigate to a new file page
      }
    } else {
      setError('Please enter a valid encryption key.');
    }
  };




  return (
    <div>
<header className="header">
  <div className="logo-box">
    <img src="/assets/vcode-removebg-preview (1).png" alt="Your Logo" className="logo" />  {/* Replace with your logo */}
  </div>
  <p>The fastest way to save notes anywhere</p>
  <div className="input-container">
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Enter encryption key"
        value={key}
        onChange={(e) => {
          setKey(e.target.value);
          setError(''); // Reset error when user starts typing
        }}
        className="encryption-box"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" className="start-button">Start</button>
    </form>
  </div>
</header>


      {/* Features Section */}
      <section className="features-section">
        <h2>Features</h2>
        <div className="feature">
          <img src="/assets/no_acc-removebg-preview.png" alt="No Accounts" />
          <h3>No Accounts</h3>
          <p>Start sharing files and notes, no need to sign up.</p>
        </div>
        <div className="feature">
          <img src="/assets/secure-removebg-preview.png" alt="Only You Can Read" />
          <h3>Only You Can Read</h3>
          <p>Your Files and codes are encrypted with your unique code.</p>
        </div>
        <div className="feature">
          <img src="/assets/upload-removebg-preview.png" alt="The Technology" />
          <h3>The Technology</h3>
          <p>All File types able to shared and stored securely.</p>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <h2>The Technology Behind</h2>
        <p>We use AES encryption to ensure your notes are safe...</p>
        <img src="/assets/encry-removebg-preview.png" alt="Encryption" />
      </section>

      {/* Sharing Section */}
      <section className="sharing-section">
        <h2>Sharing</h2>
        <p>Share your Coded Pad & Files securely</p>
          <p>delete and download anytime...</p>
      </section>

      {/* Policy Section */}
      <section className="policy-section">
        <h2>Our Simple Policy</h2>
        <ul>
          <li>Free to use, always.</li>
          <li>Allow you to share all File types.</li>
          <li>Delete Download your files anywhere.</li>
        </ul>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>© 2024 VCODE - All Rights Reserved.</p>
        <p><a href="mailto:Vignancoders1234@gmail.com">Contact Us</a></p>
      </footer>
    </div>
  );
}

export default HomePage;
