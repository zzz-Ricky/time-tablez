// Home.js

import React, { useState } from "react";
import Sidebar from '../components/Sidebar';
import WeeklyCard from '../components/WeeklyCard';
import NewWeeklyCard from '../components/NewWeeklyCard';
import '../renderer/App.css'
import WeeklyTime from '../components/WeeklyTime';
import { findCommonTimes } from "../scripts/eventCompare";

function Home() {
  const [fileDataList, setFileDataList] = useState([]);

  const handleFileData = (data) => {
    setFileDataList(prevData => [...prevData, data]);
    setVisibleSchedules(prevData => [...prevData, data]);
  };

  const deleteSchedule = (event, schedule) => {
    setFileDataList(visibleSchedules.filter(s => s !== schedule));
    setVisibleSchedules(visibleSchedules.filter(s => s !== schedule));
  };

  const [selectedWeekRange, setSelectedWeekRange] = useState(null);

  const updateSelectedWeekRange = (range) => {
    setSelectedWeekRange(range);
  };

  const [visibleSchedules, setVisibleSchedules] = useState([]);

  const updateVisibleSchedules = (event, schedule) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!visibleSchedules.includes(schedule)){
        setVisibleSchedules([...visibleSchedules, schedule]);
      }
    } else {
      if (visibleSchedules.includes(schedule)){
        setVisibleSchedules(visibleSchedules.filter(s => s !== schedule));
      }
    }
  }

  const [timeFormat, setTimeFormat] = useState('12Hour');

  const handleFormatChange = (event) => {
    setTimeFormat(event.target.value);
  };

  const [eventsData, setEventsData] = useState({});

  const handleEventsReport = (key, eventsByDay) => {
    setEventsData(prev => ({ ...prev, [key]: eventsByDay }));
  };

  function compareEvents() {
    const schedules = Object.values(eventsData);
    var comparisonData;
    if (schedules.length > 1) {
      comparisonData = findCommonTimes(schedules);

    }
    return comparisonData;
  };



  return (
    <div className="AppBody">
      <Sidebar updateSelectedWeekRange={updateSelectedWeekRange} updateVisibleSchedules={updateVisibleSchedules} visibleSchedules={visibleSchedules} schedules={fileDataList}/>
      <div className="AppContent">
        <WeeklyTime timeFormat={timeFormat} handleChange={handleFormatChange}/>
        {visibleSchedules.map((fileData, index) => (
          <WeeklyCard key={index} keyProp={index} fileData={fileData} range={selectedWeekRange} timeFormat={timeFormat} deleteSchedule={deleteSchedule} reportEvents={handleEventsReport} compareEvents={compareEvents} fullComparison={eventsData}/>
        ))}
        <NewWeeklyCard onFileRead={handleFileData}/>
      </div>
    </div>
  );
}

export default Home;
