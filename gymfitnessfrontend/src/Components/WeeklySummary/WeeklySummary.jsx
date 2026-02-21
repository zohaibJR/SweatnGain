import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../WeeklySummary/WeeklySummary.css';

function WeeklySummary() {
  const [streak, setStreak] = useState(null);
  const [monthlyAvg, setMonthlyAvg] = useState(null);
  const [weightChange, setWeightChange] = useState(null);
  const [weightChangeRaw, setWeightChangeRaw] = useState(null);

  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      try {
        // 1. Monthly attendance for avg calculation
        const monthlyRes = await axios.get(
          `http://localhost:5000/api/attendance/monthly?email=${email}`
        );
        const { presentCount, totalDays } = monthlyRes.data;
        const avg = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(0) : 0;
        setMonthlyAvg(`${avg}% (${presentCount}/${totalDays} days)`);

        // 2. Weight change since first record
        const weightRes = await axios.get(
          `http://localhost:5000/api/attendance/weight-change?email=${email}`
        );
        const { change } = weightRes.data;
        setWeightChangeRaw(change ?? 0);
        const sign = change > 0 ? '+' : '';
        setWeightChange(`${sign}${(change ?? 0).toFixed(1)} kg`);

        // 3. Streak — use check-today + last7days attendance records
        const attRes = await axios.get(
          `http://localhost:5000/api/attendance/last7days/attendance-records?email=${email}`
        );

        // Records come latest-first; reverse to oldest→newest
        const records = [...attRes.data].reverse();

        let currentStreak = 0;
        for (let i = records.length - 1; i >= 0; i--) {
          if (records[i].status === 'Present') {
            currentStreak++;
          } else {
            break;
          }
        }
        setStreak(currentStreak);

      } catch (err) {
        console.error('WeeklySummary fetch error:', err);
      }
    };

    fetchData();
  }, [email]);

  const getWeightColor = () => {
    if (weightChangeRaw === null) return '#fff';
    if (weightChangeRaw > 0) return '#f44336'; // gained weight
    if (weightChangeRaw < 0) return '#4caf50'; // lost weight
    return '#fff'; // no change
  };

  return (
    <div className='WeeklySummaryMain'>
      <h1>Weekly / Monthly Summary</h1>
      <h4>
        🔥 Streak: {streak === null ? 'Loading...' : `${streak} day${streak !== 1 ? 's' : ''}`}
      </h4>
      <h4>
        📅 Monthly Avg Attendance: {monthlyAvg ?? 'Loading...'}
      </h4>
      <h4 style={{ color: getWeightColor() }}>
        ⚖️ Weight Change Since Start: {weightChange ?? 'Loading...'}
      </h4>
    </div>
  );
}

export default WeeklySummary;