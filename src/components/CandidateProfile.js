import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ProConForm from './ProConForm';

// API base URL - production URL for Vercel deployment
const API_BASE_URL = 'https://kenyavoice.pythonanywhere.com';
const DEFAULT_IMAGE_URL = `${API_BASE_URL}/media/default-profile.png`; // Ensure this image exists on your server

function CandidateProfile() {
  const [candidate, setCandidate] = useState(null);
  const [pros, setPros] = useState([]);
  const [cons, setCons] = useState([]);
  const [showProConForm, setShowProConForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false); // Added for image error tracking
  const { candidateId } = useParams();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const candidateResponse = await axios.get(`${API_BASE_URL}/api/candidates/${candidateId}/`);
        const proConsResponse = await axios.get(`${API_BASE_URL}/api/candidates/${candidateId}/procons/`);
        
        if (isMounted) {
          setCandidate(candidateResponse.data);
          setPros(proConsResponse.data.filter(item => item.type === 'pro'));
          setCons(proConsResponse.data.filter(item => item.type === 'con'));
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching data:', err);
          setError('Failed to load data. Please try again later.');
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [candidateId]);

  const handleVote = (proconId, voteType, value) => {
    axios.post(`${API_BASE_URL}/api/procons/${proconId}/vote/`, {
      vote_type: voteType,
      value: value
    })
      .then(response => {
        axios.get(`${API_BASE_URL}/api/candidates/${candidateId}/procons/`)
          .then(response => {
            setPros(response.data.filter(item => item.type === 'pro'));
            setCons(response.data.filter(item => item.type === 'con'));
          })
          .catch(error => console.error('Error refreshing pros and cons:', error));
      })
      .catch(error => console.error('Error submitting vote:', error));
  };

  const handleProConSubmitted = () => {
    axios.get(`${API_BASE_URL}/api/candidates/${candidateId}/procons/`)
      .then(response => {
        setPros(response.data.filter(item => item.type === 'pro'));
        setCons(response.data.filter(item => item.type === 'con'));
        setShowProConForm(false);
      })
      .catch(error => console.error('Error refreshing pros and cons:', error));
  };

  const toggleProConForm = () => {
    setShowProConForm(!showProConForm);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageError) return DEFAULT_IMAGE_URL;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  if (isLoading) {
    return <div className="loading-container"><span className="spinner"></span>Loading candidate profile...</div>;
  }

  if (error && !candidate) {
    return <div className="error-container">{error}</div>;
  }

  if (!candidate) {
    return <div className="error-container">Candidate not found</div>;
  }

  return (
    <div className="candidate-profile">
      {error && <div className="error-message">{error}</div>}
      
      <div className="profile-header">
        <img 
          src={getImageUrl(candidate.profile_image)}
          alt={`${candidate.name}'s profile`}
          className="candidate-image"
          onError={(e) => { 
            setImageError(true);
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = DEFAULT_IMAGE_URL;
          }}
        />
        <h2>{candidate.name}</h2>
        <p className="seat-label">Running for: {candidate.seat_name}</p>
      </div>

      <div className="bio-section">
        <h3>Biography</h3>
        <p>{candidate.bio || "No biography available."}</p>
      </div>
      
      <div className="pros-cons-container">
        <div className="pros-section">
          <h3>Pros</h3>
          {pros.length === 0 ? (
            <p>No pros submitted yet.</p>
          ) : (
            <ul className="procon-list">
              {pros.map(pro => (
                <li key={pro.id} className="procon-item">
                  <p>{pro.content}</p>
                  <div className="vote-buttons">
                    <div className="vote-group">
                      <button onClick={() => handleVote(pro.id, 'like_dislike', true)} className="vote-btn like-btn">
                        👍 ({pro.likes})
                      </button>
                      <button onClick={() => handleVote(pro.id, 'like_dislike', false)} className="vote-btn dislike-btn">
                        👎 ({pro.dislikes})
                      </button>
                    </div>
                    <div className="vote-group">
                      <button onClick={() => handleVote(pro.id, 'true_false', true)} className="vote-btn true-btn">
                        ✓ ({pro.true_votes})
                      </button>
                      <button onClick={() => handleVote(pro.id, 'true_false', false)} className="vote-btn false-btn">
                        ✗ ({pro.false_votes})
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="cons-section">
          <h3>Cons</h3>
          {cons.length === 0 ? (
            <p>No cons submitted yet.</p>
          ) : (
            <ul className="procon-list">
              {cons.map(con => (
                <li key={con.id} className="procon-item">
                  <p>{con.content}</p>
                  <div className="vote-buttons">
                    <div className="vote-group">
                      <button onClick={() => handleVote(con.id, 'like_dislike', true)} className="vote-btn like-btn">
                        👍 ({con.likes})
                      </button>
                      <button onClick={() => handleVote(con.id, 'like_dislike', false)} className="vote-btn dislike-btn">
                        👎 ({con.dislikes})
                      </button>
                    </div>
                    <div className="vote-group">
                      <button onClick={() => handleVote(con.id, 'true_false', true)} className="vote-btn true-btn">
                        ✓ ({con.true_votes})
                      </button>
                      <button onClick={() => handleVote(con.id, 'true_false', false)} className="vote-btn false-btn">
                        ✗ ({con.false_votes})
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="submit-procon-section">
        <button onClick={toggleProConForm} className="toggle-form-btn">
          {showProConForm ? 'Cancel' : 'Add Pro or Con'}
        </button>
        {showProConForm && (
          <div className="procon-form-container">
            <ProConForm candidateId={candidateId} onSubmitted={handleProConSubmitted} />
          </div>
        )}
      </div>
      
      <Link to={`/seats/${candidate.seat}`} className="back-btn">Back to Candidates</Link>

      <style>{`
        .candidate-profile {
          min-height: 100vh;
          background: linear-gradient(to bottom, #FFFFFF 0%, #F5F5F5 100%);
          padding: 2rem 1rem;
          font-family: 'Lora', serif;
          animation: fadeIn 0.8s ease-in;
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-header {
          text-align: center;
          padding: 2rem 0;
          background: #006400; /* Kenyan green */
          color: #FFFFFF;
          border-radius: 12px 12px 0 0;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .candidate-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #FFFFFF;
          margin-bottom: 1rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 2rem;
          margin: 0;
        }

        .seat-label {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0.5rem 0;
        }

        .bio-section {
          background: #FFFFFF;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1rem 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        h3 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          color: #1C2526;
          margin-bottom: 0.75rem;
        }

        .pros-cons-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin: 1rem 0;
        }

        .pros-section, .cons-section {
          background: #FFFFFF;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .procon-list {
          list-style: none;
          padding: 0;
        }

        .procon-item {
          padding: 1rem;
          border-bottom: 1px solid #E5E5E5;
          transition: background 0.3s ease;
        }

        .procon-item:hover {
          background: #F9F9F9;
        }

        .vote-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .vote-group {
          display: flex;
          gap: 0.5rem;
        }

        .vote-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .like-btn { background: #006400; color: #FFFFFF; }
        .like-btn:hover { background: #004D00; }
        .dislike-btn { background: #8A8A8A; color: #FFFFFF; }
        .dislike-btn:hover { background: #6B6B6B; }
        .true-btn { background: #C8102E; color: #FFFFFF; }
        .true-btn:hover { background: #A30D24; }
        .false-btn { background: #8A8A8A; color: #FFFFFF; }
        .false-btn:hover { background: #6B6B6B; }

        .submit-procon-section {
          text-align: center;
          margin: 2rem 0;
        }

        .toggle-form-btn {
          padding: 0.75rem 2rem;
          background: ${showProConForm ? '#C8102E' : '#006400'};
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .toggle-form-btn:hover {
          background: ${showProConForm ? '#A30D24' : '#004D00'};
        }

        .procon-form-container {
          margin-top: 1rem;
          padding: 1.5rem;
          background: #F9F9F9;
          border-radius: 8px;
          border: 1px solid #E5E5E5;
          animation: slideIn 0.3s ease;
        }

        .back-btn {
          display: block;
          text-align: center;
          padding: 0.75rem;
          background: #C8102E;
          color: #FFFFFF;
          text-decoration: none;
          border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          max-width: 200px;
          margin: 2rem auto;
          transition: background 0.3s ease;
        }

        .back-btn:hover {
          background: #A30D24;
          color: #FFFFFF;
        }

        .loading-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F5F5F5;
          color: #006400;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #C8102E;
          border-top: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        .error-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F5F5F5;
          color: #C8102E;
          font-size: 1.2rem;
        }

        .error-message {
          background: rgba(200, 16, 46, 0.1);
          color: #C8102E;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .pros-cons-container { grid-template-columns: 1fr; }
          h2 { font-size: 1.5rem; }
          .candidate-image { width: 120px; height: 120px; }
        }
      `}</style>
    </div>
  );
}

export default CandidateProfile;