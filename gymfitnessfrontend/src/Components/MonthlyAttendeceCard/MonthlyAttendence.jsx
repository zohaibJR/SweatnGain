import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../MonthlyAttendeceCard/MonthlyAttendence.css';

function MonthlyAttendence() {
  const [attendance, setAttendance] = useState(null);
  const email = localStorage.getItem("userEmail"); // get logged-in user's email

  useEffect(() => {
    const fetchMonthlyAttendance = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/monthly?email=${email}`
        );
        setAttendance(res.data);
      } catch (err) {
        console.error("Error fetching monthly attendance:", err);
      }
    };

    if (email) fetchMonthlyAttendance();
  }, [email]);

  return (
    <div className="MonthlyAttendenceCard">
      <h1>Monthly Attendance</h1>
      <h2>
        {attendance
          ? `${attendance.presentCount} / ${attendance.totalDays} Days`
          : "Loading..."}
      </h2>
    </div>
  );
}

export default MonthlyAttendence;
