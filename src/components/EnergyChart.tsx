import React, {useState} from 'react';
import CSVReader from 'react-csv-reader';
import {Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';

interface DataRow {
    date: Date;
    biomass: number;
    hydro: number;
    windOffshore: number;
    windOnshore: number;
    solar: number;
    otherRenewables: number;
    nuclear: number;
    lignite: number;
    hardCoal: number;
    naturalGas: number;
    pumpedStorage: number;
    otherConventional: number;
    overall: number;
}

const parseDate = (dateString: string): Date => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('.').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    return new Date(Date.UTC(year, month - 1, day, hours - 2, minutes));
}

const parseFloatOrZero = (str: string | undefined): number => {
    if (!str) return 0;
    const parsed = parseFloat(str.replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
};

const formatDate = (date: Date): string => {
    return (date.getHours() > 9 ? date.getHours() : ('0' + date.getHours())) +
        ':' +
        (date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes()));
}

let dataOverall: any[];

const EnergyChart: React.FC = () =>
{
    const [data, setData] = useState<DataRow[]>([]);
    const [visibleLines, setVisibleLines] = useState<Record<keyof Omit<DataRow, 'date'>, boolean>>({
        biomass: false,
        hydro: true,
        windOffshore: true,
        windOnshore: false,
        solar: true,
        otherRenewables: false,
        nuclear: false,
        lignite: false,
        hardCoal: true,
        naturalGas: true,
        pumpedStorage: true,
        otherConventional: false,
        overall: false,
    });

    const getFormattedData = (visibleLines: Record<keyof Omit<DataRow, 'date'>, boolean>) =>
    {
        return dataOverall.map((row: any) =>
        {
            let date = parseDate(row['Datum von']);

            let biomass = parseFloat(row['Biomasse [MWh] Originalauflösungen']);
            let hydro = parseFloat(row['Wasserkraft [MWh] Originalauflösungen']);
            let windOffshore = parseFloat(row['Wind Offshore [MWh] Originalauflösungen']);
            let windOnshore = parseFloat(row['Wind Onshore [MWh] Originalauflösungen']);
            let solar = parseFloat(row['Photovoltaik [MWh] Originalauflösungen']);
            let otherRenewables = parseFloat(row['Sonstige Erneuerbare [MWh] Originalauflösungen']);
            let nuclear = (row['Kernenergie [MWh] Originalauflösungen'] === '-' ? 0 : parseFloat(row['Kernenergie [MWh] Originalauflösungen']));
            let lignite = parseFloat(row['Braunkohle [MWh] Originalauflösungen']);
            let hardCoal = parseFloat(row['Steinkohle [MWh] Originalauflösungen']);
            let naturalGas = parseFloat(row['Erdgas [MWh] Originalauflösungen']);
            let pumpedStorage = parseFloat(row['Pumpspeicher [MWh] Originalauflösungen']);
            let otherConventional = parseFloat(row['Sonstige Konventionelle [MWh] Originalauflösungen']);

            let overall = 0;

            if (visibleLines.biomass) {
                overall += biomass;
            }
            if (visibleLines.hydro) {
                overall += hydro;
            }
            if (visibleLines.windOffshore) {
                overall += windOffshore;
            }
            if (visibleLines.windOnshore) {
                overall += windOnshore;
            }
            if (visibleLines.solar) {
                overall += solar;
            }
            if (visibleLines.otherRenewables) {
                overall += otherRenewables;
            }
            if (visibleLines.nuclear) {
                overall += nuclear;
            }
            if (visibleLines.lignite) {
                overall += lignite;
            }
            if (visibleLines.hardCoal) {
                overall += hardCoal;
            }
            if (visibleLines.naturalGas) {
                overall += naturalGas;
            }
            if (visibleLines.pumpedStorage) {
                overall += pumpedStorage;
            }
            if (visibleLines.otherConventional) {
                overall += otherConventional;
            }

            return {
                date,
                biomass,
                hydro,
                windOffshore,
                windOnshore,
                solar,
                otherRenewables,
                nuclear,
                lignite,
                hardCoal,
                naturalGas,
                pumpedStorage,
                otherConventional,
                overall
            }
        });
    }

    const handleFileLoad = (data: any[], fileInfo: { name: string }) =>
    {
        dataOverall = data;
        setData(getFormattedData(visibleLines));
    };

    const toggleLineVisibility = (key: keyof Omit<DataRow, 'date'>) =>
    {
        setVisibleLines((prevState) =>
        {
            const newVisibleLines = {
                ...prevState,
                [key]: !prevState[key],
            };
            setData(getFormattedData(newVisibleLines));

            return newVisibleLines;
        });
    };

    return (
        <div>
            <h1>Energy Production Visualization</h1>
            <CSVReader
                cssClass="csv-reader-input"
                label="Select CSV with energy data"
                onFileLoaded={handleFileLoad}
                parserOptions={{ header: true, delimiter: ';' }}
            />
            <div>
                {Object.keys(visibleLines).map((key) => (
                    <label key={key}>
                        <input
                            type="checkbox"
                            checked={visibleLines[key as keyof Omit<DataRow, 'date'>]}
                            onChange={() => toggleLineVisibility(key as keyof Omit<DataRow, 'date'>)}
                        />
                        {key}
                    </label>
                ))}
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                    data={data}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => formatDate(date)} />
                    <YAxis domain={[0, 'auto']} />
                    <Tooltip />
                    <Legend />
                    {visibleLines.overall && <Area type="monotone" dataKey="overall" stroke="#efefff" fill="#dfdfef" dot={false} />}
                    {visibleLines.biomass && <Line type="monotone" dataKey="biomass" stroke="#8884d8" dot={false} />}
                    {visibleLines.hydro && <Line type="monotone" dataKey="hydro" stroke="#82ca9d" dot={false} />}
                    {visibleLines.windOffshore && <Line type="monotone" dataKey="windOffshore" stroke="#ffc658" dot={false} />}
                    {visibleLines.windOnshore && <Line type="monotone" dataKey="windOnshore" stroke="#ff7300" dot={false} />}
                    {visibleLines.solar && <Line type="monotone" dataKey="solar" stroke="#ff0000" dot={false} />}
                    {visibleLines.otherRenewables && <Line type="monotone" dataKey="otherRenewables" stroke="#00ff00" dot={false} />}
                    {visibleLines.nuclear && <Line type="monotone" dataKey="nuclear" stroke="#0000ff" dot={false} />}
                    {visibleLines.lignite && <Line type="monotone" dataKey="lignite" stroke="#8b0000" dot={false} />}
                    {visibleLines.hardCoal && <Line type="monotone" dataKey="hardCoal" stroke="#2f4f4f" dot={false} />}
                    {visibleLines.naturalGas && <Line type="monotone" dataKey="naturalGas" stroke="#daa520" dot={false} />}
                    {visibleLines.pumpedStorage && <Line type="monotone" dataKey="pumpedStorage" stroke="#4b0082" dot={false} />}
                    {visibleLines.otherConventional && <Line type="monotone" dataKey="otherConventional" stroke="#ff69b4" dot={false} />}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EnergyChart;
