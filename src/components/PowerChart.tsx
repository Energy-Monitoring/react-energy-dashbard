import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { chartConfigColors, chartConfigTranslations, chartConfigEnabled, chartConfigColorText, chartConfigYAxisPositionX, chartConfigYAxisPositionY, chartConfigYAxisFontSize, chartConfigAxisTickStyle} from '../config/chartConfig';
import {
    dateFormat,
    dateISOWithTimeOffset,
    dateRound15Minutes,
    dateSetTime,
    HOUR_00_00_00,
    HOUR_23_59_59,
    FORMAT_DATE_DE,
    FORMAT_HOUR_MINUTE,
    dateRound60Minutes
} from "../helper/dateHelper";
import {
    DataPointPower,
    getDataPointPowerData,
    getDataPointPowerKeys, getPowerLegendPayload,
    processDatePower, processSunriseSunset
} from "../helper/dataHelper";
import {positions} from "../config/countries";

interface PowerChartProps {
    selectedDate: Date;
    selectedCountry: string;
}

let distanceGlobal = 15;

/**
 * Custom tooltip for power chart.
 */
const CustomTooltipPower = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const currentTime = new Date(`1970-01-01T${label}:00`);
    const nextTime = new Date(currentTime);
    nextTime.setMinutes(currentTime.getMinutes() + distanceGlobal);
    const formattedCurrentTime = currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const formattedNextTime = nextTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="custom-tooltip">
            <p className="label">{`${formattedCurrentTime} - ${formattedNextTime}`}</p>

            <ul>
                {[...payload].reverse().map((entry: any, index: number) => (
                    <li key={`item-${index}`} className="price">
                        <span className="dot" style={{ color: entry.fill }}>&#9679;&nbsp;&nbsp;</span>
                        {`${entry.name}: ${entry.value.toFixed(2).replace('.', ',')} MW`}
                    </li>
                ))}
            </ul>
        </div>
    );
};

/**
 * Custom label for sunrise/sunset.
 */
const CustomLabelSunriseSunset = ({ viewBox, value }: { viewBox: any; value: string }) => {
    const { x, y, width } = viewBox;

    return (
        <text x={x + width / 2 - 20} y={y - 10} fill={chartConfigColorText} textAnchor="middle" dominantBaseline="middle">
            {value}
        </text>
    );
};

const getCoordinate = (selectedCountry: string): {latitude: number, longitude: number, name: string, distance: number} => {
    if (positions.hasOwnProperty(selectedCountry)) {
        return positions[selectedCountry];
    }

    return positions['de'];
}

/**
* PowerChart component.
*/
const PowerChart: React.FC<PowerChartProps> = ({ selectedDate, selectedCountry}) => {
    const [data, setData] = useState<DataPointPower[]>([]);
    const [otherKeys, setOtherKeys] = useState<string[]>([]);
    const [sunrise, setSunrise] = useState('');
    const [sunset, setSunset] = useState('');
    const [sunriseReal, setSunriseReal] = useState('');
    const [sunsetReal, setSunsetReal] = useState('');
    const [latitude, setLatitude] = useState<number>(51.1333);
    const [longitude, setLongitude] = useState<number>(10.4167);
    const [name, setName] = useState<string>('Deutschland');
    const [distance, setDistance] = useState<number>(15);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const powerApiUrl = process.env.REACT_APP_POWER_API_URL;
                const sunApiUrl = process.env.REACT_APP_SUN_API_URL;

                const { latitude, longitude, name , distance } = getCoordinate(selectedCountry);

                setLatitude(latitude);
                setLongitude(longitude);
                setName(name);
                setDistance(distance);

                distanceGlobal = distance;

                const dateFrom = dateISOWithTimeOffset(dateSetTime(selectedDate, HOUR_00_00_00));
                const dateTo = dateISOWithTimeOffset(dateSetTime(selectedDate, HOUR_23_59_59));
                const date = dateFormat(selectedDate);

                const [powerResponse, sunriseSunsetResponse] = await Promise.all([
                    axios.get(`${powerApiUrl}?country=${selectedCountry}&start=${dateFrom}&end=${dateTo}`),
                    axios.get(`${sunApiUrl}?lat=${latitude}&lng=${longitude}&date=${date}`)
                ]);

                const { data, otherKeys } = processDatePower(powerResponse.data);
                const { sunrise, sunset } = processSunriseSunset(sunriseSunsetResponse.data);

                console.log(sunrise, sunset);

                setOtherKeys(otherKeys);
                setData(data);

                setSunriseReal(dateFormat(dateSetTime(selectedDate, sunrise, true), FORMAT_HOUR_MINUTE));
                setSunsetReal(dateFormat(dateSetTime(selectedDate, sunset, true), FORMAT_HOUR_MINUTE));

                switch (distance) {
                    case 15:
                        setSunrise(dateRound15Minutes(selectedDate, sunrise, true));
                        setSunset(dateRound15Minutes(selectedDate, sunset, true));
                        break;

                    default:
                        setSunrise(dateRound60Minutes(selectedDate, sunrise, true));
                        setSunset(dateRound60Minutes(selectedDate, sunset, true));
                        break;
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData().catch(console.error);
    }, [selectedDate, selectedCountry]);

    const rechartsData = getDataPointPowerData(data);
    const rechartsKeys = getDataPointPowerKeys(data);

    const selectedDateFormatted = dateFormat(selectedDate, FORMAT_DATE_DE);
    const selectedCountryFormatted = selectedCountry.toUpperCase();

    return (
        <>
            <h2 className="title-2">Stromerzeugung {selectedCountryFormatted}, {selectedDateFormatted}</h2>
            <p style={{textAlign: 'center'}}>Sonnenauf- und untergang: <a href={`https://locate.place/location.html?q=${latitude}%2C+${longitude}&language=de&next_places=1`} target="_blank" rel="noopener noreferrer">Länge: {latitude}°, Breite: {longitude}°</a> (Geometrischer Mittelpunkt von {name})</p>
            <ResponsiveContainer width="100%" height={600}>
                <AreaChart data={rechartsData} margin={{top: 20, right: 30, left: 30, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={chartConfigAxisTickStyle} ticks={['00:00', '06:00', '12:00', '18:00']} />
                    <YAxis unit="" tick={chartConfigAxisTickStyle} />
                    <Tooltip content={CustomTooltipPower} />
                    <Legend payload={getPowerLegendPayload(data, otherKeys)} />

                    {rechartsKeys.map((key, index) => (
                        <Area
                            key={key}
                            type="monotone"
                            stackId="1"
                            dataKey={key}
                            name={chartConfigTranslations[key]}
                            stroke={chartConfigColors[key]}
                            fill={chartConfigColors[key]}
                        />
                    ))}

                    {sunrise && (
                        <ReferenceLine
                            label={(props) => <CustomLabelSunriseSunset {...props} value={`Sonnenaufgang ${sunriseReal} Uhr`}/>}
                            stroke="#ff8000"
                            strokeDasharray="4 1"
                            strokeWidth={1}
                            x={sunrise}
                        />
                    )}

                    {sunset && (
                        <ReferenceLine
                            label={(props) => <CustomLabelSunriseSunset {...props} value={`Sonnenuntergang ${sunsetReal} Uhr`}/>}
                            stroke="#ff0000"
                            strokeDasharray="4 1"
                            strokeWidth={1}
                            x={sunset}
                        />
                    )}

                    <text
                        x={chartConfigYAxisPositionX}
                        y={chartConfigYAxisPositionY}
                        textAnchor="middle"
                        transform={`rotate(-90, ${chartConfigYAxisPositionX}, ${chartConfigYAxisPositionY})`}
                        fontSize={chartConfigYAxisFontSize}
                        fill={chartConfigColorText}
                    >MW
                    </text>
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
};

export default PowerChart;
