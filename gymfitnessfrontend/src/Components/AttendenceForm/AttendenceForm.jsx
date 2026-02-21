import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AttendenceForm/AttendeceForm.css';

function AttendenceForm() {
  const [attendance, setAttendance] = useState('');
  const [weight, setWeight] = useState('');
  const [isSubmittedToday, setIsSubmittedToday] = useState(false);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const email = localStorage.getItem("userEmail");

  // On mount, check if attendance already marked today
  useEffect(() => {
    const checkToday = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/check-today?email=${email}`
        );
        if (res.data.marked) {
          setIsSubmittedToday(true);
          setTodayStatus(res.data.status);
        }
      } catch (err) {
        console.error("Error checking today's attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    if (email) checkToday();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!attendance || !weight) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/attendance', {
        email,
        status: attendance,
        weight: parseFloat(weight)
      });

      alert(res.data.message);
      setIsSubmittedToday(true);
      setTodayStatus(attendance);
    } catch (err) {
      const msg = err.response?.data?.message || "Error submitting attendance";
      alert(msg);
      if (err.response?.status === 400) {
        // Already marked (e.g. by cron)
        setIsSubmittedToday(true);
      }
    }
  };

  if (loading) return <div className="FormMain"><p style={{ color: '#fff' }}>Loading...</p></div>;

  return (
    <div className="FormMain">
      {isSubmittedToday ? (
        <div className="AttendanceForm">
          <h2 className="DateHeading">{formattedDate}</h2>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: '#aaa', fontSize: '16px' }}>Attendance already submitted today</p>
            <h2 style={{ color: todayStatus === 'Present' ? '#4caf50' : '#f44336', marginTop: '10px' }}>
              {todayStatus === 'Present' ? '✅ Present' : '❌ Absent'}
            </h2>
          </div>
        </div>
      ) : (
        <form className="AttendanceForm" onSubmit={handleSubmit}>
          <h2 className="DateHeading">{formattedDate}</h2>

          <div className="RadioGroup">
            <label>
              <input
                type="radio"
                name="attendance"
                value="Present"
                checked={attendance === 'Present'}
                onChange={(e) => setAttendance(e.target.value)}
              />
              Present
            </label>

            <label>
              <input
                type="radio"
                name="attendance"
                value="Absent"
                checked={attendance === 'Absent'}
                onChange={(e) => setAttendance(e.target.value)}
              />
              Absent
            </label>
          </div>

          <div className="WeightInput">
            <label>Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
              step="0.1"
              min="0"
            />
          </div>

          <button type="submit" className="SubmitBtn">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default AttendenceForm;