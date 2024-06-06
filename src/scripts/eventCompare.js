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

      for (const eventA of eventsA) {
        const { summary: summaryA, startDate: startA, endDate: endA } = eventA;
        for (const eventB of eventsB) {
          const { summary: summaryB, startDate: startB, endDate: endB } = eventB;

          // Check for overlap
          if ((startA <= endB && endA >= startB) || (startB <= endA && endB >= startA)) {
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

      // Find common free time
      let dayStart = new Date(eventsA[0].startDate.setHours(0, 0, 0, 0));
      let dayEnd = new Date(eventsA[0].endDate.setHours(23, 59, 59, 999));

      let busyTimes = [...eventsA, ...eventsB].map(event => [event.startDate, event.endDate]);
      busyTimes.sort((a, b) => a[0] - b[0]);

      let lastEnd = dayStart;
      for (const [busyStart, busyEnd] of busyTimes) {
        if (lastEnd < busyStart) {
          commonFreeTime.push({ day, freeStart: lastEnd, freeEnd: busyStart });
        }
        lastEnd = new Date(Math.max(lastEnd.getTime(), busyEnd.getTime()));
      }
      if (lastEnd < dayEnd) {
        commonFreeTime.push({ day, freeStart: lastEnd, freeEnd: dayEnd });
      }
    }
  }

  let timeProfile = { commonFreeTime, conflictTime, eventOverlap };
  console.log('timeprofile',timeProfile)
  return timeProfile;
}
