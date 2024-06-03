import React, { useState, useEffect } from 'react';
import { parseICS, getTimeZoneID, handleTimeZoneDTSTART, handleTimeZoneDTEND, parseICSToDate, parseICSToLength, parseICSToPosition, groupEventsByDay } from '../scripts/icsParser';

function WeeklyCard({ fileData, range, timeFormat, deleteSchedule}) {
  const [eventsByDay, setEventsByDay] = useState({});

  useEffect(() => {
    if (fileData && range) {
      const events = parseICS(fileData, 'events');
      const updatedEventsByDay = groupEventsByDay(events, range);

      setEventsByDay(updatedEventsByDay);
    }
  }, [fileData, range]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const timeOptions = timeFormat === '24Hour' ? { hour: '2-digit', minute: '2-digit', hour12: false } : { hour: '2-digit', minute: '2-digit', hour12: true };


  return (
    <div className="WeeklyBody">
      {days.map((day) => (
        <div key={day} className={`DayDivider ${day === "Sunday" ? 'EndDay' : ''}`}>
          <div className='DayText'>{day}</div>
          {eventsByDay[day] && eventsByDay[day].map((event, eventIndex) => (
            <div key={eventIndex} className='EventOverlay' style={{
              top: !event[handleTimeZoneDTSTART(event)[0]] ? '60px' : `${parseICSToPosition(event[handleTimeZoneDTSTART(event)[0]])}px`,
              height: !event[handleTimeZoneDTSTART(event)[0]] ? '900px' : `${parseICSToLength(event[handleTimeZoneDTSTART(event)[0]], event[handleTimeZoneDTEND(event)[0]])}px`,
            }}>
              {/* Display event details */}
              <div>{event.SUMMARY}</div>
              <div>Start: {event[handleTimeZoneDTSTART(event)[0]] && parseICSToDate(event[handleTimeZoneDTSTART(event)[0]]).toLocaleTimeString([], timeOptions)}</div>
              <div>End: {event[handleTimeZoneDTEND(event)[0]] && parseICSToDate(event[handleTimeZoneDTEND(event)[0]]).toLocaleTimeString([], timeOptions)}</div>
              <div>Location: {event.LOCATION}</div>
              <div>Description: {event.DESCRIPTION}</div>
              <div>Organizer: {event.ORGANIZER}</div>
            </div>
          ))}
        </div>
      ))}
      <div className='DeleteButton' onClick={(e) => deleteSchedule(e, fileData)}>
        ×
      </div>
    </div>
  );
}

export default WeeklyCard;
