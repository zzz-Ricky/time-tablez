import React, { useState } from "react";
import Sidebar from '../components/Sidebar';
import WeeklyCard from '../components/WeeklyCard';
import NewWeeklyCard from '../components/NewWeeklyCard';
import '../renderer/App.css'
import WeeklyTime from '../components/WeeklyTime';

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
          // Add schedule to visibleSchedules
          setVisibleSchedules([...visibleSchedules, schedule]);
          return
        }
      } else {
        if (visibleSchedules.includes(schedule)){
          // Remove schedule from visibleSchedules
          setVisibleSchedules(visibleSchedules.filter(s => s !== schedule));
          return
        }
      return
      }
    }

    const [timeFormat, setTimeFormat] = useState('12Hour'); // Default to 12-hour format

      const handleFormatChange = (event) => {
        setTimeFormat(event.target.value);
      };


  return (
    <div className="AppBody">
      <Sidebar updateSelectedWeekRange={updateSelectedWeekRange} updateVisibleSchedules={updateVisibleSchedules} visibleSchedules={visibleSchedules} schedules={fileDataList}/>
      <div className="AppContent">
      <WeeklyTime timeFormat={timeFormat} handleChange={handleFormatChange}/>
        {visibleSchedules.map((fileData, index) => (
          <WeeklyCard key={index} fileData={fileData} range={selectedWeekRange} timeFormat={timeFormat} deleteSchedule={deleteSchedule}/>
        ))}
        <NewWeeklyCard onFileRead={handleFileData}/>
      </div>
    </div>
  );
}

export default Home
