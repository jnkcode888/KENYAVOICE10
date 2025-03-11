// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API base URL - production URL for Vercel deployment
const API_BASE_URL = 'https://kenyavoice.pythonanywhere.com';

function Home() {
  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${API_BASE_URL}/api/seats/`)
      .then(response => {
        setSeats(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching seats:', error);
        setError('Oops! We couldn’t load the seats. Please try refreshing the page.');
        setIsLoading(false);
      });
  }, []);

  const handleSeatClick = (seatId) => {
    navigate(`/seats/${seatId}`);
  };

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to Kenya Voice</h1>
        <p className="subtitle">Your Revision Notes for the 2027 Elections!</p>
        <div className="personal-note">
          <p>
            I built this site because of what I’ve seen this year. I’ve never voted in my life, 
            but come 2027, I will—armed with these revision notes so I don’t forget what our 
            politicians have done. This is for me, but by extension, it’s for you too.
          </p>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <main className="seats-section">
        {isLoading ? (
          <div className="loading">
            <span className="spinner"></span>
            <p>Loading seats...</p>
          </div>
        ) : (
          <div className="seats-grid">
            {seats.length === 0 ? (
              <p className="no-seats">No seats available yet. Check back soon!</p>
            ) : (
              seats.map(seat => (
                <div
                  key={seat.id}
                  className="seat-card"
                  onClick={() => handleSeatClick(seat.id)}
                >
                  <div className="seat-content">
                    <h3>{seat.name}</h3>
                    <span className="explore-btn">Explore Candidates</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Inline CSS */}
      <style>{`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #006400 0%, #1C2526 100%);
          padding: 2rem;
          font-family: 'Lora', serif;
          overflow-y: auto;
        }

        .hero-section {
          text-align: center;
          color: #F5F5F5;
          padding: 3rem 1rem;
          animation: fadeIn 1s ease-in;
        }

        h1 {
          font-family: 'Poppins', sans-serif;
          font-size: 3rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin: 0;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
        }

        .subtitle {
          font-size: 1.5rem;
          opacity: 0.9;
          margin: 0.5rem 0;
        }

        .tagline {
          font-size: 1.1rem;
          color: #A30D24; /* Muted Kenyan red */
          font-style: italic;
          margin: 1rem 0;
          animation: slideUp 1.5s ease-out;
        }

        .personal-note {
          max-width: 700px;
          margin: 1.5rem auto 0;
          padding: 1rem;
          background: rgba(245, 245, 245, 0.05); /* Very subtle off-white */
          border-radius: 8px;
          border: 1px solid rgba(0, 100, 0, 0.3); /* Subtle green border */
          font-size: 1rem;
          color: #F5F5F5;
          opacity: 0.85;
          line-height: 1.5;
          animation: slideUp 2s ease-out;
        }

        .personal-note p {
          margin: 0;
        }

        .seats-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 0;
        }

        .seats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .seat-card {
          background: rgba(245, 245, 245, 0.1); /* Subtle off-white with transparency */
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          border: 1px solid rgba(0, 100, 0, 0.5); /* Subtle green */
        }

        .seat-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          border-color: #A30D24; /* Muted red on hover */
        }

        .seat-content {
          text-align: center;
          color: #F5F5F5; /* Match text to background */
        }

        .seat-card h3 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.4rem;
          margin: 0 0 1rem 0;
          opacity: 0.95;
        }

        .explore-btn {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(0, 100, 0, 0.7); /* Subdued green */
          color: #F5F5F5;
          border-radius: 20px;
          font-size: 0.9rem;
          transition: background 0.3s ease;
        }

        .seat-card:hover .explore-btn {
          background: #A30D24; /* Muted red on hover */
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #F5F5F5;
          font-size: 1.2rem;
          min-height: 20vh;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 4px solid #A30D24;
          border-top: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .error-message {
          background: rgba(163, 13, 36, 0.2); /* Muted red background */
          color: #F5F5F5;
          padding: 1rem 2rem;
          border-radius: 8px;
          margin: 1rem auto;
          max-width: 600px;
          text-align: center;
          border: 1px solid #A30D24;
        }

        .no-seats {
          color: #F5F5F5;
          font-size: 1.2rem;
          text-align: center;
          padding: 2rem;
          background: rgba(245, 245, 245, 0.1);
          border-radius: 8px;
          opacity: 0.8;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          h1 { font-size: 2rem; }
          .subtitle { font-size: 1.2rem; }
          .tagline { font-size: 1rem; }
          .personal-note { font-size: 0.9rem; padding: 0.8rem; }
          .seat-card h3 { font-size: 1.2rem; }
          .seats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

export default Home;