import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';
import {
    chartConfigColorText,
    chartConfigYAxisPositionX,
    chartConfigYAxisPositionY,
    chartConfigYAxisFontSize,
    chartConfigColorReferenceLinePriceMax,
    chartConfigColorReferenceLinePriceAvg,
    chartConfigColorReferenceLinePriceMin,
    chartConfigAxisTickStyle,
    chartConfigColorPrice
} from '../config/chartConfig';
import { priceEnergyFormatter } from "../helper/priceHelper";
import { dateFormat, dateISOWithTimeOffset, dateSetTime, FORMAT_DATE_DE, HOUR_00_00_00, HOUR_23_59_59 } from "../helper/dateHelper";
import {DataPointPrice, getPriceLegendPayload, processDatePrice} from "../helper/dataHelper";

/**
 * PriceChart Interface
 */
interface PriceChartProps {
    selectedDate: Date;
    selectedCountry: string;
}

/**
 * Custom tooltip for price chart.
 */
const CustomTooltipPrice = ({ active, payload, label }: any) => {

    if (!active || !payload || !payload.length) {
        return null;
    }

    const currentHour = new Date(`1970-01-01T${label}:00`);
    const nextHour = new Date(currentHour);
    nextHour.setHours(currentHour.getHours() + 1);
    const formattedCurrentHour = currentHour.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const formattedNextHour = nextHour.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="custom-tooltip">
            <p className="label">{`${formattedCurrentHour} - ${formattedNextHour}`}</p>
            <p className="price">{`Day-Ahead Preis: ${priceEnergyFormatter(payload[0].value, true)}`}</p>
        </div>
    );
};

/**
 * Custom label for bar values.
 */
const CustomLabelBar = ({ viewBox, value }: { viewBox: any; value: number }) => {
    const {x, y, width} = viewBox;

    const posX = x + width / 2;
    const posY = value < 0 ? y + 12 : y - 12;

    return (
        <text x={posX} y={posY} fill={chartConfigColorText} textAnchor="middle" dominantBaseline="middle" fontSize={12}>
            {priceEnergyFormatter(value, false)}
        </text>
    );
};

/**
 * PriceChart component.
 *
 * @param date
 * @constructor
 */
const PriceChart: React.FC<PriceChartProps> = ({ selectedDate, selectedCountry }) => {
    const [data, setData] = useState<DataPointPrice[]>([]);
    const [priceAvg, setPriceAvg] = useState<number>(0);
    const [priceMin, setPriceMin] = useState<number>(0);
    const [priceMax, setPriceMax] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const priceApiUrl = process.env.REACT_APP_PRICE_API_URL;

                const dateFrom = dateISOWithTimeOffset(dateSetTime(selectedDate, HOUR_00_00_00));
                const dateTo = dateISOWithTimeOffset(dateSetTime(selectedDate, HOUR_23_59_59));

                const response = await axios.get(`${priceApiUrl}?bzn=${selectedCountry}&start=${dateFrom}&end=${dateTo}`);

                const {
                    data,
                    priceAvg,
                    priceMin,
                    priceMax
                } = processDatePrice(response.data);

                setData(data);
                setPriceAvg(priceAvg);
                setPriceMin(priceMin);
                setPriceMax(priceMax);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData().catch(console.error);
    }, [selectedDate, selectedCountry]);

    const selectedDateFormatted = dateFormat(selectedDate, FORMAT_DATE_DE);
    const selectedCountryFormatted = selectedCountry.toUpperCase();

    return (
        <>
            <h2 className="title-2">Day-Ahead Preise {selectedCountryFormatted}, {selectedDateFormatted}</h2>
            <p>&nbsp;</p>
            <ResponsiveContainer width="100%" height={600}>
                <BarChart data={data} margin={{top: 20, right: 0, left: 30, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="time" tick={chartConfigAxisTickStyle} ticks={['06:00', '12:00', '18:00']}/>
                    <YAxis unit="" tick={chartConfigAxisTickStyle} ticks={[0, 5, 10, 15, 20]}
                           domain={[priceMin > 0 ? 0 : priceMin - 1, priceMax + 1]} allowDataOverflow={true}/>
                    <Tooltip content={CustomTooltipPrice}/>
                    <Legend payload={getPriceLegendPayload(priceMax, priceAvg, priceMin)} />

                    <ReferenceLine
                        stroke={chartConfigColorReferenceLinePriceMax}
                        strokeDasharray="4 1"
                        strokeWidth={1}
                        y={priceMax}
                    />
                    <ReferenceLine
                        stroke={chartConfigColorReferenceLinePriceAvg}
                        strokeDasharray="4 1"
                        strokeWidth={1}
                        y={priceAvg}
                    />
                    <ReferenceLine
                        stroke={chartConfigColorReferenceLinePriceMin}
                        strokeDasharray="4 1"
                        strokeWidth={1}
                        y={priceMin}
                    />

                    <Bar
                        label={(props) => <CustomLabelBar {...props} value={props.value} />}
                        type="monotone"
                        dataKey="price"
                        name="Day-Ahead Preis"
                        stroke={chartConfigColorPrice}
                        fill={chartConfigColorPrice}
                    />

                    <text
                        x={chartConfigYAxisPositionX}
                        y={chartConfigYAxisPositionY}
                        textAnchor="middle"
                        transform={`rotate(-90, ${chartConfigYAxisPositionX}, ${chartConfigYAxisPositionY})`}
                        fontSize={chartConfigYAxisFontSize}
                        fill={chartConfigColorText}
                    >
                        Cent/kWh
                    </text>
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default PriceChart;
