import React from 'react'
import '../LatestRecords/LatestRecords.css'

function LatestRecords() {
  return (
    <div className='LatestRecords'>
      <h1>Latest Records</h1>

      {/* Table Header */}
      <div className="records-header">
        <span>Date</span>
        <span>Weight</span>
        <span>Attendance</span>
      </div>

      {/* Table Rows (dummy for now) */}
      <div className="records-row">
        <span>2026-02-01</span>
        <span>72 kg</span>
        <span className="present">Present</span>
      </div>

      <div className="records-row">
        <span>2026-01-31</span>
        <span>72.5 kg</span>
        <span className="absent">Absent</span>
      </div>

      <div className="records-row">
        <span>2026-01-30</span>
        <span>73 kg</span>
        <span className="present">Present</span>
      </div>
    </div>
  )
}

export default LatestRecords
