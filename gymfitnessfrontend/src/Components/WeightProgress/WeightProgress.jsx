import React from 'react'
import '../WeightProgress/WeightProgress.css'
import WeightProgressChart from '../WeightProgressChart/WeightProgressChart'
import AttendenceChart from '../AttendenceChart/AttendenceChart'

function WeightProgress() {
  return (
    <div className='WeightProgress'>
        {/* <h1>Weight Progress</h1> */}
        <div className='ProgressCharts'>
            <WeightProgressChart />
            <AttendenceChart />
        </div>
    </div>
  )
}

export default WeightProgress
