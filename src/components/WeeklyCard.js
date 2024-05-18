import React, { useState, useEffect } from 'react';
import { parseICS, groupEventsByDay } from '../scripts/icsParser';

function WeeklyCard({ fileData }) {
  const [eventsByDay, setEventsByDay] = useState({});

  useEffect(() => {
    if (fileData) {
      const events = parseICS(fileData);
      const updatedEventsByDay = groupEventsByDay(events);
      setEventsByDay(updatedEventsByDay);
    }
  }, [fileData]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="WeeklyBody">
      {days.map((day, index) => (
        <div key={day} className={`DayDivider ${day === "Sunday" ? 'EndDay' : ''}`}>
          <div className='DayText'>{day}</div>
          {eventsByDay[day] && eventsByDay[day].map((event, eventIndex) => (
            <div key={eventIndex} className='EventOverlay'>
              {/* Display event details */}
              <div>{event.SUMMARY}</div>
              <div>{event.DTSTART && event.DTSTART.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div>{event.LOCATION}</div>
              <div>{event.DESCRIPTION}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default WeeklyCard;
