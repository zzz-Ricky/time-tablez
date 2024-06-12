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

    // Sort events by start time
    let sortedEvents = events.sort((a, b) => (a.startDate.getHours() + ((a.startDate.getMinutes())/60) + ((a.startDate.getSeconds())/3600)) - (b.startDate.getHours() + ((b.startDate.getMinutes())/60) + ((b.startDate.getSeconds())/3600)));

    let currentDayStart = getFullDayStart(day, startOfWeek);
    let currentDayEnd = getFullDayEnd(day, startOfWeek);

    //Last end time refers to the last time an event ended. By default, this is the beginning of the day.
    let lastEndTime = currentDayStart;
    // Process events to determine free and conflict times
    for (let event of sortedEvents) {
      let calculatedEventStartTime = (event.startDate.getHours() + ((event.startDate.getMinutes())/60) + ((event.startDate.getSeconds())/3600));
      let calculatedLastEndTime = (lastEndTime.getHours() + ((lastEndTime.getMinutes())/60) + ((lastEndTime.getSeconds())/3600))
      if (calculatedEventStartTime > calculatedLastEndTime) {
        commonFreeTime.push({ startDate: lastEndTime, endDate: event.startDate, day: day });
        lastEndTime = event.endDate
      }
      // Mark the event duration as conflict time
      conflictTime.push({ startDate: event.startDate, endDate: event.endDate, day: day });
      lastEndTime = new Date(Math.max(lastEndTime, event.endDate));
    }

    // After processing all events, check if there's any free time left until the end of the day
    if (1) {
      commonFreeTime.push({ startDate: lastEndTime, endDate: currentDayEnd, day: day });
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

// Function to get the start of the full day interval
function getFullDayStart(day, startOfWeek) {
  const dayDiff = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
  const startOfDay = new Date(startOfWeek);
  startOfDay.setDate(startOfWeek.getDate() + dayDiff[day]); // Adjust to the specific day of the week
  startOfDay.setHours(0, 0, 0, 0); // Set to the start of the day
  return startOfDay;
}

// Function to get the end of the full day interval
function getFullDayEnd(day, startOfWeek) {
  const startOfDay = getFullDayStart(day, startOfWeek);
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day
  return endOfDay;
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
