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

function AttendenceChart() {
  const [attendance, setAttendance] = useState(null);
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!email) return;

    const fetchAttendance = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/attendance/last10days/pie?email=${email}`
      );
      setAttendance(res.data);
    };

    fetchAttendance();
  }, [email]);

  if (!attendance) return <p className="NoData">Loading...</p>;

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [attendance.presentCount, attendance.absentCount],
        backgroundColor: ['rgb(255,206,86)', 'rgb(255,99,132)']
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Attendance - Last ${attendance.totalDays} Days`,
        color: '#fff'
      },
      legend: {
        position: 'bottom',
        labels: { color: '#fff' }
      }
    }
  };

  return (
    <div className="AttendenceChart">
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default AttendenceChart;
