import React, { useEffect, useState } from "react";
import axios from "axios";
import "../WeightChange/WeightChange.css";

function WeightChange() {
  const [firstWeight, setFirstWeight] = useState(0);
  const [latestWeight, setLatestWeight] = useState(0);
  const [change, setChange] = useState(0);

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return;

    const fetchWeightChange = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/weight-change?email=${email}`
        );

        const { firstWeight, latestWeight, change } = res.data;

        setFirstWeight(firstWeight || 0);
        setLatestWeight(latestWeight || 0);
        setChange(change || 0);
      } catch (error) {
        console.error("Weight change fetch failed:", error);
      }
    };

    fetchWeightChange();
  }, [email]);

  // Determine CSS class and arrow based on weight change
  const getChangeClass = () => {
    if (change > 0) return "increase";
    if (change < 0) return "decrease";
    return "neutral";
  };

  const getChangeArrow = () => {
    if (change > 0) return "⬆";
    if (change < 0) return "⬇";
    return "⏺"; // neutral symbol
  };

  return (
    <div className="WeightChange">
      <h1>Weight Change</h1>

      <h2 className={getChangeClass()}>
        {getChangeArrow()} {Math.abs(change).toFixed(1)} kg
      </h2>

      <p>
        Start Weight: <strong>{firstWeight} kg</strong> | Current Weight:{" "}
        <strong>{latestWeight} kg</strong>
      </p>
    </div>
  );
}

export default WeightChange;
