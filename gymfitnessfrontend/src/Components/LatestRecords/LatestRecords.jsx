import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../LatestRecords/LatestRecords.css';

function LatestRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          alert('User not logged in');
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/attendance/last7days/attendance-records?email=${email}`
        );

        const weightRes = await axios.get(
          `http://localhost:5000/api/attendance/last7days/weight-records?email=${email}`
        );

        const combinedRecords = res.data.map((att) => {
          const weightObj = weightRes.data.find((w) => w.date === att.date);
          return {
            date: att.date,
            status: att.status,
            weight: weightObj ? weightObj.weight : null,
          };
        });

        setRecords(combinedRecords);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching records:', error);
        alert('Failed to fetch records');
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) return <div className="LatestRecords">Loading...</div>;

  return (
    <div className="LatestRecords">
      <h1>Latest Records</h1>

      <div className="records-header">
        <span>Date</span>
        <span>Weight</span>
        <span>Attendance</span>
      </div>

      {records.length === 0 ? (
        <div style={{ color: '#fff', marginTop: '10px' }}>No records found</div>
      ) : (
        records.map((record) => {
          const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          return (
            <div className="records-row" key={record.date}>
              <span>{formattedDate}</span>
              <span>{record.weight ? `${record.weight} kg` : '-'}</span>
              <span className={record.status === 'Present' ? 'present' : 'absent'}>
                {record.status}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}

export default LatestRecords;
