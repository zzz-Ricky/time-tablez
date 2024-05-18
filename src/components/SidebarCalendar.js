import React, { useState } from 'react';

function SidebarCalendar() {
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2021);

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

            <table align="center" cellSpacing="4" cellPadding="6">
                <caption align="top"></caption>

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
                        <tr key={week}>
                            {[...Array(7)].map((_, day) => {
                                const dayNumber = (week * 7) + day + 1 - new Date(year, month - 1, 1).getDay();
                                return (
                                    <td key={day}>
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
