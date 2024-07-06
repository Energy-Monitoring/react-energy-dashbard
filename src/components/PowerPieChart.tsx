import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label, Legend } from 'recharts';
import { chartConfigColors, chartConfigTranslations, chartConfigColorText, chartConfigYAxisFontSize} from '../config/chartConfig';
import {
    dateFormat,
    dateISOWithTimeOffset, dateSetTime, FORMAT_DATE_DE,
    FORMAT_DATE_TIME_DE,
    HOUR_00_00_00,
    HOUR_23_59_59
} from "../helper/dateHelper";
import {
    CustomLabelPowerPieProps,
    DataPointPowerPie, getDataPointsPowerPiData,
    processDatePowerAvg,
    processDatePowerLast
} from "../helper/dataHelper";
import {unitEnergyFormatter} from "../helper/unitHelper";

interface PieChartProps {
    selectedDate: Date
    selectedCountry: string;
    showLast?: boolean
}

/**
 * Custom tooltip for power pie chart.
 */
const CustomTooltipPowerPie = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const currentValue = payload[0].value.toFixed(2).replace('.', ',');
    const currentName = payload[0].name;

    return (
        <div className="custom-tooltip">
            <p className="label">{`${currentName}: ${currentValue}`} MW</p>
        </div>
    );
};

/**
 * Custom label for power pie chart.
 */
let customLabelPowerPiePositionPrev = { x: 0, y: 0 }
let customLabelPowerPieLabelPrev: string[] = [];
let customLabelPowerPieFillPrev: string[] = [];
let CustomLabelPowerPie: React.FC<CustomLabelPowerPieProps> = ({ name, value, fill, cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const distanceToGraph = 20;
    const distanceToLast = 26;

    const radian = Math.PI / 180;
    const radius = outerRadius + distanceToGraph;
    const x = cx + radius * Math.cos(-midAngle * radian);
    const y = cy + radius * Math.sin(-midAngle * radian);

    const positionPrev = customLabelPowerPiePositionPrev;
    const label = unitEnergyFormatter(value, true, 'MW');

    if (positionPrev && Math.abs(positionPrev.y - y) < distanceToLast) {
        customLabelPowerPieLabelPrev.push(label);
        customLabelPowerPieFillPrev.push(fill);
        return null;
    }

    customLabelPowerPiePositionPrev = { x, y };

    const labels = [label, ...customLabelPowerPieLabelPrev];
    const fills = [fill, ...customLabelPowerPieFillPrev];

    const customLabel = (
        <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {labels.map((label, index) => (
                <tspan key={index}>
                    <tspan fill={fills[index]}>{label}</tspan>
                    {index < labels.length - 1 && <tspan>, </tspan>}
                </tspan>
            ))}
        </text>
    );

    customLabelPowerPieLabelPrev = [];
    customLabelPowerPieFillPrev = [];

    return customLabel;
};

/**
 * PowerPieChart component.
 */
const PowerPieChart: React.FC<PieChartProps> = ({ selectedDate, selectedCountry, showLast = false }) => {
    const [dataProduction, setDataProduction] = useState<DataPointPowerPie[]>([]);
    const [dateProduction, setDateProduction] = useState<Date>(selectedDate);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const powerApiUrl = process.env.REACT_APP_POWER_API_URL;

                const dateFrom = dateISOWithTimeOffset(dateSetTime(dateProduction, HOUR_00_00_00));
                const dateTo = dateISOWithTimeOffset(dateSetTime(dateProduction, HOUR_23_59_59));

                const response = await axios.get(`${powerApiUrl}?country=${selectedCountry}&start=${dateFrom}&end=${dateTo}`);

                let date = null;
                let data = null;

                if (showLast) {
                    ({ date, data } = processDatePowerLast(response.data));
                    setDateProduction(date);
                    setDataProduction(getDataPointsPowerPiData(data));
                }

                if (!showLast) {
                    ({ data } = processDatePowerAvg(response.data));
                    setDataProduction(getDataPointsPowerPiData(data));
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData().catch(console.error);

        customLabelPowerPiePositionPrev = { x: 0, y: 0 };
        customLabelPowerPieLabelPrev = [];
        customLabelPowerPieFillPrev = [];
    }, []);

    let title = `Stromerzeugung DE Durchschnitt, ${dateFormat(dateProduction, FORMAT_DATE_DE)}`;

    if (showLast) {
        title = `Stromerzeugung DE aktuell, ${dateFormat(dateProduction, FORMAT_DATE_TIME_DE)} Uhr`;
    }

    return (
        <>
            <h2 className="title-2">{title}</h2>
            <p>&nbsp;</p>
            <ResponsiveContainer width="100%" height={600}>
                <PieChart>
                    <Tooltip content={CustomTooltipPowerPie} />
                    <Legend />
                    <Pie
                        data={dataProduction}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        innerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={CustomLabelPowerPie}
                    >
                        {dataProduction.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={chartConfigColors[entry.name]}
                                name={chartConfigTranslations[entry.name]}
                            />
                        ))}
                        <Label value="MW" position="center" fill={chartConfigColorText} fontSize={chartConfigYAxisFontSize} />
                    </Pie>

                </PieChart>
            </ResponsiveContainer>
        </>
    );
};

export default PowerPieChart;
