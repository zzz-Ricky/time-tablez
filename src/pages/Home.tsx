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

  return (
    <div className="AppBody">
      <Sidebar />
      <div className="AppContent">
        <WeeklyTime />
        {fileDataList.map((fileData, index) => (
          <WeeklyCard key={index} fileData={fileData} />
        ))}
        <NewWeeklyCard onFileRead={handleFileData} />
      </div>
    </div>
  );
}

export default Home
