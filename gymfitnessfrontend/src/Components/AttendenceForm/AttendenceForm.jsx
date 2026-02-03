import React, { useState } from 'react';
import axios from 'axios';
import '../AttendenceForm/AttendeceForm.css';

function AttendenceForm() {
  const [attendance, setAttendance] = useState('');
  const [weight, setWeight] = useState('');
  const [isSubmittedToday, setIsSubmittedToday] = useState(false);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const email = localStorage.getItem("userEmail");

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
      setIsSubmittedToday(true); // 🔒 Lock form after success

    } catch (err) {
      alert(err.response?.data?.message || "Error submitting attendance");
      setIsSubmittedToday(true); // 🔒 Lock even if already submitted
    }
  };

  return (
    <div className="FormMain">
      <form className="AttendanceForm" onSubmit={handleSubmit}>
        <h2 className="DateHeading">{formattedDate}</h2>

        <div className="RadioGroup">
          <label>
            <input
              type="radio"
              name="attendance"
              value="Present"
              disabled={isSubmittedToday}
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
              disabled={isSubmittedToday}
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
            disabled={isSubmittedToday}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight"
          />
        </div>

        <button
          type="submit"
          className="SubmitBtn"
          disabled={isSubmittedToday}
        >
          {isSubmittedToday ? "Already Submitted" : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default AttendenceForm;
