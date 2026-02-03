import React from 'react'
import '../QuickView/QuickView.css'

import LatestRecords from '../LatestRecords/LatestRecords'
import QuickActions from '../QuickActions/QuickActions'

function QuickView() {
  return (
    <div className='QuickView'>
      <LatestRecords />
      <QuickActions />
      <LatestRecords />
    </div>
  )
}

export default QuickView
