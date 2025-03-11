// src/components/ProConForm.js
import React, { useState } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

// API base URL - production URL for Vercel deployment
const API_BASE_URL = 'https://kenyavoice.pythonanywhere.com';

function ProConForm({ candidateId, onSubmitted }) {
  const [formData, setFormData] = useState({
    content: '',
    type: 'pro'
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    
    axios.post(`${API_BASE_URL}/api/candidates/${candidateId}/procons/`, {
      ...formData,
      candidate: candidateId,
      captcha: captchaValue
    })
      .then(response => {
        setMessage('Your submission has been received and is pending approval.');
        setFormData({
          content: '',
          type: 'pro'
        });
        setCaptchaValue(null);
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        if (onSubmitted) {
          onSubmitted();
        }
        setIsLoading(false);
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setError(error.response.data.detail || 'An error occurred. Please try again.');
        } else {
          setError('An error occurred. Please try again.');
        }
        setIsLoading(false);
      });
  };

  return (
    <div className="procon-form">
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type:</label>
          <select 
            name="type" 
            value={formData.type}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="type-select"
          >
            <option value="pro">Pro</option>
            <option value="con">Con</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Enter your pro or con here..."
            disabled={isLoading}
            className="content-textarea"
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
            'Submit'
          )}
        </button>
      </form>

      <style>{`
        .procon-form {
          background: #FFFFFF;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          font-family: 'Lora', serif;
          animation: fadeIn 0.5s ease;
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

        .type-select {
          width: 100%;
          padding: 0.75rem;
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          color: #1C2526;
          background: #F5F5F5;
          border: 2px solid #006400; /* Kenyan green */
          border-radius: 6px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .type-select:focus {
          border-color: #C8102E; /* Kenyan red */
          box-shadow: 0 0 5px rgba(200, 16, 46, 0.3);
          outline: none;
        }

        .type-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .content-textarea {
          width: 100%;
          padding: 0.75rem;
          font-family: 'Lora', serif;
          font-size: 1rem;
          color: #1C2526;
          background: #F5F5F5;
          border: 2px solid #006400;
          border-radius: 6px;
          resize: vertical;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .content-textarea:focus {
          border-color: #C8102E;
          box-shadow: 0 0 5px rgba(200, 16, 46, 0.3);
          outline: none;
        }

        .content-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          width: 100%;
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
          .procon-form {
            padding: 1rem;
          }

          label {
            font-size: 1rem;
          }

          .type-select, .content-textarea, .submit-btn {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ProConForm;