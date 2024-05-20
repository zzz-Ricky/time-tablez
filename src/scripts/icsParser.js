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
  console.log("Events", events);
  return events;
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
  console.log("events: ", events)
  for (const event in events) {
    // Ensure the event has the necessary properties
    console.log("event: ", events[event])
    if (events[event] && events[event].DTSTART) {
      const startDate = parseICSToDate(events[event].DTSTART);
      console.log("CHECKPOINT1", startDate);
      if (isNaN(startDate)) continue;

      let recurrenceDays = [startDate.getDay()]; // Initial day

      // Check if the event has a recurrence rule (RRULE)
      if (events[event].RRULE) {
        // For simplicity, assume daily recurrence
        const recurrenceRule = events[event].RRULE.toUpperCase();
        if (recurrenceRule.includes("FREQ=DAILY")) {
          // Extract the count or until from RRULE to determine the range of recurrence
          let range = Infinity; // Default to infinite recurrence
          const countMatch = recurrenceRule.match(/COUNT=(\d+)/);
          const untilMatch = recurrenceRule.match(/UNTIL=(\d{8}T\d{6}Z)/);
          if (countMatch) {
            range = parseInt(countMatch[1]);
          } else if (untilMatch) {
            const untilDate = parseICSToDate(untilMatch[1]);
            range = Math.ceil((untilDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Calculate days including the start date
          }

          // Update recurrenceDays with additional days based on range
          for (let i = 1; i < range; i++) {
            const nextDay = parseICSToDate(startDate);
            nextDay.setDate(startDate.getDate() + i);
            recurrenceDays.push(nextDay.getDay());
          }
        }
      }

      // Exclude dates specified in EXDATE
      if (events[event].EXDATE && Array.isArray(events[event].EXDATE)) {
        events[event].EXDATE.forEach(excludedDate => {
          const excludedDay = parseICSToDate(excludedDate).getDay();
          const index = recurrenceDays.indexOf(excludedDay);
          if (index !== -1) {
            recurrenceDays.splice(index, 1); // Remove excluded date from recurrence days
          }
        });
      }

      // Group the event under each recurrence day
      for (const dayIndex of recurrenceDays) {
        const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
        // Ensure the day exists in the eventsByDay object
        if (!eventsByDay[day]) {
          eventsByDay[day] = [];
        }

        // Push the event to the corresponding day's array
        eventsByDay[day].push(events[event]);
      }
    }
  }
  console.log("eventsByDay", eventsByDay);
  return eventsByDay;
}
