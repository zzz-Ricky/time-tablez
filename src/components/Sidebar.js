import React, { useState } from 'react';
import '../renderer/App.css';
import SidebarCalendar from './SidebarCalendar';
import Home from '../pages/Home';
import { parseICS } from '../scripts/icsParser';

function Sidebar({
  updateSelectedWeekRange,
  updateVisibleSchedules,
  visibleSchedules,
  schedules,
  importSchedules,
  setFreeTimeVisibility,
  setConflictVisibility,
  setEventDetailVisibility,
  FreeTimeVisibility,
  ConflictVisibility,
  EventDetailVisibility
}) {
  const [deckName, setDeckName] = useState('');
  const [scheduleNames, setScheduleNames] = useState(schedules.map(() => ''));

  const exportComparison = () => {
    const data = {
      deckName,
      scheduleNames,
      schedules
    };
    const dataStr = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'schedules.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importComparison = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json.schedules)) {
          importSchedules(json.schedules);
          setDeckName(json.deckName || '');
          setScheduleNames(json.scheduleNames || schedules.map(() => ''));
        } else {
          console.error('Imported JSON is not valid');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    fileReader.readAsText(event.target.files[0]);
  };

  const handleScheduleNameChange = (index, value) => {
    const newScheduleNames = [...scheduleNames];
    newScheduleNames[index] = value;
    setScheduleNames(newScheduleNames);
  };

  return (
    <div className="SideBarBody">
      <h1 id='Title'>TimeTablez</h1>
      <textarea
        id='DeckName'
        type="text"
        placeholder='Card Deck Title'
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
      />
      <label className='SidebarText' onClick={exportComparison}>⇱ Export Comparison</label>
      <input type='file' accept='.json' onChange={importComparison} style={{ display: 'none' }} id='importComparisonInput' />
      <label htmlFor='importComparisonInput' className='SidebarText'>⇲ Import Comparison</label>
      <p>Colour Overlays</p>
      <div className='ColorOverlayList'>
        <p className={`ColorType ${FreeTimeVisibility ? 'SelectedColorType' : 'UnSelectedColorType'}`} onClick={setFreeTimeVisibility}>Shared Free Time</p>
        <p className={`ColorType ${ConflictVisibility ? 'SelectedColorType' : 'UnSelectedColorType'}`} onClick={setConflictVisibility}>Schedule Conflicts</p>
        <p className={`ColorType ${EventDetailVisibility ? 'SelectedColorType' : 'UnSelectedColorType'}`} onClick={setEventDetailVisibility}>Event Details</p>
      </div>
      <p>Visible Schedules</p>
      <div className='VisibleSchedules'>
        {schedules.map((schedule, index) => {
          const getScheduleName = (schedule) => {
            try {
              const parsedValue = parseICS(schedule, 'calendar')['X-WR-CALNAME'];
              return parsedValue || 'New Schedule';
            } catch (error) {
              return 'New Schedule';
            }
          };
          return (
            <label className='ScheduleCheckbox' key={index}>
              <input
                type='checkbox'
                defaultChecked={true}
                onChange={(e) => updateVisibleSchedules(e, schedule)}
              />
              <input
                type='text'
                className='ScheduleName'
                placeholder={getScheduleName(schedule)}
                value={scheduleNames[index]}
                onChange={(e) => handleScheduleNameChange(index, e.target.value)}
              />
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
