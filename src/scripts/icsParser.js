/*
                                                            88    ,ad8888ba,    ad88888ba
                                                            88   d8"'    `"8b  d8"     "8b
                                                            88  d8'            Y8,
8b,dPPYba,   ,adPPYYba,  8b,dPPYba,  ,adPPYba,   ,adPPYba,  88  88             `Y8aaaaa,
88P'    "8a  ""     `Y8  88P'   "Y8  I8[    ""  a8P_____88  88  88               `"""""8b,
88       d8  ,adPPPPP88  88           `"Y8ba,   8PP"""""""  88  Y8,                    `8b
88b,   ,a8"  88,    ,88  88          aa    ]8I  "8b,   ,aa  88   Y8a.    .a8P  Y8a     a8P
88`YbbdP"'   `"8bbdP"Y8  88          `"YbbdP"'   `"Ybbd8"'  88    `"Y8888Y"'    "Y88888P"
88
88
Accepts a string representing imported ICS data and converts it to either calendarInfo or events
calendarInfo returns a single object containing calendar heading data
events contains an array of event objects listed in the given schedule.
*/
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

/*
                             888888888888  88                                  888888888888                                       88  88888888ba,
                           ,d     88       ""                                           ,88                                       88  88      `"8b
                           88     88                                                  ,88"                                        88  88        `8b
 ,adPPYb,d8   ,adPPYba,  MM88MMM  88       88  88,dPYba,,adPYba,    ,adPPYba,       ,88"     ,adPPYba,   8b,dPPYba,    ,adPPYba,  88  88         88
a8"    `Y88  a8P_____88    88     88       88  88P'   "88"    "8a  a8P_____88     ,88"      a8"     "8a  88P'   `"8a  a8P_____88  88  88         88
8b       88  8PP"""""""    88     88       88  88      88      88  8PP"""""""   ,88"        8b       d8  88       88  8PP"""""""  88  88         8P
"8a,   ,d88  "8b,   ,aa    88,    88       88  88      88      88  "8b,   ,aa  88"          "8a,   ,a8"  88       88  "8b,   ,aa  88  88      .a8P
 `"YbbdP"Y8   `"Ybbd8"'    "Y888  88       88  88      88      88   `"Ybbd8"'  888888888888  `"YbbdP"'   88       88   `"Ybbd8"'  88  88888888Y"'
 aa,    ,88
  "Y8bbdP"
Detects the local time zone of the system. Code is currently unused.
*/
export function getTimeZoneID() {
  const date = new Date();
  const options = { timeZoneName: 'short' };
  const timeZoneAbbreviation = new Intl.DateTimeFormat('en-US', options).formatToParts(date).find(part => part.type === 'timeZoneName').value;
  return timeZoneAbbreviation;
}

/*
88                                             88  88         888888888888  88                                  888888888888                                       88888888ba,  888888888888  ad88888ba  888888888888    db         88888888ba  888888888888
88                                             88  88              88       ""                                           ,88                                       88      `"8b      88      d8"     "8b      88        d88b        88      "8b      88
88                                             88  88              88                                                  ,88"                                        88        `8b     88      Y8,              88       d8'`8b       88      ,8P      88
88,dPPYba,   ,adPPYYba,  8b,dPPYba,    ,adPPYb,88  88   ,adPPYba,  88       88  88,dPYba,,adPYba,    ,adPPYba,       ,88"     ,adPPYba,   8b,dPPYba,    ,adPPYba,  88         88     88      `Y8aaaaa,        88      d8'  `8b      88aaaaaa8P'      88
88P'    "8a  ""     `Y8  88P'   `"8a  a8"    `Y88  88  a8P_____88  88       88  88P'   "88"    "8a  a8P_____88     ,88"      a8"     "8a  88P'   `"8a  a8P_____88  88         88     88        `"""""8b,      88     d8YaaaaY8b     88""""88'        88
88       88  ,adPPPPP88  88       88  8b       88  88  8PP"""""""  88       88  88      88      88  8PP"""""""   ,88"        8b       d8  88       88  8PP"""""""  88         8P     88              `8b      88    d8""""""""8b    88    `8b        88
88       88  88,    ,88  88       88  "8a,   ,d88  88  "8b,   ,aa  88       88  88      88      88  "8b,   ,aa  88"          "8a,   ,a8"  88       88  "8b,   ,aa  88      .a8P      88      Y8a     a8P      88   d8'        `8b   88     `8b       88
88       88  `"8bbdP"Y8  88       88   `"8bbdP"Y8  88   `"Ybbd8"'  88       88  88      88      88   `"Ybbd8"'  888888888888  `"YbbdP"'   88       88   `"Ybbd8"'  88888888Y"'       88       "Y88888P"       88  d8'          `8b  88      `8b      88
Regex function which detects an attribute substring containing the phrase "DTSTART"
Is used to return the proper attribute name in case a time zone is encoded into the schedule.
*/
export function handleTimeZoneDTSTART(events) {
  var values = Object.keys(events).filter(function(el) {
    return /^DTSTART.*?/i.test(el);
  });
  return values;
}

/*
88                                             88  88         888888888888  88                                  888888888888                                       88888888ba,  888888888888  88888888888  888b      88  88888888ba,
88                                             88  88              88       ""                                           ,88                                       88      `"8b      88       88           8888b     88  88      `"8b
88                                             88  88              88                                                  ,88"                                        88        `8b     88       88           88 `8b    88  88        `8b
88,dPPYba,   ,adPPYYba,  8b,dPPYba,    ,adPPYb,88  88   ,adPPYba,  88       88  88,dPYba,,adPYba,    ,adPPYba,       ,88"     ,adPPYba,   8b,dPPYba,    ,adPPYba,  88         88     88       88aaaaa      88  `8b   88  88         88
88P'    "8a  ""     `Y8  88P'   `"8a  a8"    `Y88  88  a8P_____88  88       88  88P'   "88"    "8a  a8P_____88     ,88"      a8"     "8a  88P'   `"8a  a8P_____88  88         88     88       88"""""      88   `8b  88  88         88
88       88  ,adPPPPP88  88       88  8b       88  88  8PP"""""""  88       88  88      88      88  8PP"""""""   ,88"        8b       d8  88       88  8PP"""""""  88         8P     88       88           88    `8b 88  88         8P
88       88  88,    ,88  88       88  "8a,   ,d88  88  "8b,   ,aa  88       88  88      88      88  "8b,   ,aa  88"          "8a,   ,a8"  88       88  "8b,   ,aa  88      .a8P      88       88           88     `8888  88      .a8P
88       88  `"8bbdP"Y8  88       88   `"8bbdP"Y8  88   `"Ybbd8"'  88       88  88      88      88   `"Ybbd8"'  888888888888  `"YbbdP"'   88       88   `"Ybbd8"'  88888888Y"'       88       88888888888  88      `888  88888888Y"'
Regex function which detects an attribute substring containing the phrase "DTEND"
Is used to return the proper attribute name in case a time zone is encoded into the schedule.
*/
export function handleTimeZoneDTEND(events) {
  var values = Object.keys(events).filter(function(el) {
    return /^DTEND.*?/i.test(el);
  });
  return values;
}

/*
                                                            88    ,ad8888ba,    ad88888ba  888888888888          88888888ba,
                                                            88   d8"'    `"8b  d8"     "8b      88               88      `"8b                 ,d
                                                            88  d8'            Y8,              88               88        `8b                88
8b,dPPYba,   ,adPPYYba,  8b,dPPYba,  ,adPPYba,   ,adPPYba,  88  88             `Y8aaaaa,        88   ,adPPYba,   88         88  ,adPPYYba,  MM88MMM  ,adPPYba,
88P'    "8a  ""     `Y8  88P'   "Y8  I8[    ""  a8P_____88  88  88               `"""""8b,      88  a8"     "8a  88         88  ""     `Y8    88    a8P_____88
88       d8  ,adPPPPP88  88           `"Y8ba,   8PP"""""""  88  Y8,                    `8b      88  8b       d8  88         8P  ,adPPPPP88    88    8PP"""""""
88b,   ,a8"  88,    ,88  88          aa    ]8I  "8b,   ,aa  88   Y8a.    .a8P  Y8a     a8P      88  "8a,   ,a8"  88      .a8P   88,    ,88    88,   "8b,   ,aa
88`YbbdP"'   `"8bbdP"Y8  88          `"YbbdP"'   `"Ybbd8"'  88    `"Y8888Y"'    "Y88888P"       88   `"YbbdP"'   88888888Y"'    `"8bbdP"Y8    "Y888  `"Ybbd8"'
88
88
Function to parse ICS time encodings to Date objects. This simplifies future calculations and comparisons.
*/
export function parseICSToDate(dateTimeString) {
    const year = dateTimeString.substr(0, 4);
    const month = parseInt(dateTimeString.substr(4, 2)) - 1; // Month is zero-based in JavaScript Date object
    const day = dateTimeString.substr(6, 2);
    const hour = dateTimeString.substr(9, 2);
    const minute = dateTimeString.substr(11, 2);
    const second = dateTimeString.substr(13, 2);
    return new Date(year, month, day, hour, minute, second);
  };

/*
                                                            88    ,ad8888ba,    ad88888ba  888888888888          88888888ba                          88           88
                                                            88   d8"'    `"8b  d8"     "8b      88               88      "8b                         ""    ,d     ""
                                                            88  d8'            Y8,              88               88      ,8P                               88
8b,dPPYba,   ,adPPYYba,  8b,dPPYba,  ,adPPYba,   ,adPPYba,  88  88             `Y8aaaaa,        88   ,adPPYba,   88aaaaaa8P'  ,adPPYba,   ,adPPYba,  88  MM88MMM  88   ,adPPYba,   8b,dPPYba,
88P'    "8a  ""     `Y8  88P'   "Y8  I8[    ""  a8P_____88  88  88               `"""""8b,      88  a8"     "8a  88""""""'   a8"     "8a  I8[    ""  88    88     88  a8"     "8a  88P'   `"8a
88       d8  ,adPPPPP88  88           `"Y8ba,   8PP"""""""  88  Y8,                    `8b      88  8b       d8  88          8b       d8   `"Y8ba,   88    88     88  8b       d8  88       88
88b,   ,a8"  88,    ,88  88          aa    ]8I  "8b,   ,aa  88   Y8a.    .a8P  Y8a     a8P      88  "8a,   ,a8"  88          "8a,   ,a8"  aa    ]8I  88    88,    88  "8a,   ,a8"  88       88
88`YbbdP"'   `"8bbdP"Y8  88          `"YbbdP"'   `"Ybbd8"'  88    `"Y8888Y"'    "Y88888P"       88   `"YbbdP"'   88           `"YbbdP"'   `"YbbdP"'  88    "Y888  88   `"YbbdP"'   88       88
88
88
Directly converts ics time encodings to a position within the calendar. This is more convenient for existing calendar event objects.
Returns an offset value in pixels for the calendar.
*/
export function parseICSToPosition(dateTimeString) {
  const hour = dateTimeString.substr(9, 2);
  const minute = dateTimeString.substr(11, 2);
  const second = dateTimeString.substr(13, 2);
  const overallTime = (Number(hour) + Number(minute/60) + Number(second/3600))/24;
  const overallPosition = (overallTime*920)+45;
  /* 12AM = top:20px, each subsequent hour is offset by 40px, hence the formula */
  return overallPosition;
};
/*
                                                            88    ,ad8888ba,    ad88888ba  888888888888          88                                                         88
                                                            88   d8"'    `"8b  d8"     "8b      88               88                                                  ,d     88
                                                            88  d8'            Y8,              88               88                                                  88     88
8b,dPPYba,   ,adPPYYba,  8b,dPPYba,  ,adPPYba,   ,adPPYba,  88  88             `Y8aaaaa,        88   ,adPPYba,   88           ,adPPYba,  8b,dPPYba,    ,adPPYb,d8  MM88MMM  88,dPPYba,
88P'    "8a  ""     `Y8  88P'   "Y8  I8[    ""  a8P_____88  88  88               `"""""8b,      88  a8"     "8a  88          a8P_____88  88P'   `"8a  a8"    `Y88    88     88P'    "8a
88       d8  ,adPPPPP88  88           `"Y8ba,   8PP"""""""  88  Y8,                    `8b      88  8b       d8  88          8PP"""""""  88       88  8b       88    88     88       88
88b,   ,a8"  88,    ,88  88          aa    ]8I  "8b,   ,aa  88   Y8a.    .a8P  Y8a     a8P      88  "8a,   ,a8"  88          "8b,   ,aa  88       88  "8a,   ,d88    88,    88       88
88`YbbdP"'   `"8bbdP"Y8  88          `"YbbdP"'   `"Ybbd8"'  88    `"Y8888Y"'    "Y88888P"       88   `"YbbdP"'   88888888888  `"Ybbd8"'  88       88   `"YbbdP"Y8    "Y888  88       88
88                                                                                                                                                     aa,    ,88
88                                                                                                                                                      "Y8bbdP"
Calculates the duration of an event usingg ICS dates. Returns a height in pixels for the calendar
This is more convenient for existing calendar event objects.
*/
export function parseICSToLength(InitialTime, EndTime) {
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
/*
                                                                88888888888                                                       88888888ba                88888888ba,
                                                                88                                              ,d                88      "8b               88      `"8b
                                                                88                                              88                88      ,8P               88        `8b
 ,adPPYb,d8  8b,dPPYba,   ,adPPYba,   88       88  8b,dPPYba,   88aaaaa  8b       d8   ,adPPYba,  8b,dPPYba,  MM88MMM  ,adPPYba,  88aaaaaa8P'  8b       d8  88         88  ,adPPYYba,  8b       d8
a8"    `Y88  88P'   "Y8  a8"     "8a  88       88  88P'    "8a  88"""""  `8b     d8'  a8P_____88  88P'   `"8a   88     I8[    ""  88""""""8b,  `8b     d8'  88         88  ""     `Y8  `8b     d8'
8b       88  88          8b       d8  88       88  88       d8  88        `8b   d8'   8PP"""""""  88       88   88      `"Y8ba,   88      `8b   `8b   d8'   88         8P  ,adPPPPP88   `8b   d8'
"8a,   ,d88  88          "8a,   ,a8"  "8a,   ,a88  88b,   ,a8"  88         `8b,d8'    "8b,   ,aa  88       88   88,    aa    ]8I  88      a8P    `8b,d8'    88      .a8P   88,    ,88    `8b,d8'
 `"YbbdP"Y8  88           `"YbbdP"'    `"YbbdP'Y8  88`YbbdP"'   88888888888  "8"       `"Ybbd8"'  88       88   "Y888  `"YbbdP"'  88888888P"       Y88'     88888888Y"'    `"8bbdP"Y8      Y88'
 aa,    ,88                                        88                                                                                              d8'                                     d8'
  "Y8bbdP"                                         88                                                                                             d8'                                     d8'                                                                                                                                                            "Y8bbdP"
Accepts an array of event objects and a range to categorize events by their date.
This function accepts a range parameter in order to optimize the calculation of event repetitions.
Returns an object which contains an attribute for each day of the week. Each day contains an array of events.
*/
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
          /*
            Here, we handle the frequency (DAILY, WEEKLY, MONTHLY, YEARLY)
            According to ics RFC 5545 specifications,
            COUNT refers to "happen N number of times"
            UNTIL refers to "happen until end date occurs"
            INTERVAL refers to a rate of repetition in terms of days
            FREQ refers to the unit of time being used (see above)
            BYDAY sets a routine of repetition days
            BYMONTHDAY sets a routine of repetition days relative to days in each month
            Otherwise, the absence of these attributes implies infinite repetition, which we will limit to not destroy computers.
          */
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

