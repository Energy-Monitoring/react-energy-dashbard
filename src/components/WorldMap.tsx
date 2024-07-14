import React, { useEffect, useState } from 'react';
import {GeoJSON2SVG} from 'geojson2svg';
import SVGRenderer from "./SVGRenderer";
import {countriesDataLow} from "../config/geoJsonLow";
import {countriesDataMedium} from "../config/geoJsonMedium";
import {
    GeoJson,
    calculateBoundingBox,
    calculateBoundingBoxAll,
    transformGeoJsonToFeatureMap,
    TypeFeatureMap,
    centerBoundingBox,
    prepareGeoJsonData,
    zoomGapBoundingBoxLongitudeFactor,
    zoomGapBoundingBoxLatitudeFactor,
    zoomGapBoundingBoxLongitudeFactorAll,
    zoomGapBoundingBoxLatitudeFactorAll,
    calculateBoundingBoxEu,
    getPointSizeByBoundingBox,
    getBoundingType,
    calculateBoundingBoxEmpty
} from "../helper/wordMapHelper";
import {countryMap} from "../config/countries";

/**
 * PriceChart Interface
 */
interface WorldMapProps {
    country: string|null;
    width: number;
    height: number;
}

const zoomCountry = true;

/**
 * WorldMap component.
 */
const WorldMap: React.FC<WorldMapProps> = ({
    country, width, height
}) => {
    const [countryKey, setCountryKey] = useState<string|null>(country !== null ? country.toUpperCase() : null);
    const [dataSource, setDataSource] = useState<'low' | 'medium'>('low');
    const [data, setData] = useState<GeoJson>(() => prepareGeoJsonData(countriesDataLow, countryKey));

    useEffect(() => {
        const selectedData = dataSource === 'low' ? countriesDataLow : countriesDataMedium;
        setCountryKey(country !== null ? country.toUpperCase() : null);
        setData(prepareGeoJsonData(selectedData, countryKey));
    }, [dataSource, country, countryKey]);

    const dataIdMap: TypeFeatureMap = transformGeoJsonToFeatureMap(data);

    if (countryKey !== null && !dataIdMap.hasOwnProperty(countryKey)) {
        setCountryKey(null);
    }

    const boundingType: "country"|"all"|"eu" = getBoundingType(country, countryKey, zoomCountry);

    let boundingBox = calculateBoundingBoxEmpty();

    switch (boundingType) {
        case "all":
            boundingBox = calculateBoundingBoxAll(dataIdMap);
            break;

        case "eu":
            boundingBox = calculateBoundingBoxEu();
            break;

        case "country":
            if (countryKey === null) {
                throw new Error('Unsupported case. Country must not be null.');
            }

            boundingBox = calculateBoundingBox(dataIdMap[countryKey]);
    }

    /* Centers the bounding box to output svg. */
    boundingBox = centerBoundingBox(
        boundingBox,
        width,
        height,
        boundingType === 'country' ? zoomGapBoundingBoxLongitudeFactor : zoomGapBoundingBoxLongitudeFactorAll,
        boundingType === 'country' ? zoomGapBoundingBoxLatitudeFactor : zoomGapBoundingBoxLatitudeFactorAll,
    );

    const converter: GeoJSON2SVG = new GeoJSON2SVG({
        mapExtent: { left: boundingBox.longitudeMin, bottom: boundingBox.latitudeMin, right: boundingBox.longitudeMax, top: boundingBox.latitudeMax },
        viewportSize: { width, height },
        attributes: [
            {property: 'fill', type: 'static', value: '#d0d0d0'},
            {property: 'stroke', type: 'static', value: '#a0a0a0'},
            {property: 'stroke-width', type: 'static', value: '0.1'},
            {property: 'properties.fill', type: 'dynamic'},
            {property: 'properties.stroke', type: 'dynamic'},
            {property: 'properties.stroke-width', type: 'dynamic'}
        ],
        r: getPointSizeByBoundingBox(boundingBox, boundingType)
    });

    const svgContent = converter.convert(data);

    const translation = countryKey !== null && countryMap.hasOwnProperty(countryKey.toLowerCase()) ?
        countryMap[countryKey.toLowerCase()] :
        null;

    return (
        <>
            <h1>Weltkarte</h1>
            <div className="panel-switcher">
                <strong>Auflösung</strong>:
                <label>
                    <input
                        type="radio"
                        value="low"
                        checked={dataSource === 'low'}
                        onChange={() => setDataSource('low')}
                    />
                    Low
                </label>
                <label>
                    <input
                        type="radio"
                        value="medium"
                        checked={dataSource === 'medium'}
                        onChange={() => setDataSource('medium')}
                    />
                    Medium
                </label>
            </div>
            <div className="svg">
                <div className="svg-title">
                    {translation ? `Karte von ${translation.name}` : 'Weltkarte'}
                </div>
                <SVGRenderer svgContent={svgContent}/>
            </div>
        </>
    );
};

export default WorldMap;
