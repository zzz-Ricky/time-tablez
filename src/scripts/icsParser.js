export function parseICS(icsData, mode) {
  let calendarInfo = {};
  let events = [];
  let event = null;

  // Split the input data by lines
  const lines = icsData.split(/\r\n|\r|\n/);

  for (const line of lines) {
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
      else{
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim(); // Rejoin split parts in case ':' appears in the value
        const propertyName = key.trim().toUpperCase(); // Convert property name to uppercase
        let propertyValue = value.trim();
        calendarInfo[propertyName] = propertyValue;
      }
  }
  if(mode === 'events'){
    return events;
  }
  if(mode == 'calendar'){
    return calendarInfo
  }
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

export function handleTimeZoneDTEND(events) {
  var values = Object.keys(events).filter(function(el) {
    return /^DTEND.*?/i.test(el);
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

  export function parseICSToPosition(dateTimeString) {
    const hour = dateTimeString.substr(9, 2);
    const minute = dateTimeString.substr(11, 2);
    const second = dateTimeString.substr(13, 2);
    const overallTime = (Number(hour) + Number(minute/60) + Number(second/3600))/24;
    const overallPosition = (overallTime*920)+45;
    /* 12AM = top:20px, each subsequent hour is offset by 40px, hence the formula */
    return overallPosition;
  };
  export function parseICSToLength(InitialTime, EndTime) {d
    // Initial Time
    const initHour = InitialTime.substr(9, 2);
    const initMinute = InitialTime.substr(11, 2);
    const initSecond = InitialTime.substr(13, 2);
    const initTimeSum = (Number(initHour) + Number(initMinute/60) + Number(initSecond/3600))/24;
    // End Time
    const endHour = EndTime.substr(9, 2);
    const endMinute = EndTime.substr(11, 2);
    const endSecond = EndTime.substr(13, 2);
    const endTimeSum = (Number(endHour) + Number(endMinute/60) + Number(endSecond/3600))/24;
    // Calculate difference to find height
    const overallTime = endTimeSum-initTimeSum;
    if (overallTime > 0){
      const overallHeight = (overallTime*920);;
      return overallHeight;
    }
    else{
      return 980;
    }
  };


  export function groupEventsByDay(events, range) {
    let eventsByDay = {};

    for (const eventIndex in events) {
      const event = events[eventIndex];
      const DTSTART = handleTimeZoneDTSTART(event); // Attribute that refers to the start date of an event
      if (event && event[DTSTART[0]]) {
        const eventStartDate = parseICSToDate(event[DTSTART[0]]);
        if (isNaN(eventStartDate)) continue;

        let recurrenceDays = [];
        if (event.RRULE) {
          const recurrenceRules = event.RRULE.split(';');
          let freq, interval = 1, count = null, until = new Date(range.end), byDay = [], byMonthDay = [];

          recurrenceRules.forEach(rule => {
            const [key, value] = rule.split('=');
            if (key === 'COUNT') count = parseInt(value);
            if (key === 'UNTIL') until = parseICSToDate(value);
            if (key === 'INTERVAL') interval = parseInt(value);
            if (key === 'FREQ') freq = value;
            if (key === 'BYDAY') byDay = value.split(',');
            if (key === 'BYMONTHDAY') byMonthDay = value.split(',').map(Number);
          });

          const addRecurrenceDate = (date) => {
            if (date >= range.start && date <= range.end && date <= until) {
              recurrenceDays.push(new Date(date));
            }
          };

          const dayDiff = { 'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6 };

          if (freq === 'DAILY') {
            let currentDate = new Date(eventStartDate);
            let occurrences = 0;
            while (currentDate <= until && (!count || occurrences < count)) {
              if (currentDate >= range.start) {
                addRecurrenceDate(currentDate);
                occurrences++;
              }
              currentDate.setDate(currentDate.getDate() + interval);
            }
          } else if (freq === 'WEEKLY') {
            let currentDate = new Date(eventStartDate);
            let occurrences = 0;
            while (currentDate <= until && (!count || occurrences < count)) {
              byDay.forEach(day => {
                let nextDate = new Date(currentDate);
                nextDate.setDate(currentDate.getDate() + (dayDiff[day] - currentDate.getDay() + 7) % 7);
                if (nextDate >= range.start && nextDate <= until && (!count || occurrences < count)) {
                  addRecurrenceDate(nextDate);
                  occurrences++;
                }
              });
              currentDate.setDate(currentDate.getDate() + interval * 7);
            }
          } else if (freq === 'MONTHLY') {
            let currentDate = new Date(eventStartDate);
            let occurrences = 0;
            while (currentDate <= until && (!count || occurrences < count)) {
              byMonthDay.forEach(day => {
                let nextDate = new Date(currentDate);
                nextDate.setDate(day);
                if (nextDate >= range.start && nextDate <= until && (!count || occurrences < count)) {
                  addRecurrenceDate(nextDate);
                  occurrences++;
                }
              });
              currentDate.setMonth(currentDate.getMonth() + interval);
            }
          } else if (freq === 'YEARLY') {
            let currentDate = new Date(eventStartDate);
            let occurrences = 0;
            while (currentDate <= until && (!count || occurrences < count)) {
              addRecurrenceDate(currentDate);
              occurrences++;
              currentDate.setFullYear(currentDate.getFullYear() + interval);
            }
          }
        } else {
          recurrenceDays = [eventStartDate]; // Initial start date
        }

        if (event.EXDATE) {
          const exDates = Array.isArray(event.EXDATE) ? event.EXDATE : [event.EXDATE];
          exDates.forEach(excludedDate => {
            const exDate = parseICSToDate(excludedDate);
            recurrenceDays = recurrenceDays.filter(date => date.getTime() !== exDate.getTime());
          });
        }

        recurrenceDays.forEach(date => {
          if (date >= range.start && date <= range.end) {
            const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
            if (!eventsByDay[day]) {
              eventsByDay[day] = [];
            }
            eventsByDay[day].push(event);
          }
        });
      }
    }
    return eventsByDay;
  }

