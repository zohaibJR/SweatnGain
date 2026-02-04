import React from 'react';
import './WeightProgress.css';
import WeightProgressChart from '../WeightProgressChart/WeightProgressChart';
import AttendenceChart from '../AttendenceChart/AttendenceChart';

function WeightProgress() {
  return (
    <div className="WeightProgress">
      <div className="ProgressCharts">
        <WeightProgressChart />
        <AttendenceChart />
      </div>
    </div>
  );
}

export default WeightProgress;
