import React from 'react'
import Sidebar from '../components/Sidebar';
import WeeklyCard from '../components/WeeklyCard';
import '../renderer/App.css'

function Home() {
  return (
    <div className='AppBody'>
    <Sidebar></Sidebar>
    <div className='AppContent'>
      <WeeklyCard/>
      <WeeklyCard/>
      <WeeklyCard/>
      <WeeklyCard/>
      <WeeklyCard/>
      <WeeklyCard/>
    </div>
    </div>
  )
}

export default Home
