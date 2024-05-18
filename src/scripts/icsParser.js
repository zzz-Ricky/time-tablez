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
              console.log(propertyName,": ",event[propertyName]);
          }
      }
  }
  console.log("Events", events);
  return events;
}

export function groupEventsByDay(events) {
  let eventsByDay = {};

  for (const event of events) {
    // Ensure the event has the necessary properties
    if (event && event.DTSTART instanceof Date) {
      let recurrenceDays = [event.DTSTART.getDay()]; // Initial day

      // Check if the event has a recurrence rule (RRULE)
      if (event.RRULE) {
        // For simplicity, assume daily recurrence
        const recurrenceRule = event.RRULE.toUpperCase();
        if (recurrenceRule.includes("FREQ=DAILY")) {
          // Extract the count or until from RRULE to determine the range of recurrence
          let range = Infinity; // Default to infinite recurrence
          const countMatch = recurrenceRule.match(/COUNT=(\d+)/);
          const untilMatch = recurrenceRule.match(/UNTIL=(\d{8}T\d{6}Z)/);
          if (countMatch) {
            range = parseInt(countMatch[1]);
          } else if (untilMatch) {
            const untilDate = new Date(untilMatch[1]);
            const today = new Date();
            range = Math.ceil((untilDate - today) / (1000 * 60 * 60 * 24)); // Calculate remaining days until untilDate
          }

          // Update recurrenceDays with additional days based on range
          for (let i = 1; i < range; i++) {
            const nextDay = (recurrenceDays[recurrenceDays.length - 1] + 1) % 7; // Increment day cyclically
            recurrenceDays.push(nextDay);
          }
        }
      }

      // Exclude dates specified in EXDATE
      if (event.EXDATE && Array.isArray(event.EXDATE)) {
        event.EXDATE.forEach(excludedDate => {
          const excludedDay = new Date(excludedDate).getDay();
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
        eventsByDay[day].push(event);
      }
    }
  }

  console.log("Events by day:", eventsByDay);
  return eventsByDay;
}


