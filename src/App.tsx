import React, { useState } from 'react';
import './scss/main.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PriceChart from "./components/PriceChart";
import PowerChart from "./components/PowerChart";
import PowerPieChart from "./components/PowerPieChart";
import {
    dateAddHours,
    dateSetTime,
    dateToday,
    dateYesterday,
    HOUR_00_00_00
} from "./helper/dateHelper";
import WorldMap from "./components/WorldMap";
import {countrySelections, countryDayAheadPrices} from "./data/countries";
import Table from "./components/Table";

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

    const minDate = new Date('2020-01-01');
    const maxDate = new Date();

    const getOptionColor = (priority: number): string => {
        switch (priority) {
            case 2:
                return '#000080';
            case 1:
                return '#008000';
            case 0:
                return '#202020';
            default:
                return '#000000';
        }
    };

    const version = process.env.REACT_APP_VERSION;

    return (
        <div className="app-container">
            <h1 className="title-1">Übersicht</h1>
            <div className="controls-container">
                <div className="date-picker-container">
                    <strong>Datum</strong>:<br/>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        minDate={minDate}
                        maxDate={maxDate}
                        popperPlacement={'bottom-end'}
                    />
                </div>
                <div className="day-ahead-price-picker-container">
                    <strong>Day Ahead Preis</strong>:<br/>
                    <select value={selectedCountryDAP} onChange={handleDayAheadPriceChange}>
                        {
                            countryDayAheadPrices.map(price => (
                                <option key={price.code} value={price.code}>
                                    {price.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="country-picker-container">
                    <strong>Stromerzeugung</strong>:<br/>
                    <select value={selectedCountry} onChange={handleCountryChange}>
                        {
                            countrySelections
                                .filter(country => country.enabled)
                                .sort((countryA, countryB) => countryA.name.localeCompare(countryB.name))
                                .sort((countryA, countryB) => countryA.priority > countryB.priority ? -1 : 1)
                                .map(country => (
                                    <option key={country.code} value={country.code} style={{ color: getOptionColor(country.priority) }}>
                                        {country.name}
                                    </option>
                                ))
                        }
                    </select>
                </div>
            </div>
            <div className="chart-container">
                {/*<div className="chart">*/}
                {/*    <WorldMap country={selectedCountry} width={200} height={100}/>*/}
                {/*</div>*/}
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
                    <PowerPieChart selectedDate={dateAddHours(dateToday(HOUR_00_00_00), 0)}
                                   selectedCountry={selectedCountry} showLast={true}/>
                </div>
                <div className="chart">
                    <WorldMap country={selectedCountry} width={200} height={110}/>
                </div>
                <div className="chart">
                    <Table/>
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
                    <li><a href="https://geojson-maps.kyd.au" target="_blank"
                           rel="noopener noreferrer">https://geojson-maps.kyd.au</a> (GeoJSON Data)
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
            <div className="info-container">
                <p style={{textAlign: "left"}}>Version: <a href="https://github.com/energy-monitoring/react-energy-dashbard/releases" target="_blank" rel="noopener noreferrer">{ version }</a></p>
            </div>
        </div>
    );
};

export default App;
