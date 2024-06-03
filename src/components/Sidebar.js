import React from 'react';
import '../renderer/App.css';
import SidebarCalendar from './SidebarCalendar';
import Home from '../pages/Home';
import {parseICS} from '../scripts/icsParser';


function Sidebar({ updateSelectedWeekRange, updateVisibleSchedules, visibleSchedules, schedules }) {
  return (
    <div className="SideBarBody">
      <h1 id='Title'>TimeTablez</h1>
      <textarea id='DeckName' type="text" placeholder='Card Deck Title'/>
      <h3>Export Comparison</h3>
      <h3>Import Comparison</h3>
      <p>Visible Schedules</p>
      <div className='VisibleSchedules'>
      { schedules.map((schedule) => {
        const getScheduleName = (schedule) => {
          try {
            const parsedValue = parseICS(schedule, 'calendar')['X-WR-CALNAME'];
            return parsedValue || 'New Schedule';
          } catch (error) {
            return 'New Schedule';
          }
        };
      return (
        <label className='ScheduleCheckbox' key={schedule}>
          <input type='checkbox' defaultChecked={true} onChange={(e) => updateVisibleSchedules(e, schedule)}/>
          <input type='text' className='ScheduleName' placeholder={getScheduleName(schedule)} />
        </label>
      );
    })}
      </div>
      <div className='SideBarCal'>
      <SidebarCalendar updateSelectedWeekRange={updateSelectedWeekRange} />
      </div>

    </div>
  );
}

export default Sidebar;
