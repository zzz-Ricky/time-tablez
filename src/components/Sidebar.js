import React from 'react';
import '../renderer/App.css';
import SidebarCalendar from './SidebarCalendar';
import Home from '../pages/Home';

function Sidebar({ updateSelectedWeekRange, updateVisibleSchedules, visibleSchedules }) {
  return (
    <div className="SideBarBody">
      <h1 id='Title'>TimeTablez</h1>
      <textarea id='DeckName' type="text" placeholder='Card Deck Title'/>
      <h3>Export Comparison</h3>
      <h3>Import Comparison</h3>
      <p>Visible Schedules</p>
      <div className='VisibleSchedules'>
      {visibleSchedules.map((schedule) => (
          <label className='ScheduleCheckbox' key={schedule}>
            <input type='checkbox' />
            {schedule}
          </label>
        ))}
      </div>
      <div className='SideBarCal'>
      <SidebarCalendar updateSelectedWeekRange={updateSelectedWeekRange} />
      </div>

    </div>
  );
}

export default Sidebar;
