import {
    chartConfigColorPrice,
    chartConfigColorReferenceLinePriceAvg,
    chartConfigColorReferenceLinePriceMax,
    chartConfigColorReferenceLinePriceMin, chartConfigColors,
    chartConfigEnabled, chartConfigCollectOthersBelowAbsolute,
    chartConfigNameCollect,
    chartConfigTranslations, chartConfigCollectOthersBelowPercent
} from "../config/chartConfig";
import {dateFormat, FORMAT_HOUR_MINUTE} from "./dateHelper";
import {Payload} from "recharts/types/component/DefaultLegendContent";
import {priceEnergyFormatter} from "./priceHelper";

export interface DataPointPrice {
    time: string;
    price: number;
}

export interface DataPointPower {
    date: Date;
    data: {
        [key: string]: number;
    };
}

export interface DataPointsKeyNumber {
    [key: string]: number;
}

export interface DataPointsPower {
    dataPoints: DataPointPower[];
    average: DataPointsKeyNumber;
}

export interface DataPointPowerPie {
    name: string;
    value: number;
}

export interface ProductionType {
    name: string;
    data: number[];
}

export interface ApiPower {
    production_types: ProductionType[],
    unix_seconds: number[]
}

export interface ApiPrice {
    unix_seconds: number[],
    price: number[]
}

export interface ApiSunriseSunset {
    results: {
        "sunrise": string,
        "sunset": string,
        "solar_noon": string,
        "day_length": string,
        "civil_twilight_begin": string,
        "civil_twilight_end": string,
        "nautical_twilight_begin": string,
        "nautical_twilight_end": string,
        "astronomical_twilight_begin": string,
        "astronomical_twilight_end": string
    },
    status: string,
    tzid: string
}

export interface CustomLabelPowerPieProps {
    name: number;
    value: number;
    fill: string;
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
}

/**
 * Processes the price data from api endpoint:
 *
 * - https://api.energy-charts.info/price?bzn=DE-LU&start=2024-07-04&end=2024-07-04
 * - etc.
 */
export const processDatePrice = (data: ApiPrice): {
    data: DataPointPrice[],
    priceAvg: number,
    priceMin: number,
    priceMax: number
} => {

    const unix_seconds = data.unix_seconds;
    const prices = data.price;

    /* Format the data. */
    const formattedData = unix_seconds.map((timestamp: number, index: number) => ({
        time: new Date(timestamp * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        price: prices[index] * 0.001 * 100
    }));

    /* Calculate the average price. */
    const total = formattedData.reduce((sum, dataPoint) => sum + dataPoint.price, 0);
    const averagePrice = total / formattedData.length;

    /* Find the minimum and maximum price. */
    const minPrice = Math.min(...formattedData.map(dataPoint => dataPoint.price));
    const maxPrice = Math.max(...formattedData.map(dataPoint => dataPoint.price));

    return { data: formattedData, priceAvg: averagePrice, priceMin: minPrice, priceMax: maxPrice };
};
export const getPriceLegendPayload = (priceMax: number, priceAvg: number, priceMin: number): Payload[] => {
    return [
        { value: 'Day-Ahead Preis', type: 'square', id: 'ID01', color: chartConfigColorPrice },
        { value: `Preis Max: ${priceEnergyFormatter(priceMax, true)}`, type: 'line', id: 'ID02', color: chartConfigColorReferenceLinePriceMax },
        { value: `Preis ø: ${priceEnergyFormatter(priceAvg, true)}`, type: 'line', id: 'ID03', color: chartConfigColorReferenceLinePriceAvg },
        { value: `Preis Min: ${priceEnergyFormatter(priceMin, true)}`, type: 'line', id: 'ID04', color: chartConfigColorReferenceLinePriceMin },
    ]
};

/**
 * Processes the power data from api endpoint and return the last point:
 *
 * - https://energy-api.ixno.de/aec/public_power?country=de&start=2024-07-03T22:00:00Z&end=2024-07-04T21:59:59Z
 * - etc.
 */
export const processDatePowerLast = (data: ApiPower): {
    date: Date,
    data: DataPointsKeyNumber,
} => {
    const unixSeconds = data.unix_seconds;
    const productionTypes = data.production_types;

    const { data: average } = getDatePowerAvgAll(productionTypes);

    const latestTimestamp = unixSeconds[unixSeconds.length - 1];
    const latestDate = new Date(latestTimestamp * 1000);

    let otherKeys: string[] = [];

    let otherValue = 0;

    const dataLast: DataPointsKeyNumber = {};

    productionTypes.map((type: ProductionType) => {
        const value = Number(type.data[type.data.length - 1]);
        const name = type.name;
        const enabled = chartConfigEnabled[name];
        const valueAverage = Number(average[name]);

        if (!enabled) {
            return null;
        }

        const collect = valueAverage < chartConfigCollectOthersBelowAbsolute;

        if (collect || name === chartConfigNameCollect) {
            otherValue += value;

            if (!otherKeys.includes(name)) {
                otherKeys.push(name);
            }

            return;
        }

        dataLast[name] = value;
    });

    /* Add other value. */
    dataLast[chartConfigNameCollect] = otherValue;

    return { date: latestDate, data: dataLast };
};

/**
 * Processes the power data from api endpoint and return the average values:
 *
 * - https://energy-api.ixno.de/aec/public_power?country=de&start=2024-07-03T22:00:00Z&end=2024-07-04T21:59:59Z
 * - etc.
 */
export const processDatePowerAvg = (data: ApiPower): {
    data: DataPointsKeyNumber,
} => {
    const productionTypes = data.production_types;

    const { data: average } = getDatePowerAvgAll(productionTypes);

    let otherKeys: string[] = [];

    let otherValue = 0;

    const dataAverage: DataPointsKeyNumber = {};

    productionTypes.map((type: ProductionType) => {
        const name = type.name;
        const value = Number(average[name]);

        const enabled = chartConfigEnabled[name];

        if (!enabled) {
            return null;
        }

        const collect = value < chartConfigCollectOthersBelowAbsolute;

        if (collect || name === chartConfigNameCollect) {
            otherValue += value;

            if (!otherKeys.includes(name)) {
                otherKeys.push(name);
            }

            return;
        }

        dataAverage[name] = value;
    });

    /* Add other value. */
    dataAverage[chartConfigNameCollect] = otherValue;

    return { data: dataAverage };
};
export const getDatePowerAvgAll = (productionTypes: ProductionType[]): {
    data: DataPointsKeyNumber,
} => {
    const sum: { [key: string]: number } = {};
    const count: { [key: string]: number } = {};

    productionTypes.forEach(production => {
        if (!sum[production.name]) {
            sum[production.name] = 0;
            count[production.name] = 0;
        }
        production.data.forEach(value => {
            sum[production.name] += value;
            count[production.name] += 1;
        });
    });

    const dataAverage: { [key: string]: number } = {};
    Object.keys(sum).forEach(key => {
        dataAverage[key] = Math.round((sum[key] / count[key]) * 100) / 100;
    });

    return {
        data: dataAverage
    };
};
export const getDatePowerPercentageAll = (productionTypes: ProductionType[]): {
    data: DataPointsKeyNumber,
} => {
    const sum: { [key: string]: number } = {};
    let totalSum = 0;

    productionTypes.forEach(production => {
        if (!sum[production.name]) {
            sum[production.name] = 0;
        }
        production.data.forEach(value => {
            if (!chartConfigEnabled[production.name]) {
                return;
            }

            sum[production.name] += value;
            totalSum += value;
        });
    });

    const dataPercentage: { [key: string]: number } = {};
    Object.keys(sum).forEach(key => {
        dataPercentage[key] = Math.round((sum[key] / totalSum) * 100 * 100) / 100;
    });

    return {
        data: dataPercentage
    };
};
export const getDataPointsPowerPiData = (dataPoints: DataPointsKeyNumber): DataPointPowerPie[] => {
    return Object.keys(dataPoints).map(key => {
        return {
            name: key,
            value: dataPoints[key]
        }
    });
};

/**
 * Processes the power data from api endpoint:
 *
 * - https://energy-api.ixno.de/aec/public_power?country=de&start=2024-07-03T22:00:00Z&end=2024-07-04T21:59:59Z
 * - etc.
 */
export const processDatePower = (data: ApiPower): {
    data: DataPointPower[],
    otherKeys: string[]
} => {
    const unixSeconds = data.unix_seconds;
    const productionTypes = data.production_types;

    const { data: percent } = getDatePowerPercentageAll(productionTypes);

    console.log(percent);

    let otherKeys: string[] = [];

    const dataPoints = unixSeconds.map((timestamp: number, index: number) => {
        const date = new Date(timestamp * 1000);

        const dataPoint: DataPointPower = {
            date: date,
            data: {}
        };

        let otherValue = 0;

        productionTypes.forEach((type: ProductionType) => {
            const value = Number(type.data[index]);
            const name = type.name;
            const valueAverage = Number(percent[name]);

            const enabled = chartConfigEnabled[name];

            if (!enabled) {
                return;
            }

            const collect = valueAverage < chartConfigCollectOthersBelowPercent;

            if (collect || name === chartConfigNameCollect) {
                otherValue += value;

                if (!otherKeys.includes(name)) {
                    otherKeys.push(name);
                }

                return;
            }

            dataPoint.data[name] = value;
        });

        /* Add other value */
        if (otherValue > 0) {
            dataPoint.data[chartConfigNameCollect] = otherValue;
        }

        return dataPoint;
    });

    return {
        data: dataPoints,
        otherKeys
    };
};
export const getDataPointPowerData = (dataPoints: DataPointPower[]) => {
    return dataPoints.map(dataPoint => {
        return {
            time: dateFormat(dataPoint.date, FORMAT_HOUR_MINUTE),
            ...dataPoint.data
        }
    });
};
export const getDataPointPowerKeys = (dataPoints: DataPointPower[]) => {
    return dataPoints.length > 0 ? Object.keys(dataPoints[0].data) : [];
};
export const getPowerLegendPayload = (dataPoints: DataPointPower[], otherKeys: string[]): Payload[] => {
    if (dataPoints.length <= 0) {
        return [];
    }

    return Object.keys(dataPoints[0].data).map(key => {
        let value = chartConfigTranslations[key];

        if (key === chartConfigNameCollect) {
            value += ' (' + otherKeys.map(key => chartConfigTranslations[key]).join(', ') + ')';
        }

        return {
            value,
            type: 'line',
            id: 'ID01',
            color: chartConfigColors[key],
        }
    });
};

/**
 * Processes the sunrise/sunset data from api endpoint:
 *
 * - https://api.sunrise-sunset.org/json?lat=51.1333&lng=10.4167&date=2024-07-03
 * - etc.
 */
export const processSunriseSunset = (data: ApiSunriseSunset): {
    sunrise: string,
    sunset: string
} => {
    const sunrise: string = data.results.sunrise;
    const sunset: string = data.results.sunset;

    return {sunrise, sunset}
};