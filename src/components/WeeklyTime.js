import React, { useState } from 'react';

function WeeklyTime({ timeFormat, handleChange}) {

  // 12-hour format
  const _12HourTime = [
    '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  // 24-hour format
  const _24HourTime = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const selectedTimeArray = timeFormat === '12Hour' ? _12HourTime : _24HourTime;

  return (
    <div className='WeeklyTime'>
      <select value={timeFormat} onChange={handleChange} id='TimeFormat'>
        <option value="12Hour">12-hour format</option>
        <option value="24Hour">24-hour format</option>
      </select>
      <ul className='TimeElements'>
        {selectedTimeArray.map((time, index) => (
          <li key={index}>{time}</li>
        ))}
      </ul>
    </div>
  );
}

export default WeeklyTime;
