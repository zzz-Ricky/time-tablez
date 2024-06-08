import { handleTimeZoneDTSTART, handleTimeZoneDTEND, parseICSToDate } from "./icsParser";

export function findCommonTimes(Schedules) {
    var occupiedTimes = {
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
    "Sunday": []
  };
  // Parse all Schedules
for (const Schedule of Schedules){
  for (const Day in Schedule) {
    if (!occupiedTimes[Day]) {
      occupiedTimes[Day] = [];
    }
    for (const event of Schedule[Day]) {
      const eventSummary = event['SUMMARY'];
      const DTSTART = handleTimeZoneDTSTART(event);
      const eventStartDate = parseICSToDate(event[DTSTART]);
      const DTEND = handleTimeZoneDTEND(event);
      const eventEndDate = parseICSToDate(event[DTEND]);
      occupiedTimes[Day].push({
        summary: eventSummary,
        startDate: eventStartDate,
        endDate: eventEndDate,
      });
    }
  }
}
  const timeProfile = calculateTimeOverlap(occupiedTimes);
  return timeProfile
}

function calculateTimeOverlap(occupiedTimes) {
  let commonFreeTime = [];
  let conflictTime = [];

  // Get the current week's start and end dates
  const { startOfWeek, endOfWeek } = getCurrentWeekDates();

  for (const day in occupiedTimes) {
    let events = occupiedTimes[day];

    if (events.length === 0) {
      // If there are no events for this day, consider the entire day as common free time
      const fullDay = getFullDay(day, startOfWeek, endOfWeek);
      commonFreeTime.push(fullDay);
      continue; // Skip further processing for this day
    }

    // Sort events by start time
    events.sort((a, b) => a.startDate - b.startDate);

    let mergedEvents = [];
    let currentEvent = events[0];

    // Merge overlapping events
    for (let i = 1; i < events.length; i++) {
      let nextEvent = events[i];

      if (nextEvent.startDate <= currentEvent.endDate) {
        // Events overlap, merge them
        currentEvent.endDate = new Date(Math.max(currentEvent.endDate, nextEvent.endDate));
      } else {
        // Events don't overlap, push current event and update current event
        mergedEvents.push(currentEvent);
        currentEvent = nextEvent;
      }
    }

    // Push the last event
    mergedEvents.push(currentEvent);

    // Calculate common free time and conflict time
    for (let i = 1; i < mergedEvents.length; i++) {
      const gapStart = mergedEvents[i - 1].endDate;
      const gapEnd = mergedEvents[i].startDate;

      if (gapStart < gapEnd) {
        // There is a gap between events, it's common free time
        commonFreeTime.push({ startDate: gapStart, endDate: gapEnd, day: day});
      }
    }

    // If there are any events, the entire day is conflict time
    if (mergedEvents.length > 0) {
      conflictTime.push({ startDate: mergedEvents[0].startDate, endDate: mergedEvents[mergedEvents.length - 1].endDate, day: day });
    }
  }

  let timeProfile = { commonFreeTime, conflictTime };
  return timeProfile;
}

// Function to get the current week's start and end dates
function getCurrentWeekDates() {
  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - currentDayOfWeek); // Set to the first day (Sunday) of the current week
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(endOfWeek.getDate() + (6 - currentDayOfWeek)); // Set to the last day (Saturday) of the current week
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
}

// Function to get the full day interval
function getFullDay(day, startOfWeek, endOfWeek) {

  const dayDiff = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
  const startOfDay = new Date(startOfWeek);
  startOfDay.setDate(startOfWeek.getDate() + parseInt(dayDiff[day])); // Adjust to the specific day of the week
  startOfDay.setHours(0, 0, 0, 0); // Set to the start of the day
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day


  return { startDate: startOfDay, endDate: endOfDay, day: day };
}

export function parseDateToPosition(dateTimeObject) {
  const hour = dateTimeObject.getHours();
  const minute = dateTimeObject.getMinutes();
  const second = dateTimeObject.getSeconds();
  const overallTime = (Number(hour) + Number(minute/60) + Number(second/3600))/24;
  const overallPosition = (overallTime*920)+45;
  /* 12AM = top:20px, each subsequent hour is offset by 45px, hence the formula */
  return overallPosition;
};

  export function parseDateToLength(InitialTime, EndTime) {
    // Initial Time
    const initHour = InitialTime.getHours();
    const initMinute = InitialTime.getMinutes();
    const initSecond = InitialTime.getSeconds();
    const initTimeSum = (Number(initHour) + Number(initMinute/60) + Number(initSecond/3600))/24;
    // End Time
    const endHour = EndTime.getHours();
    const endMinute = EndTime.getMinutes();
    const endSecond = EndTime.getSeconds();
    const endTimeSum = (Number(endHour) + Number(endMinute/60) + Number(endSecond/3600))/24;
    // Calculate difference to find height
    const overallTime = endTimeSum-initTimeSum;
    if (overallTime > 0 && overallTime){
      const overallHeight = (overallTime*920);;
      return overallHeight;
    }
    else{
      return 900;
    }
  };
