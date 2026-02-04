import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MonthlyAttendence.css';

function MonthlyAttendence() {
  const [attendance, setAttendance] = useState(null);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchMonthlyAttendance = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/monthly?email=${email}`
        );
        setAttendance(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (email) fetchMonthlyAttendance();
  }, [email]);

  return (
    <div className="DashboardCard">
      <h1>Monthly Attendance</h1>
      <h2>
        {attendance ? `${attendance.presentCount} / ${attendance.totalDays} Days` : "Loading..."}
      </h2>
    </div>
  );
}

export default MonthlyAttendence;
