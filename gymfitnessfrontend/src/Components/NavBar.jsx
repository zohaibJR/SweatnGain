import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../Components/AssetsComponents/Logo.png';
import '../Components/NavBar.css';

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      navigate('/');
    }
  };

  return (
    <nav className='mainDiv'>
      {/* LEFT — Logo */}
<div className="navLeft">
  <img src={Logo} alt="SweatAndGain Logo" className="navLogo" />
  <span className="navBrand">SweatAndGain 💪</span>
</div>

      {/* RIGHT — Links + Logout */}
      <div className="navRight">
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
              <button className="yesBtn" onClick={handleLogout}>Yes, Logout</button>
              <button className="noBtn" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;