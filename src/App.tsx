import React, { useState } from 'react';
import './scss/main.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PriceChart from "./components/PriceChart";
import PowerChart from "./components/PowerChart";
import PowerPieChart from "./components/PowerPieChart";
import {dateSetTime, dateToday, dateYesterday, HOUR_00_00_00, HOUR_12_00_00} from "./helper/dateHelper";

const App: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(dateYesterday(HOUR_00_00_00));

    const handleDateChange = (date: Date | null | undefined) => {
        setSelectedDate(date ? dateSetTime(date, HOUR_00_00_00) : dateYesterday(HOUR_00_00_00));
    };

    return (
        <div className="app-container">
            <h1 className="title-1">Übersicht</h1>
            <div className="date-picker-container">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                />
            </div>
            <div className="chart-container">
                <div className="chart">
                    <PriceChart selectedDate={selectedDate} selectedCountry="de"/>
                </div>
                <div className="chart">
                    <PowerChart selectedDate={selectedDate} selectedCountry="de"/>
                </div>
                <div className="chart">
                    <PowerPieChart selectedDate={selectedDate} selectedCountry="de"/>
                </div>
                <div className="chart">
                    <PowerPieChart selectedDate={dateToday(HOUR_12_00_00)} selectedCountry="de" showLast={true}/>
                </div>
            </div>
            <div className="info-container">
                <p><strong>Quelle</strong>: <a href="https://api.energy-charts.info" target="_blank" rel="noopener noreferrer">https://api.energy-charts.info</a></p>
                <p><strong>Quelle</strong>: <a href="https://api.sunrise-sunset.org" target="_blank" rel="noopener noreferrer">https://api.sunrise-sunset.org</a></p>
            </div>
        </div>
    );
};

export default App;
