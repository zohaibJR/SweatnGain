import React from 'react'
import '../SummaryCards/SummaryCards.css'
import AttendenceCard from '../AttendenceCard/AttendenceCard'
import MonthlyAttendence from '../MonthlyAttendeceCard/MonthlyAttendence'
import CurrentWeight from '../CurrentWeight/CurrentWeight'
// import WeightChange from '../WeightChange/WeightChange'

function SummaryCards() {
  return (
    <div className='SummaryCardsMain'>
      {/* <h1>Summary Cards</h1> */}
      <div className='Cards'>
        <AttendenceCard />
        <MonthlyAttendence />
        <CurrentWeight />
        {/* <WeightChange /> */}
      </div>
    </div>
  )
}

export default SummaryCards
