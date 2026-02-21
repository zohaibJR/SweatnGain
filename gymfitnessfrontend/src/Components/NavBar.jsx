import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Components/NavBar.css';

function NavBar() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/logout', {});
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isLoggedIn');
      navigate('/');
    }
  };

  return (
    <div className='mainDiv'>
      <div className="LeftSide">
        <h2 className="logo">SweatAndGain 💪</h2>
      </div>

      <div className="RightSide">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/attendence">Mark Attendance</Link></li>
          <li><Link to="/aboutus">About Us</Link></li>
          <li>
            <button className="logoutBtn" onClick={() => setShowConfirm(true)}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {showConfirm && (
        <div className="popupOverlay">
          <div className="popupBox">
            <h3>Are you sure you want to logout?</h3>
            <div className="popupButtons">
              <button className="yesBtn" onClick={handleLogout}>Yes</button>
              <button className="noBtn" onClick={() => setShowConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;