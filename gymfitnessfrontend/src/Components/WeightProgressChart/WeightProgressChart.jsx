import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './WeightProgressChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function WeightProgressChart() {
  const [data, setData] = useState([]);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchLast7Days = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/last7days?email=${email}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching weight data", err);
      }
    };
    fetchLast7Days();
  }, [email]);

  const chartData = {
    labels: data.map(item =>
      new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    ),
    datasets: [
      {
        label: 'Weight (kg)',
        data: data.map(item => item.weight),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Weight Progress Last 7 Days'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="WeightProgressChart">
      <h1>Weight Progress</h1>
      {data.length === 0 ? (
        <p className="NoData">No data available</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
}

export default WeightProgressChart;
