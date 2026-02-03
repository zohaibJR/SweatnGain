import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Components/NavBar.css';

function NavBar() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  // State to control confirmation popup
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/users/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear localStorage
      localStorage.removeItem('userEmail');
      localStorage.removeItem('token');

      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem('userEmail');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <div className='mainDiv'>
      <div className="LeftSide">
        <h2 className="logo"></h2>
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

      {/* Logout Confirmation Popup */}
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
