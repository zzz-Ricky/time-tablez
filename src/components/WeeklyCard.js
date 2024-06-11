import React, { useState, useEffect } from 'react';
import { parseICS, getTimeZoneID, handleTimeZoneDTSTART, handleTimeZoneDTEND, parseICSToDate, parseICSToLength, parseICSToPosition, groupEventsByDay } from '../scripts/icsParser';
import { parseDateToPosition, parseDateToLength } from '../scripts/eventCompare';

function WeeklyCard({
      keyProp,
      fileData,
      range,
      timeFormat,
      deleteSchedule,
      reportEvents,
      compareEvents,
      fullComparison,
      FreeTimeVisibility,
      ConflictVisibility,
      EventDetailVisibility}) {
  const [eventsByDay, setEventsByDay] = useState({});
  const [conflictsByDay, setConflictByDay] = useState({});

  useEffect(() => {
    if (fileData && range) {
      const events = parseICS(fileData, 'events');
      const updatedEventsByDay = groupEventsByDay(events, range);
      setEventsByDay(updatedEventsByDay);
      reportEvents(keyProp, updatedEventsByDay)
    }
  }, [fileData,range]);

  useEffect(() => {
    if (fileData && range) {
      setConflictByDay(compareEvents(eventsByDay));
    }
  }, [fullComparison]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const timeOptions = timeFormat === '24Hour' ? { hour: '2-digit', minute: '2-digit', hour12: false } : { hour: '2-digit', minute: '2-digit', hour12: true };


  return (
    <div className="WeeklyBody">
      {days.map((day) => (
        <div key={day} className={`DayDivider ${day === "Sunday" ? 'EndDay' : ''}`}>
          <div className='DayText'>{day}</div>
          {EventDetailVisibility && eventsByDay[day] && eventsByDay[day].map((event, eventIndex) => (
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
{ConflictVisibility && conflictsByDay && conflictsByDay.conflictTime &&
  conflictsByDay.conflictTime
    .filter(conflict => conflict.day === day)
    .map((conflict, conflictIndex) => (
      <div key={conflictIndex} className='ConflictOverlay' style={{
        top: `${parseDateToPosition(conflict.startDate)}px`,
        height: `${parseDateToLength(conflict.startDate, conflict.endDate)}px`,
      }}>
      </div>
    ))
}

{FreeTimeVisibility && conflictsByDay && conflictsByDay.commonFreeTime &&
  conflictsByDay.commonFreeTime
    .filter(FreeTime => FreeTime.day === day)
    .map((FreeTime, FreeTimeIndex) => (
      <div key={FreeTimeIndex} className='FreeTimeOverlay' style={{
        top: `${parseDateToPosition(FreeTime.startDate)}px`,
        height: `${parseDateToLength(FreeTime.startDate, FreeTime.endDate)}px`,
      }}>
      </div>
    ))
}
        </div>
      ))}
      <div className='DeleteButton' onClick={(e) => deleteSchedule(e, fileData)}>
        ×
      </div>
    </div>
  );


}

export default WeeklyCard;
