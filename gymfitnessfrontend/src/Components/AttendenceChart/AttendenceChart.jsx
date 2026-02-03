import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import './AttendenceChart.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function AttendanceLast10DaysPie() {
  const [attendance, setAttendance] = useState(null);
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!email) return;

    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/last10days/pie?email=${email}`
        );
        setAttendance(res.data);
      } catch (err) {
        console.error('Error fetching attendance data', err);
      }
    };

    fetchAttendance();
  }, [email]);

  if (!attendance) return <p className="NoData">Loading...</p>;

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        label: 'days',
        data: [attendance.presentCount, attendance.absentCount],
        backgroundColor: ['rgb(255, 206, 86)', 'rgb(255, 99, 132)'], // Yellow for Present, Red for Absent
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // <--- important for small containers
    plugins: {
      title: {
        display: true,
        text: `Attendance - Last ${attendance.totalDays} Days`,
        color: '#fff',
        font: { size: 16 }
      },
      legend: { position: 'bottom', labels: { color: '#fff' } }
    }
  };

  return (
    <div className="AttendenceChart">
      {/* <h1>Attendance Last {attendance.totalDays} Days</h1> */}
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default AttendanceLast10DaysPie;
