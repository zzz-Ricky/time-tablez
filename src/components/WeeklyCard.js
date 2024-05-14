import React from 'react'

function WeeklyCard() {
  return (
    <div className="WeeklyBody">
      <div className='DayDivider'>Monday</div>
      <div className='DayDivider'>Tuesday</div>
      <div className='DayDivider'>Wednesday</div>
      <div className='DayDivider'>Thursday</div>
      <div className='DayDivider'>Friday</div>
      <div className='DayDivider'>Saturday</div>
      <div className='DayDivider' id='EndDay'>Sunday</div>
    </div>
  )
}

export default WeeklyCard
