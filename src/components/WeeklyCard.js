import React, { useState, useEffect } from 'react';
import { parseICS, getTimeZoneID, handleTimeZoneDTSTART, handleTimeZoneDTEND, parseICSToDate, parseICSToLength, parseICSToPosition, groupEventsByDay } from '../scripts/icsParser';

function WeeklyCard({ fileData, range }) {
  const [eventsByDay, setEventsByDay] = useState({});

  useEffect(() => {
    if (fileData && range) {
      const events = parseICS(fileData);
      const filteredEvents = events.filter(event => {
        const startDate = handleTimeZoneDTSTART(event);
        let eventDate;
          if(startDate){
            eventDate = parseICSToDate(event[startDate[0]]); // Convert DTSTART to Date object
            return eventDate >= new Date(range.start) && eventDate <= new Date(range.end);
          }
      });
      const updatedEventsByDay = groupEventsByDay(filteredEvents);
      console.log('eventsByDay', updatedEventsByDay)
      setEventsByDay(updatedEventsByDay);
    }
  }, [fileData, range]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const test = 190

  return (
    <div className="WeeklyBody">
      {days.map((day) => (
        <div key={day} className={`DayDivider ${day === "Sunday" ? 'EndDay' : ''}`}>
          <div className='DayText'>{day}</div>
          {eventsByDay[day] && eventsByDay[day].map((event, eventIndex) => (
            <div key={eventIndex} className='EventOverlay' style={{
              top: !event[handleTimeZoneDTSTART(event)[0]] ? '60px' : `${parseICSToPosition(event[handleTimeZoneDTSTART(event)[0]])}px`,
              height: !event[handleTimeZoneDTSTART(event)[0]] ? '940px' : `${parseICSToLength(event[handleTimeZoneDTSTART(event)[0]], event[handleTimeZoneDTEND(event)[0]])}px`,
            }}>
              {/* 12AM = top:60px, each subsequent hour is offset by 40px, hence the formula */}
              {/* Display event details */}
              <div>{event.SUMMARY}</div>
              <div>Start: {event[handleTimeZoneDTSTART(event)[0]] && parseICSToDate(event[handleTimeZoneDTSTART(event)[0]]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div>End: {event[handleTimeZoneDTEND(event)[0]] && parseICSToDate(event[handleTimeZoneDTEND(event)[0]]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div>Location: {event.LOCATION}</div>
              <div>Description: {event.DESCRIPTION}</div>
              <div>Organizer: {event.ORGANIZER}</div>
            </div>
          ))}
        </div>
      ))}
      <div className='DeleteButton'>
        ×
      </div>
    </div>
  );
}

export default WeeklyCard;
