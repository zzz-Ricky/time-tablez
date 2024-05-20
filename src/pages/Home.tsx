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
  };

  const [selectedWeekRange, setSelectedWeekRange] = useState(null);

    const updateSelectedWeekRange = (range) => {
        setSelectedWeekRange(range);
    };

  return (
    <div className="AppBody">
      <Sidebar updateSelectedWeekRange={updateSelectedWeekRange} />
      <div className="AppContent">
      <WeeklyTime/>
        {fileDataList.map((fileData, index) => (
          <WeeklyCard key={index} fileData={fileData} range={selectedWeekRange} />
        ))}
        <NewWeeklyCard onFileRead={handleFileData} />
      </div>
    </div>
  );
}

export default Home
