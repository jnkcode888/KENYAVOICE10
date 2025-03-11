import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaArrowLeft, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [seatName, setSeatName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { seatId } = useParams();

  const API_BASE_URL = 'https://kenyavoice.pythonanywhere.com';
  const DEFAULT_IMAGE_URL = `${API_BASE_URL}/media/default-profile.png`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const seatResponse = await axios.get(`${API_BASE_URL}/api/seats/${seatId}/`);
        setSeatName(seatResponse.data.name);
        const candidatesResponse = await axios.get(`${API_BASE_URL}/api/seats/${seatId}/candidates/`);
        console.log('Candidates Response:', JSON.stringify(candidatesResponse.data, null, 2));
        setCandidates(candidatesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load candidates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [seatId]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return DEFAULT_IMAGE_URL; // Falls back since profile_image is undefined
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-box">
          <FaExclamationTriangle className="error-icon" />
          <p>{error}</p>
        </div>
        <Link to="/seats" className="back-btn">
          <FaArrowLeft /> Back to Seats
        </Link>
      </div>
    );
  }

  return (
    <div className="candidate-container">
      <div className="header-section">
        <h2>
          <span className="header-label">Candidates for</span> {seatName}
        </h2>
        <Link to="/seats" className="back-btn">
          <FaArrowLeft /> Back to Seats
        </Link>
      </div>

      {candidates.length === 0 ? (
        <div className="no-candidates">
          No candidates have been registered for this seat yet.
        </div>
      ) : (
        <div className="candidates-grid">
          {candidates.map(candidate => (
            <div key={candidate.id} className="candidate-card">
              <div className="card-image">
                <img 
                  src={getImageUrl(candidate.profile_image)} // Uses fallback
                  alt={candidate.name} 
                  loading="lazy"
                  onError={(e) => { e.target.src = DEFAULT_IMAGE_URL; }}
                />
                {candidate.party && (
                  <span className="party-tag">{candidate.party}</span>
                )}
              </div>
              <div className="card-content">
                <h5 title={candidate.name}>{candidate.name}</h5>
                {candidate.position && <p className="position">{candidate.position}</p>}
                <Link to={`/candidates/${candidate.id}`} className="view-btn">
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline CSS */}
      <style>{`
        .candidate-container {
          min-height: 100vh;
          background: linear-gradient(to bottom, #F5F5F5 0%, #FFFFFF 100%);
          padding: 2rem 1rem;
          font-family: 'Lora', serif;
          animation: fadeIn 0.8s ease-in;
        }

        .header-section {
          max-width: 1200px;
          margin: 0 auto 2rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #006400;
          padding-bottom: 1rem;
        }

        h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 2rem;
          color: #1C2526;
          margin: 0;
        }

        .header-label {
          font-size: 1rem;
          color: #8A8A8A;
          display: block;
          margin-bottom: 0.5rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #C8102E;
          color: #FFFFFF;
          text-decoration: none;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .back-btn:hover {
          background: #A30D24;
          color: #FFFFFF;
        }

        .loading-container {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #F5F5F5;
          color: #006400;
        }

        .spinner {
          font-size: 2rem;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .error-container {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #F5F5F5;
          padding: 2rem;
        }

        .error-box {
          background: rgba(200, 16, 46, 0.1);
          color: #C8102E;
          padding: 1.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .error-icon {
          font-size: 1.5rem;
        }

        .no-candidates {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem;
          background: #FFFFFF;
          border: 1px solid #8A8A8A;
          border-radius: 8px;
          text-align: center;
          color: #1C2526;
        }

        .candidates-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .candidate-card {
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .candidate-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .card-image {
          position: relative;
          height: 180px;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .party-tag {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: #006400;
          color: #FFFFFF;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .card-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-content h5 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.2rem;
          color: #1C2526;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .position {
          font-size: 0.9rem;
          color: #8A8A8A;
          margin: 0;
        }

        .view-btn {
          display: block;
          text-align: center;
          padding: 0.75rem;
          background: #006400;
          color: #FFFFFF;
          text-decoration: none;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .view-btn:hover {
          background: #004D00;
          color: #FFFFFF;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          h2 { font-size: 1.5rem; }
          .header-label { font-size: 0.9rem; }
          .back-btn { padding: 0.5rem 1rem; }
        }
      `}</style>
    </div>
  );
}

export default CandidateList;