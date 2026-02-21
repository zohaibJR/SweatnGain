import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AttendenceCard.css';

function AttendenceCard() {
  const [status, setStatus] = useState(null);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return;

    const fetchTodayStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/check-today?email=${email}`
        );
        if (res.data.marked) {
          setStatus(res.data.status);
        } else {
          setStatus('Not Marked');
        }
      } catch (err) {
        console.error("Failed to fetch today's attendance:", err);
        setStatus('Error');
      }
    };

    fetchTodayStatus();
  }, [email]);

  const getStatusStyle = () => {
    if (status === 'Present') return { color: '#4caf50' };
    if (status === 'Absent') return { color: '#f44336' };
    return { color: '#aaa' };
  };

  return (
    <div className='DashboardCard'>
      <h1>Attendance Today</h1>
      <h2 style={getStatusStyle()}>
        {status === null ? 'Loading...' : status}
      </h2>
    </div>
  );
}

export default AttendenceCard;