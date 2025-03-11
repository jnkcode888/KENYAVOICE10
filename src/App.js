// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'; // Assuming this lists seats
import CandidateList from './components/CandidateList';
import CandidateProfile from './components/CandidateProfile';
import SuggestionForm from './components/SuggestionForm';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/seats" element={<Home />} /> {/* Added: Maps to Home */}
            <Route path="/seats/:seatId" element={<CandidateList />} />
            <Route path="/candidates/:candidateId" element={<CandidateProfile />} />
            <Route path="/suggest" element={<SuggestionForm />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} /> {/* Optional: Catch-all */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;