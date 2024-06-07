import { handleTimeZoneDTSTART, handleTimeZoneDTEND, parseICSToDate } from "./icsParser";

export function findCommonTimes(ScheduleA, ScheduleB) {
  let occupiedTimeA = {};
  let occupiedTimeB = {};

  // Parse ScheduleA
  for (const DayA in ScheduleA) {
    if (!occupiedTimeA[DayA]) {
      occupiedTimeA[DayA] = [];
    }
    for (const eventA of ScheduleA[DayA]) {
      const eventSummaryA = eventA['SUMMARY'];
      const DTSTARTA = handleTimeZoneDTSTART(eventA);
      const eventAStartDate = parseICSToDate(eventA[DTSTARTA]);
      const DTENDA = handleTimeZoneDTEND(eventA);
      const eventAEndDate = parseICSToDate(eventA[DTENDA]);
      occupiedTimeA[DayA].push({
        summary: eventSummaryA,
        startDate: eventAStartDate,
        endDate: eventAEndDate,
      });
    }
  }

  // Parse ScheduleB
  for (const DayB in ScheduleB) {
    if (!occupiedTimeB[DayB]) {
      occupiedTimeB[DayB] = [];
    }
    for (const eventB of ScheduleB[DayB]) {
      const eventSummaryB = eventB['SUMMARY'];
      const DTSTARTB = handleTimeZoneDTSTART(eventB);
      const eventBStartDate = parseICSToDate(eventB[DTSTARTB]);
      const DTENDB = handleTimeZoneDTEND(eventB);
      const eventBEndDate = parseICSToDate(eventB[DTENDB]);
      occupiedTimeB[DayB].push({
        summary: eventSummaryB,
        startDate: eventBStartDate,
        endDate: eventBEndDate,
      });
    }
  }

  return calculateTimeOverlap(occupiedTimeA, occupiedTimeB);
}

function calculateTimeOverlap(occupiedTimeA, occupiedTimeB) {
  let commonFreeTime = [];
  let conflictTime = [];
  let eventOverlap = [];

  for (const day in occupiedTimeA) {
    if (occupiedTimeB.hasOwnProperty(day)) {
      const eventsA = occupiedTimeA[day];
      const eventsB = occupiedTimeB[day];

      // Combine and sort all events for the day
      let allEvents = [...eventsA, ...eventsB].map(event => ({
        summary: event.summary,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      }));
      allEvents.sort((a, b) => a.startDate - b.startDate);

      // Check for conflicts and overlaps
      for (let i = 0; i < allEvents.length; i++) {
        for (let j = i + 1; j < allEvents.length; j++) {
          const eventA = allEvents[i];
          const eventB = allEvents[j];
          const { summary: summaryA, startDate: startA, endDate: endA } = eventA;
          const { summary: summaryB, startDate: startB, endDate: endB } = eventB;

          // Check for overlap
          if ((startA < endB && endA > startB)) {
            const overlapStart = new Date(Math.max(startA.getTime(), startB.getTime()));
            const overlapEnd = new Date(Math.min(endA.getTime(), endB.getTime()));
            conflictTime.push({ day, overlapStart, overlapEnd });

            // Check for same event summary
            if (summaryA === summaryB) {
              eventOverlap.push({ day, summary: summaryA, overlapStart, overlapEnd });
            }
          }
        }
      }

      // Calculate common free time
      let dayStart = new Date(eventsA[0].startDate);
      dayStart.setHours(0, 0, 0, 0);
      let dayEnd = new Date(eventsA[0].startDate);
      dayEnd.setHours(23, 59, 59, 999);

      let lastEnd = dayStart;
      let potentialFreeTimes = [];

      for (const event of allEvents) {
        const { startDate: busyStart, endDate: busyEnd } = event;
        if (lastEnd < busyStart) {
          potentialFreeTimes.push({ freeStart: lastEnd, freeEnd: busyStart });
        }
        lastEnd = new Date(Math.max(lastEnd.getTime(), busyEnd.getTime()));
      }
      if (lastEnd < dayEnd) {
        potentialFreeTimes.push({ freeStart: lastEnd, freeEnd: dayEnd });
      }

      // Merge overlapping free times
      if (potentialFreeTimes.length > 0) {
        let mergedFreeTimes = [];
        let currentFreeTime = potentialFreeTimes[0];

        for (let i = 1; i < potentialFreeTimes.length; i++) {
          const nextFreeTime = potentialFreeTimes[i];
          if (currentFreeTime.freeEnd >= nextFreeTime.freeStart) {
            currentFreeTime.freeEnd = new Date(Math.max(currentFreeTime.freeEnd.getTime(), nextFreeTime.freeEnd.getTime()));
          } else {
            mergedFreeTimes.push(currentFreeTime);
            currentFreeTime = nextFreeTime;
          }
        }
        mergedFreeTimes.push(currentFreeTime);

        // Ensure free times do not overlap with conflict times
        for (const freeTime of mergedFreeTimes) {
          let freeStart = freeTime.freeStart;
          let freeEnd = freeTime.freeEnd;

          for (const conflict of conflictTime) {
            if (conflict.day === day) {
              const { overlapStart, overlapEnd } = conflict;
              if (freeStart < overlapEnd && freeEnd > overlapStart) {
                if (freeStart < overlapStart) {
                  commonFreeTime.push({ day, freeStart, freeEnd: overlapStart });
                }
                if (freeEnd > overlapEnd) {
                  freeStart = overlapEnd;
                } else {
                  freeStart = null;
                  break;
                }
              }
            }
          }
          if (freeStart) {
            commonFreeTime.push({ day, freeStart, freeEnd });
          }
        }
      }
    }
  }

  let timeProfile = { commonFreeTime, conflictTime, eventOverlap };
  return timeProfile;
}



  export function parseDateToPosition(dateTimeObject) {
    const hour = dateTimeObject.getHours();
    const minute = dateTimeObject.getMinutes();
    const second = dateTimeObject.getSeconds();
    const overallTime = (Number(hour) + Number(minute/60) + Number(second/3600))/24;
    const overallPosition = (overallTime*920)+45;
    /* 12AM = top:20px, each subsequent hour is offset by 45px, hence the formula */
    console.log("NOTERROR POSITION", dateTimeObject, overallPosition)
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
    if (overallTime > 0){
      const overallHeight = (overallTime*920);;
      console.log("NOTERROR LENGTH", InitialTime, EndTime, overallHeight)
      return overallHeight;
    }
    else{
      return 980;
      console.log("ERROR", InitialTime, EndTime)
    }
  };
