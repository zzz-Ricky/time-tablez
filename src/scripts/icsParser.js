export function parseICS(icsData) {
  let events = [];
  let event = null;

  // Split the input data by lines
  const lines = icsData.split(/\r?\n/);

  for (const line of lines) {
      // Check if line starts a new event
      if (line.startsWith('BEGIN:VEVENT')) {
          event = {};
      } else if (line.startsWith('END:VEVENT')) {
          // Push the event object into events array when reaching end of event
          if (event) {
              events.push(event);
          }
          event = null;
      } else if (event) {
          // Parse event properties
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim(); // Rejoin split parts in case ':' appears in the value
          if (key && value) {
              const propertyName = key.trim().toUpperCase(); // Convert property name to uppercase
              let propertyValue = value.trim();
              // Convert date-time strings to Date objects
              if (propertyName === 'DTSTART' || propertyName === 'DTEND') {
                  // Check if the value is a date-time string
                  if (/^\d{8}T\d{6}$/.test(propertyValue)) {
                      const year = parseInt(propertyValue.slice(0, 4));
                      const month = parseInt(propertyValue.slice(4, 6)) - 1; // Months are 0-indexed
                      const day = parseInt(propertyValue.slice(6, 8));
                      const hours = parseInt(propertyValue.slice(9, 11));
                      const minutes = parseInt(propertyValue.slice(11, 13));
                      const seconds = parseInt(propertyValue.slice(13, 15));
                      propertyValue = new Date(year, month, day, hours, minutes, seconds);
                  }
              } else if (propertyName === 'EXDATE') {
                  // Check if EXDATE value is already an array, if not, initialize one
                  if (!event[propertyName]) {
                      event[propertyName] = [];
                  }
                  // Push the EXDATE value to the array
                  event[propertyName].push(propertyValue);
              }
              event[propertyName] = propertyValue;
          }
      }
  }
  // console.log("Events", events);
  return events;
}

export function getTimeZoneID() {
  const date = new Date();
  const options = { timeZoneName: 'short' };
  const timeZoneAbbreviation = new Intl.DateTimeFormat('en-US', options).formatToParts(date).find(part => part.type === 'timeZoneName').value;
  return timeZoneAbbreviation;
}

export function handleTimeZoneDTSTART(events) {
  var values = Object.keys(events).filter(function(el) {
    return /^DTSTART.*?/i.test(el);
  });
  return values;
}

  // Function to parse ICS DTSTART to Date object
export function parseICSToDate(dateTimeString) {
    const year = dateTimeString.substr(0, 4);
    const month = parseInt(dateTimeString.substr(4, 2)) - 1; // Month is zero-based in JavaScript Date object
    const day = dateTimeString.substr(6, 2);
    const hour = dateTimeString.substr(9, 2);
    const minute = dateTimeString.substr(11, 2);
    const second = dateTimeString.substr(13, 2);
    return new Date(year, month, day, hour, minute, second);
  };

  export function groupEventsByDay(events) {
    let eventsByDay = {};

    for (const eventIndex in events) {
      const event = events[eventIndex];
      const DTSTART = handleTimeZoneDTSTART(event);

      if (event && event[DTSTART[0]]) {
        const startDate = parseICSToDate(event[DTSTART[0]]);
        if (isNaN(startDate)) continue;

        let recurrenceDays = [startDate.getDay()]; // Initial day

        console.log('recurrenceDays', recurrenceDays)
        if (event.RRULE) {
          const recurrenceRules = event.RRULE.split(';');
          recurrenceRules.forEach(rule => {
            const [key, value] = rule.split('=');
            if (key === 'FREQ') {
              if (value === 'DAILY') {
                let range = Infinity;
                const countMatch = event.RRULE.match(/COUNT=(\d+)/);
                const untilMatch = event.RRULE.match(/UNTIL=(\d{8}T\d{6}Z)/);
                if (countMatch) {
                  range = parseInt(countMatch[1]);
                } else if (untilMatch) {
                  const untilDate = new Date(untilMatch[1]);
                  range = Math.ceil((untilDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                }
                for (let i = 1; i < range; i++) {
                  const nextDay = new Date(startDate);
                  nextDay.setDate(startDate.getDate() + i);
                  recurrenceDays.push(nextDay.getDay());
                }
              } else if (value === 'WEEKLY') {
                const weekDays = event.RRULE.match(/BYDAY=([A-Z,]+)/)[1].split(',');
                const startDay = startDate.getDay();
                weekDays.forEach(day => {
                  const diff = ('SU MO TU WE TH FR SA'.indexOf(day) - startDay + 7) % 7;
                  const nextDay = new Date(startDate);
                  nextDay.setDate(startDate.getDate() + diff);
                  recurrenceDays.push(nextDay.getDay());
                });
              } else if (value === 'MONTHLY') {
                const startDayOfMonth = startDate.getDate();
                const byMonthDayMatch = event.RRULE.match(/BYMONTHDAY=(\d+)/);
                const byWeekDayMatch = event.RRULE.match(/BYDAY=([-+]?\d+)([A-Z]+)/);
                if (byMonthDayMatch) {
                  const monthDay = parseInt(byMonthDayMatch[1]);
                  const maxDays = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
                  const monthDays = [];
                  for (let i = monthDay; i <= maxDays; i += parseInt(byMonthDayMatch[1])) {
                    monthDays.push(i);
                  }
                  monthDays.forEach(day => {
                    const nextDay = new Date(startDate);
                    nextDay.setDate(day);
                    recurrenceDays.push(nextDay.getDay());
                  });
                } else if (byWeekDayMatch) {
                  const weekDay = byWeekDayMatch[1];
                  const weekIndex = byWeekDayMatch[2];
                  let targetDayIndex = startDate.getDay();
                  const targetDate = new Date(startDate);
                  if (weekIndex === 'SU') {
                    targetDate.setDate(1); // Move to the first day of the month
                    targetDayIndex = targetDate.getDay(); // Get the weekday index of the first day
                  }
                  const dayOfWeek = 'SU MO TU WE TH FR SA'.indexOf(weekDay);
                  const diff = dayOfWeek - targetDayIndex;
                  let targetDateOfMonth = 1 + diff;
                  if (diff < 0) targetDateOfMonth += 7; // Move to the next week if needed
                  targetDate.setDate(targetDateOfMonth);
                  while (targetDate.getMonth() === startDate.getMonth()) {
                    recurrenceDays.push(targetDate.getDay());
                    targetDate.setDate(targetDate.getDate() + 7);
                  }
                }
              } else if (value === 'YEARLY') {
                const yearDaysMatch = event.RRULE.match(/BYYEARDAY=(\d+)/);
                const monthDaysMatch = event.RRULE.match(/BYMONTHDAY=(\d+)/);
                const monthWeekDaysMatch = event.RRULE.match(/BYDAY=([-+]?\d+)([A-Z]+)/);
                if (yearDaysMatch) {
                  const yearDay = parseInt(yearDaysMatch[1]);
                  const targetDate = new Date(startDate.getFullYear(), 0); // Start from January
                  targetDate.setDate(yearDay);
                  while (targetDate.getFullYear() === startDate.getFullYear()) {
                    recurrenceDays.push(targetDate.getDay());
                    targetDate.setDate(targetDate.getDate() + 365); // Assuming no leap years for simplicity
                  }
                } else if (monthDaysMatch) {
                  const monthDay = parseInt(monthDaysMatch[1]);
                  const maxDays = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
                  const monthDays = [];
                  for (let i = monthDay; i <= maxDays; i += parseInt(monthDaysMatch[1])) {
                    monthDays.push(i);
                  }
                  monthDays.forEach(day => {
                    const nextDate = new Date(startDate.getFullYear(), startDate.getMonth(), day);
                    recurrenceDays.push(nextDate.getDay());
                  });
                } else if (monthWeekDaysMatch) {
                  const weekDay = monthWeekDaysMatch[1];
                  const weekIndex = monthWeekDaysMatch[2];
                  let targetDate = new Date(startDate.getFullYear(), 0); // Start from January
                  const dayOfWeek = 'SU MO TU WE TH FR SA'.indexOf(weekDay);
                  const diff = dayOfWeek - targetDate.getDay();
                  let targetDateOfMonth = 1 + diff;
                  if (diff < 0) targetDateOfMonth += 7; // Move to the next week if needed
                  targetDate.setDate(targetDateOfMonth);
                  if (weekIndex === 'SU') {
                    targetDate.setDate(1); // Move to the first day of the month
                    targetDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDateOfMonth);
                  }
                  while (targetDate.getFullYear() === startDate.getFullYear()) {
                    recurrenceDays.push(targetDate.getDay());
                    targetDate.setDate(targetDate.getDate() + 7);
                  }
                }
              }
            }
          });
        }
        if (event.EXDATE && Array.isArray(event.EXDATE)) {
          event.EXDATE.forEach(excludedDate => {
            const excludedDay = parseICSToDate(excludedDate).getDay();
            const index = recurrenceDays.indexOf(excludedDay);
            if (index !== -1) {
              recurrenceDays.splice(index, 1);
            }
          });
        }
        for (const dayIndex of recurrenceDays) {
          const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
          if (!eventsByDay[day]) {
            eventsByDay[day] = [];
          }
          eventsByDay[day].push(event);
        }
      }
    }
    return eventsByDay;
  }
