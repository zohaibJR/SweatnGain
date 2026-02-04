import React from 'react'
import '../QuickView/QuickView.css'

import LatestRecords from '../LatestRecords/LatestRecords'
import QuickActions from '../QuickActions/QuickActions'
import WeeklySummary from '../WeeklySummary/WeeklySummary'

function QuickView() {
  return (
    <div className='QuickView'>
      <LatestRecords />
      <QuickActions />
      <WeeklySummary />
    </div>
  )
}

export default QuickView
