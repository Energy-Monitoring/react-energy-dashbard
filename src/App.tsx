import React, { useState } from 'react';
import './scss/main.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PriceChart from "./components/PriceChart";
import PowerChart from "./components/PowerChart";
import PowerPieChart from "./components/PowerPieChart";
import {
    dateAddDays,
    dateAddHours,
    dateSetTime,
    dateToday,
    dateYesterday,
    HOUR_00_00_00,
    HOUR_12_00_00
} from "./helper/dateHelper";
import {countries, countriesDayAheadPrice} from "./config/countries";

const App: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(dateYesterday(HOUR_00_00_00));
    const [selectedCountry, setSelectedCountry] = useState<string>('de');
    const [selectedCountryDAP, setSelectedCountryDAP] = useState<string>('DE-LU');

    const handleDateChange = (date: Date | null | undefined) => {
        setSelectedDate(date ? dateSetTime(date, HOUR_00_00_00) : dateYesterday(HOUR_00_00_00));
    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);
    };

    const handleDayAheadPriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountryDAP(event.target.value);
    };

    return (
        <div className="app-container">
            <h1 className="title-1">Übersicht</h1>
            <div className="controls-container">
                <div className="date-picker-container">
                    <strong>Datum</strong>:&nbsp;&nbsp;&nbsp;
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                    />
                </div>
                <div className="day-ahead-price-picker-container">
                    <strong>Day Ahead Preis</strong>:&nbsp;&nbsp;&nbsp;
                    <select value={selectedCountryDAP} onChange={handleDayAheadPriceChange}>
                        {countriesDayAheadPrice.map(price => (
                            <option key={price.code} value={price.code}>
                                {price.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="country-picker-container">
                    <strong>Stromerzeugung</strong>:&nbsp;&nbsp;&nbsp;
                    <select value={selectedCountry} onChange={handleCountryChange}>
                        {countries.map(country => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="chart-container">
                <div className="chart">
                    <PriceChart selectedDate={dateAddHours(selectedDate, 0)} selectedCountry={selectedCountryDAP}/>
                </div>
                <div className="chart">
                    <PowerChart selectedDate={dateAddHours(selectedDate, 0)} selectedCountry={selectedCountry}/>
                </div>
                <div className="chart">
                    <PowerPieChart selectedDate={dateAddHours(selectedDate, 0)} selectedCountry={selectedCountry}/>
                </div>
                <div className="chart">
                    <PowerPieChart selectedDate={dateAddHours(dateToday(HOUR_00_00_00), 0)} selectedCountry={selectedCountry} showLast={true}/>
                </div>
            </div>
            <div className="info-container">
                <h2>Quellen</h2>
                <ul>
                    <li><a href="https://api.energy-charts.info" target="_blank"
                           rel="noopener noreferrer">https://api.energy-charts.info</a> (Energiedaten)
                    </li>
                    <li><a href="https://api.sunrise-sunset.org" target="_blank"
                           rel="noopener noreferrer">https://api.sunrise-sunset.org</a> (Sonnenauf- und Untergangsdaten)
                    </li>
                </ul>

                <h2>Repositories</h2>
                <ul>
                    <li><a href="https://github.com/energy-monitoring/react-energy-dashbard" target="_blank"
                           rel="noopener noreferrer">https://github.com/energy-monitoring/react-energy-dashbard</a> (ReactJS
                        Quellen)
                    </li>
                    <li><a href="https://github.com/energy-monitoring/docker-api-proxy" target="_blank"
                           rel="noopener noreferrer">https://github.com/energy-monitoring/docker-api-proxy</a> (Docker
                        API Proxy)
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default App;
