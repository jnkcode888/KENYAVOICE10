// src/components/SuggestionForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

// API base URL - production URL for Vercel deployment
const API_BASE_URL = 'https://kenyavoice.pythonanywhere.com';

function SuggestionForm() {
  const [seats, setSeats] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    seat: '',
    reason: ''
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${API_BASE_URL}/api/seats/`)
      .then(response => {
        setSeats(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching seats:', error);
        setError('Failed to load seats. Please refresh the page.');
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!captchaValue) {
      setError('Please complete the CAPTCHA');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    axios.post(`${API_BASE_URL}/api/suggestions/`, {
      ...formData,
      captcha: captchaValue
    })
      .then(response => {
        setMessage('Your suggestion has been received and is pending approval.');
        setFormData({
          name: '',
          seat: '',
          reason: ''
        });
        setCaptchaValue(null);
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        setIsLoading(false);
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setError(error.response.data.detail || 'An error occurred. Please try againJIT.');
        } else {
          setError('An error occurred. Please try again.');
        }
        setIsLoading(false);
      });
  };

  return (
    <div className="suggestion-form-container">
      <h2>Suggest a Politician</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="suggestion-form">
        <div className="form-group">
          <label>Politician Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter politician's name"
            disabled={isLoading}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Seat:</label>
          <select 
            name="seat" 
            value={formData.seat}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="form-select"
          >
            <option value="">-- Select a Seat --</option>
            {seats.map(seat => (
              <option key={seat.id} value={seat.id}>
                {seat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Reason (Optional):</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            placeholder="Why should this politician be added?"
            disabled={isLoading}
            className="form-textarea"
          />
        </div>

        <div className="captcha-container">
          <ReCAPTCHA
            sitekey="6LcQjvAqAAAAALL9lpmf03YxP8iJszTyNiEs_lbf" // Replace with your actual reCAPTCHA site key
            onChange={handleCaptchaChange}
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            'Submit Suggestion'
          )}
        </button>
      </form>

      <style>{`
        .suggestion-form-container {
          max-width: 600px;
          margin: 2rem auto;
          background: #FFFFFF;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          font-family: 'Lora', serif;
          animation: fadeIn 0.5s ease;
          background: linear-gradient(to bottom, #FFFFFF 0%, #F5F5F5 100%);
        }

        h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.8rem;
          color: #1C2526;
          text-align: center;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .suggestion-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          font-family: 'Poppins', sans-serif;
          font-size: 1.1rem;
          color: #1C2526;
          margin-bottom: 0.5rem;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 0.75rem;
          font-family: 'Lora', serif;
          font-size: 1rem;
          color: #1C2526;
          background: #FFFFFF;
          border: 2px solid #006400; /* Kenyan green */
          border-radius: 6px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #C8102E; /* Kenyan red */
          box-shadow: 0 0 5px rgba(200, 16, 46, 0.3);
          outline: none;
        }

        .form-input:disabled, .form-select:disabled, .form-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-textarea {
          resize: vertical;
          rows: 3;
        }

        .captcha-container {
          margin: 1.5rem 0;
          display: flex;
          justify-content: center;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          background: #006400; /* Kenyan green */
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          font-family: 'Poppins', sans-serif;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .submit-btn:hover:not(:disabled) {
          background: #004D00;
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          background: #8A8A8A;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid #FFFFFF;
          border-top: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        .success-message {
          background: rgba(0, 100, 0, 0.1);
          color: #006400;
          padding: 1rem;
          border-radius: 6px;
          text-align: center;
          margin-bottom: 1rem;
        }

        .error-message {
          background: rgba(200, 16, 46, 0.1);
          color: #C8102E;
          padding: 1rem;
          border-radius: 6px;
          text-align: center;
          margin-bottom: 1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .suggestion-form-container {
            padding: 1.5rem;
            margin: 1rem;
          }

          h2 {
            font-size: 1.5rem;
          }

          label {
            font-size: 1rem;
          }

          .form-input, .form-select, .form-textarea, .submit-btn {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default SuggestionForm;