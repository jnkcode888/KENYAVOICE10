// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          KenyaVoice
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/suggest" className="nav-links">Suggest Politician</Link>
          </li>
        </ul>
      </div>

      <style>{`
        .navbar {
          background: #1C2526; /* Dark gray */
          padding: 1rem 0;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.5s ease;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          overflow: hidden;
        }

        .navbar-logo {
          font-family: 'Poppins', sans-serif;
          font-size: 1.8rem;
          font-weight: bold;
          color: #FFFFFF;
          text-decoration: none;
          letter-spacing: 1px;
          transition: color 0.3s ease;
          flex-shrink: 0;
        }

        .navbar-logo:hover,
        .navbar-logo:active {
          color: #C8102E; /* Kenyan red on hover and tap */
        }

        .nav-menu {
          list-style: none;
          display: flex;
          gap: 2rem;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .nav-item {
          position: relative;
        }

        .nav-links {
          font-family: 'Poppins', sans-serif;
          font-size: 1.2rem;
          color: #FFFFFF;
          text-decoration: none;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
          border-radius: 4px;
          white-space: nowrap;
        }

        /* Apply hover and active states for both desktop and mobile */
        .nav-links:hover,
        .nav-links:active {
          background: #C8102E; /* Kenyan red */
          color: #FFFFFF;
          transform: translateY(-1px);
        }

        .nav-links::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          background: rgb(233, 218, 218);
          bottom: -2px;
          left: 50%;
          transition: all 0.3s ease;
        }

        .nav-links:hover::after,
        .nav-links:active::after {
          width: 50%;
          left: 25%;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 1rem;
          }

          .nav-menu {
            gap: 1rem;
          }

          .navbar-logo {
            font-size: 1.5rem;
          }

          .nav-links {
            font-size: 1rem;
            padding: 0.4rem 0.6rem;
          }
        }

        @media (max-width: 480px) {
          .navbar-container {
            padding: 0 0.75rem;
          }

          .navbar-logo {
            font-size: 1.3rem;
          }

          .nav-links {
            font-size: 0.9rem;
            padding: 0.3rem 0.5rem;
          }

          .nav-menu {
            gap: 0.75rem;
          }
        }

        @media (max-width: 360px) {
          .navbar-logo {
            font-size: 1.2rem;
          }

          .nav-links {
            font-size: 0.8rem;
            padding: 0.25rem 0.4rem;
          }

          .nav-menu {
            gap: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;