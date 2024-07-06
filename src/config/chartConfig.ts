export const chartConfigColors: {[key: string]: string} = {
    'Biomass': '#8884d8',
    'Cross border electricity trading': '#d88884',
    'Fossil brown coal / lignite': '#977b5a',
    'Fossil gas': '#c658ff',
    'Fossil hard coal': '#ca829d',
    'Fossil oil': '#da9a30',
    'Geothermal': '#0090ff',
    'Hydro Run-of-River': '#008000',
    'Hydro pumped storage consumption': '#208080',
    'Hydro pumped storage': '#2070a0',
    'Hydro water reservoir': '#2060c0',
    'Nuclear': '#800000',
    'Load': '#808080',
    'Others': '#805050',
    'Renewable share of generation': '#608040',
    'Renewable share of load': '#608060',
    'Residual load': '#404040',
    'Solar': '#c9c01b',
    'Waste': '#90d0ff',
    'Wind offshore': '#82ca9d',
    'Wind onshore': '#86af28',
};

export const chartConfigTranslations: {[key: string]: string} = {
    'Biomass': 'Biomasse',
    'Cross border electricity trading': 'Grenzüberschreitender Stromhandel',
    'Fossil brown coal / lignite': 'Fossile Braunkohle',
    'Fossil gas': 'Fossiles Gas',
    'Fossil hard coal': 'Fossile Steinkohle',
    'Fossil oil': 'Fossiles Öl',
    'Geothermal': 'Geothermie',
    'Hydro Run-of-River': 'Wasserkraft',
    'Hydro pumped storage consumption': 'Pumpspeicherkraftwerke Verbrauch',
    'Hydro pumped storage': 'Pumpspeicherkraftwerke',
    'Hydro water reservoir': 'Wasserspeicher',
    'Load': 'Last',
    'Nuclear': 'Atomstrom',
    'Others': 'Sonstige',
    'Renewable share of generation': 'Anteil der erneuerbaren Energien an der Erzeugung',
    'Renewable share of load': 'Anteil der erneuerbaren Energien an der Last',
    'Residual load': 'Restliche Last',
    'Solar': 'Solar / Photovoltaik',
    'Waste': 'Energiegewinnung aus Abfall',
    'Wind offshore': 'Wind offshore',
    'Wind onshore': 'Wind onshore',
};

export const chartConfigEnabled: {[key: string]: boolean} = {
    'Biomass': true,
    'Cross border electricity trading': false,
    'Fossil brown coal / lignite': true,
    'Fossil gas': true,
    'Fossil hard coal': true,
    'Fossil oil': true,
    'Geothermal': true,
    'Hydro Run-of-River': true,
    'Hydro pumped storage consumption': false,
    'Hydro pumped storage': true,
    'Hydro water reservoir': true,
    'Load': false,
    'Nuclear': true,
    'Others': true,
    'Renewable share of generation': false,
    'Renewable share of load': false,
    'Residual load': false,
    'Solar': true,
    'Waste': true,
    'Wind offshore': true,
    'Wind onshore': true,
};

export const chartConfigCollectOthersBelowAbsolute = 1000;

export const chartConfigCollectOthersBelowPercent = 2.5;

export const chartConfigPercent: {[key: string]: boolean} = {
    'Biomass': false,
    'Cross border electricity trading': false,
    'Fossil brown coal / lignite': false,
    'Fossil gas': false,
    'Fossil hard coal': false,
    'Fossil oil': false,
    'Geothermal': false,
    'Hydro Run-of-River': false,
    'Hydro pumped storage consumption': false,
    'Hydro pumped storage': false,
    'Hydro water reservoir': false,
    'Load': false,
    'Nuclear': false,
    'Others': false,
    'Renewable share of generation': true,
    'Renewable share of load': true,
    'Residual load': false,
    'Solar': false,
    'Waste': false,
    'Wind offshore': false,
    'Wind onshore': false,
};

export const chartConfigNameCollect = 'Others';

export const chartConfigColorText = '#404040';
export const chartConfigColorReferenceLinePriceMax = '#ff84d8';
export const chartConfigColorReferenceLinePriceMin = '#64e0b8';
export const chartConfigColorReferenceLinePriceAvg = '#8884d8';
export const chartConfigColorPrice = '#82ca9d';

export const chartConfigYAxisPositionX = 20;
export const chartConfigYAxisPositionY = 300;
export const chartConfigYAxisFontSize = 20;

export const chartConfigAxisTickStyle = { fill: chartConfigColorText };
