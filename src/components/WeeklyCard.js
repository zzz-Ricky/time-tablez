import React, { useState, useEffect } from 'react';
import { parseICS, parseICSToDate, groupEventsByDay } from '../scripts/icsParser';

function WeeklyCard({ fileData, range }) {
  const [eventsByDay, setEventsByDay] = useState({});

  useEffect(() => {
    if (fileData && range) {
      const events = parseICS(fileData);
      const filteredEvents = events.filter(event => {
        const eventDate = parseICSToDate(event.DTSTART); // Convert DTSTART to Date object
        // console.log("eventDate", eventDate);
        // console.log("range.start", range.start);
        return eventDate >= new Date(range.start) && eventDate <= new Date(range.end);
      });
      // console.log("unfilteredEvents", events)
      // console.log("filteredEvents", filteredEvents)
      const updatedEventsByDay = groupEventsByDay(filteredEvents); // Use filteredEvents
      setEventsByDay(updatedEventsByDay);
    }
  }, [fileData, range]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="WeeklyBody">
      {days.map((day) => (
        <div key={day} className={`DayDivider ${day === "Sunday" ? 'EndDay' : ''}`}>
          <div className='DayText'>{day}</div>
          {eventsByDay[day] && eventsByDay[day].map((event, eventIndex) => (
            <div key={eventIndex} className='EventOverlay'>
              {/* Display event details */}
              <div>{event.SUMMARY}</div>
              <div>{event.DTSTART && parseICSToDate(event.DTSTART).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
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
