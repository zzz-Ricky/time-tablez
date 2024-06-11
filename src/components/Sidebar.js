import React, { useEffect } from 'react';
import '../renderer/App.css';
import SidebarCalendar from './SidebarCalendar';
import Home from '../pages/Home';
import {parseICS} from '../scripts/icsParser';


function Sidebar({
    updateSelectedWeekRange,
    updateVisibleSchedules,
    visibleSchedules,
    schedules,
    setFreeTimeVisibility,
    setConflictVisibility,
    setEventDetailVisibility,
    FreeTimeVisibility,
    ConflictVisibility,
    EventDetailVisibility}) {

  return (
    <div className="SideBarBody">
      <h1 id='Title'>TimeTablez</h1>
      <textarea id='DeckName' type="text" placeholder='Card Deck Title'/>
      <h3 className='SidebarText'>⇱ Export Comparison</h3>
      <h3 className='SidebarText'>⇲ Import Comparison</h3>
      <p>Colour Overlays</p>
      <div className='ColorOverlayList'>
        <p className={`ColorType ${FreeTimeVisibility ? 'SelectedColorType' : 'UnSelectedColorType'}`} onClick={setFreeTimeVisibility}>Shared Free Time</p>
        <p className={`ColorType ${ConflictVisibility ? 'SelectedColorType' : 'UnSelectedColorType'}`} onClick={setConflictVisibility}>Schedule Conflicts</p>
        <p className={`ColorType ${EventDetailVisibility ? 'SelectedColorType' : 'UnSelectedColorType'}`} onClick={setEventDetailVisibility}>Event Details</p>
      </div>
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
