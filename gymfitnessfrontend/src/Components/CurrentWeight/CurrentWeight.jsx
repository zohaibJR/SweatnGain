import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CurrentWeight/CurrentWeight.css';

function CurrentWeight() {

  const [weight, setWeight] = useState(null);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchWeight = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/latest?email=${email}`
        );
        setWeight(res.data.weight);
      } catch (err) {
        console.error(err);
      }
    };

    if (email) fetchWeight();
  }, [email]);

  return (
    <div className="CurrentWeight">
      <h1>Current Weight</h1>
      <h2>{weight !== null ? `${weight} kg` : "Loading..."}</h2>
    </div>
  );
}

export default CurrentWeight;
