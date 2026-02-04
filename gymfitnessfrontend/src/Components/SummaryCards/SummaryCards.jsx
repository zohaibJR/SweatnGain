import React from 'react';
import AttendenceCard from '../AttendenceCard/AttendenceCard';
import MonthlyAttendence from '../MonthlyAttendeceCard/MonthlyAttendence';
import CurrentWeight from '../CurrentWeight/CurrentWeight';
import './SummaryCards.css';

function SummaryCards() {
  return (
    <div className='SummaryCardsMain'>
      <div className='Cards'>
        <AttendenceCard />
        <MonthlyAttendence />
        <CurrentWeight />
      </div>
    </div>
  );
}

export default SummaryCards;
