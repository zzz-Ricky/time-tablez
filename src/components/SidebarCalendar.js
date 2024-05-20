import React, { useState, useEffect } from 'react';

function SidebarCalendar({ updateSelectedWeekRange }) {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() is zero-based
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [selectedWeek, setSelectedWeek] = useState(null);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    const handleMonthChange = (increment) => {
        let newMonth = month + increment;
        let newYear = year;
        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }
        setMonth(newMonth);
        setYear(newYear);
    };

    const handleYearChange = (event) => {
        const inputYear = parseInt(event.target.value);
        if (!isNaN(inputYear)) {
            setYear(inputYear);
        }
    };

    const handleWeekClick = (week) => {
        setSelectedWeek(week);
    };

    const calculateWeekRange = (week) => {
        if (week === null) return null;

        const startOfWeek = (week * 7) + 1 - new Date(year, month - 1, 1).getDay();
        const endOfWeek = startOfWeek + 6;

        const startDate = new Date(year, month - 1, startOfWeek);
        const endDate = new Date(year, month - 1, Math.min(endOfWeek, daysInMonth(month, year)));

        return { start: startDate, end: endDate };
    };

    const calculateCurrentWeek = () => {
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        const currentWeek = Math.floor((currentDay + firstDayOfMonth - 1) / 7);
        return currentWeek;
    };

    useEffect(() => {
        setSelectedWeek(calculateCurrentWeek());
    }, [month, year]);

    useEffect(() => {
        const selectedWeekRange = calculateWeekRange(selectedWeek);
        updateSelectedWeekRange(selectedWeekRange);
    }, [selectedWeek, month, year]);

    return (
        <div>
            <div id='DateDisplay'>
                <button onClick={() => handleMonthChange(-1)} className='MonthButton'>⮜</button>
                <h2 align="center" id='MonthName'>
                    {monthNames[month - 1]}
                </h2>
                <input
                    type="text"
                    value={year}
                    onChange={handleYearChange}
                    id='YearNum'
                />
                <button onClick={() => handleMonthChange(1)} className='MonthButton'>⮞</button>
            </div>
            <br />

            <table cellSpacing="4" cellPadding="8" id='DateTable'>
                <thead>
                    <tr>
                        <th>S</th>
                        <th>M</th>
                        <th>T</th>
                        <th>W</th>
                        <th>T</th>
                        <th>F</th>
                        <th>S</th>
                    </tr>
                </thead>

                <tbody>
                    {[...Array(Math.ceil((daysInMonth(month, year) + new Date(year, month - 1, 1).getDay()) / 7))].map((_, week) => (
                        <tr
                            key={week}
                            id={selectedWeek === week ? 'SelectedWeek' : 'UnSelectedWeek'}
                            className='DateWeek'
                            onClick={() => handleWeekClick(week)}
                        >
                            {[...Array(7)].map((_, day) => {
                                const dayNumber = (week * 7) + day + 1 - new Date(year, month - 1, 1).getDay();
                                return (
                                    <td key={day} id='DateDay'>
                                        {dayNumber > 0 && dayNumber <= daysInMonth(month, year) ? dayNumber : ''}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SidebarCalendar;
