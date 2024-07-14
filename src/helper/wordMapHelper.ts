import proj4 from 'proj4';
import {cities, TypeCity} from "../config/cities";

export const zoomGapBoundingBoxLongitudeFactor = .2;

export const zoomGapBoundingBoxLatitudeFactor = .2;

export const zoomGapBoundingBoxLongitudeFactorAll = .05;

export const zoomGapBoundingBoxLatitudeFactorAll = .05;

const proj4326 = 'EPSG:4326';

const proj3857 = 'EPSG:3857';

export type TypeProperties = {
    name?: string;
    fill?: string;
    stroke?: string;
    "stroke-width"?: number;
    "wb_a2"?: string;
    [key: string]: any;
};

export type TypePoint = [number, number];

export type TypePointGeometry = {
    type: "Point";
    coordinates: TypePoint;
};

export type TypeLine = TypePoint[];

export type TypeLineStringGeometry = {
    type: "LineString";
    coordinates: TypeLine;
};

export type TypePolygon = TypePoint[][];

export type TypePolygonGeometry = {
    type: "Polygon";
    coordinates: TypePolygon;
};

export type TypeMultiPolygon = TypePoint[][][];

export type TypeMultiPolygonGeometry = {
    type: "MultiPolygon";
    coordinates: TypeMultiPolygon;
};

export type TypeGeometry = TypePointGeometry|TypePolygonGeometry|TypeLineStringGeometry|TypeMultiPolygonGeometry;

export type TypeFeature = {
    type: "Feature";
    id?: string;
    geometry: TypeGeometry;
    properties: TypeProperties;
};

export type GeoJson = {
    type: "FeatureCollection";
    citiesAdded?: boolean;
    features: TypeFeature[];
};

export type TypeFeatureMap = {
    [key: string]: TypeFeature;
};

export type TypeBoundingBox = {
    longitudeMin: number;
    latitudeMin: number;
    longitudeMax: number;
    latitudeMax: number;
};

export type TypeBoundingType = "country"|"all"|"eu";

export const boundingBoxEuProj4326: TypeBoundingBox = {
    longitudeMin: -31.266001,
    latitudeMin: 34.5428,
    longitudeMax: 39.869301,
    latitudeMax: 71.185474
};

/**
 * Returns whether the given geometry is of type TypePointGeometry.
 *
 * @param geometry
 */
export const isTypePointGeometry = (geometry: TypeGeometry): geometry is TypePointGeometry => {
    return geometry.type === 'Point';
}

/**
 * Returns whether the given geometry is of type TypeLineStringGeometry.
 *
 * @param geometry
 */
export const isTypeLineStringGeometry = (geometry: TypeGeometry): geometry is TypeLineStringGeometry => {
    return geometry.type === 'LineString';
}

/**
 * Returns whether the given geometry is of type TypePolygonGeometry.
 *
 * @param geometry
 */
export const isTypePolygonGeometry = (geometry: TypeGeometry): geometry is TypePolygonGeometry => {
    return geometry.type === 'Polygon';
}

/**
 * Returns whether the given geometry is of type TypeMultiPolygonGeometry.
 *
 * @param geometry
 */
export const isTypeMultiPolygonGeometry = (geometry: TypeGeometry): geometry is TypeMultiPolygonGeometry => {
    return geometry.type === 'MultiPolygon';
}

/**
 * Transform the given GeoJSON data into a feature key object.
 *
 * @param geoJson
 */
export const transformGeoJsonToFeatureMap = (geoJson: GeoJson): TypeFeatureMap => {
    const countryMap: TypeFeatureMap = {};

    geoJson.features.forEach(feature => {
        countryMap[getId(feature)] = feature;
    });

    return countryMap;
}

/**
 * Returns the id from given feature.
 *
 * @param feature
 */
export const getId = (feature: TypeFeature): string => {
    let id: string|null = null;

    if (feature.hasOwnProperty('id')) {
        id = feature.id ?? null;
    }

    if (feature.properties.hasOwnProperty('wb_a2')) {
        id = feature.properties.wb_a2 ?? null;
    }

    if (typeof id !== 'string') {
        throw new Error('Can not find feature.id or feature.properties.wb_a2 to determine the country id.');
    }

    return id;
}

/**
 * Calculates the bounding box from the given feature map.
 *
 * @param featureMap
 */
export const calculateBoundingBoxAll = (featureMap: TypeFeatureMap): TypeBoundingBox => {
    let minLongitude = Infinity,
        minLatitude = Infinity,
        maxLongitude = -Infinity,
        maxLatitude = -Infinity;

    for (const key in featureMap) {
        if (!featureMap.hasOwnProperty(key)) {
            continue;
        }

        const feature = featureMap[key];
        const {
            longitudeMin: minLongitudeTmp,
            latitudeMin: minLatitudeTmp,
            longitudeMax: maxLongitudeTmp,
            latitudeMax: maxLatitudeTmp
        } = calculateBoundingBox(feature);

        if (minLongitudeTmp < minLongitude) {
            minLongitude = minLongitudeTmp;
        }
        if (minLatitudeTmp < minLatitude) {
            minLatitude = minLatitudeTmp;
        }
        if (maxLongitudeTmp > maxLongitude) {
            maxLongitude = maxLongitudeTmp;
        }
        if (maxLatitudeTmp > maxLatitude) {
            maxLatitude = maxLatitudeTmp;
        }
    }

    return {
        longitudeMin: minLongitude,
        latitudeMin: minLatitude,
        longitudeMax: maxLongitude,
        latitudeMax: maxLatitude
    };
}

/**
 * Calculates the bounding box from the given feature.
 *
 * @param feature
 */
export const calculateBoundingBox = (feature: TypeFeature): TypeBoundingBox => {
    const geometry = feature.geometry;

    if (isTypePointGeometry(geometry)) {
        return calculateBoundingBoxFromPoint(geometry.coordinates);
    }

    if (isTypeLineStringGeometry(geometry)) {
        return calculateBoundingBoxLineString(geometry.coordinates);
    }

    if (isTypePolygonGeometry(geometry)) {
        return calculateBoundingBoxFromPolygon(geometry.coordinates);
    }

    if (isTypeMultiPolygonGeometry(geometry)) {
        return calculateBoundingBoxFromMultiPolygon(geometry.coordinates);
    }

    throw new Error('Invalid geometry type');
}

/**
 * Calculates the bounding box for the EU with proj3857 projection.
 */
export const calculateBoundingBoxEu = (): TypeBoundingBox => {
    const pointMin: TypePoint = proj4(proj4326, proj3857, [boundingBoxEuProj4326.longitudeMin, boundingBoxEuProj4326.latitudeMin]);
    const pointMax: TypePoint = proj4(proj4326, proj3857, [boundingBoxEuProj4326.longitudeMax, boundingBoxEuProj4326.latitudeMax]);

    return {
        longitudeMin: pointMin[0],
        latitudeMin: pointMin[1],
        longitudeMax: pointMax[0],
        latitudeMax: pointMax[1]
    };
}
export const calculateBoundingBoxEmpty = (): TypeBoundingBox => {
    return {
        longitudeMin: .0,
        latitudeMin: .0,
        longitudeMax: 1.,
        latitudeMax: 1.
    };
}

/**
 * Calculates the bounding box from the given point.
 *
 * @param point
 */
export const calculateBoundingBoxFromPoint = (point: TypePoint): TypeBoundingBox => {
    let minLongitude = point[0],
        minLatitude = point[1],
        maxLongitude = point[0],
        maxLatitude = point[1];

    return {
        longitudeMin: minLongitude,
        latitudeMin: minLatitude,
        longitudeMax: maxLongitude,
        latitudeMax: maxLatitude
    };
}

/**
 * Calculate the bounding box from the given line.
 *
 * @param line
 */
export const calculateBoundingBoxLineString = (line: TypeLine): TypeBoundingBox => {
    let minLongitude = Infinity,
        minLatitude = Infinity,
        maxLongitude = -Infinity,
        maxLatitude = -Infinity;

    for (const [longitude, latitude] of line) {
        if (longitude < minLongitude) {
            minLongitude = longitude;
        }
        if (latitude < minLatitude) {
            minLatitude = latitude;
        }
        if (longitude > maxLongitude) {
            maxLongitude = longitude;
        }
        if (latitude > maxLatitude) {
            maxLatitude = latitude;
        }
    }

    return {
        longitudeMin: minLongitude,
        latitudeMin: minLatitude,
        longitudeMax: maxLongitude,
        latitudeMax: maxLatitude
    };
}

/**
 * Calculates the bounding box from the given polygon.
 *
 * @param polygon
 */
export const calculateBoundingBoxFromPolygon = (polygon: TypePolygon): TypeBoundingBox => {
    let minLongitude = Infinity,
        minLatitude = Infinity,
        maxLongitude = -Infinity,
        maxLatitude = -Infinity;

    for (const ring of polygon) {
        for (const [lon, lat] of ring) {
            if (lon < minLongitude) minLongitude = lon;
            if (lat < minLatitude) minLatitude = lat;
            if (lon > maxLongitude) maxLongitude = lon;
            if (lat > maxLatitude) maxLatitude = lat;
        }
    }

    return {
        longitudeMin: minLongitude,
        latitudeMin: minLatitude,
        longitudeMax: maxLongitude,
        latitudeMax: maxLatitude
    };
}

/**
 * Calculates the bounding box from the given multipolygon.
 *
 * @param multipolygon
 */
export const calculateBoundingBoxFromMultiPolygon = (multipolygon: TypeMultiPolygon): TypeBoundingBox => {
    let longitudeMin = Infinity,
        latitudeMin = Infinity,
        longitudeMax = -Infinity,
        latitudeMax = -Infinity;

    for (const polygon of multipolygon) {
        for (const ring of polygon) {
            for (const [longitude, latitude] of ring) {
                if (longitude < longitudeMin) longitudeMin = longitude;
                if (latitude < latitudeMin) latitudeMin = latitude;
                if (longitude > longitudeMax) longitudeMax = longitude;
                if (latitude > latitudeMax) latitudeMax = latitude;
            }
        }
    }

    return {
        longitudeMin: longitudeMin,
        latitudeMin: latitudeMin,
        longitudeMax: longitudeMax,
        latitudeMax: latitudeMax
    };
}

/**
 * Calculates the centered and filled with gap bounding box.
 *
 * @param boundingBox
 * @param width
 * @param height
 * @param factorWidth
 * @param factorHeight
 */
export const centerBoundingBox = (
    boundingBox: TypeBoundingBox,
    width: number,
    height: number,
    factorWidth: number,
    factorHeight: number
): TypeBoundingBox => {
    /* Extract the current bounding box. */
    let longitudeMin = boundingBox.longitudeMin;
    let latitudeMin = boundingBox.latitudeMin;
    let longitudeMax = boundingBox.longitudeMax;
    let latitudeMax = boundingBox.latitudeMax;

    /* Calculate the distance of the current bounding box. */
    const longitudeDistance = longitudeMax - longitudeMin;
    const latitudeDistance = latitudeMax - latitudeMin;

    /* Calculate the center point of the current bounding box. */
    const longitudeCenter = (longitudeMin + longitudeMax) / 2;
    const latitudeCenter = (latitudeMin + latitudeMax) / 2;

    /* Calculate the ratio of the width and height to be output and the current element. */
    const aspectRatioOutput = width / height;
    const aspectRatioElement = longitudeDistance / latitudeDistance;

    /* Adjustment of width and height based on the ratio. */
    let longitudeDistanceAdjusted: number = aspectRatioOutput < aspectRatioElement ? longitudeDistance : latitudeDistance * aspectRatioOutput;
    let latitudeDistanceAdjusted: number = aspectRatioOutput < aspectRatioElement ? longitudeDistance / aspectRatioOutput : latitudeDistance;

    const longitudeDistanceLeft = longitudeDistanceAdjusted / 2 * (aspectRatioOutput < aspectRatioElement ? 1 : 1);
    const latitudeDistanceTop = latitudeDistanceAdjusted / 2;

    const longitudeDistanceRight = longitudeDistanceAdjusted - longitudeDistanceAdjusted;
    const latitudeDistanceBottom = latitudeDistanceAdjusted - latitudeDistanceTop;

    const zoomGapBoundingBoxLongitude = factorWidth * longitudeDistance;
    const zoomGapBoundingBoxLatitude = factorHeight * latitudeDistance;

    return {
        longitudeMin: longitudeCenter - longitudeDistanceLeft - zoomGapBoundingBoxLongitude,
        latitudeMin: latitudeCenter - latitudeDistanceTop - zoomGapBoundingBoxLatitude,
        longitudeMax: longitudeCenter + longitudeDistanceRight + zoomGapBoundingBoxLongitude,
        latitudeMax: latitudeCenter + latitudeDistanceBottom + zoomGapBoundingBoxLatitude
    };
}

export const calculateIds = (geoJson: GeoJson): GeoJson => {
    const convertedFeatures = geoJson.features.map(feature => {
        return {
            ...feature,
            id: getId(feature)
        };
    });

    return {
        ...geoJson,
        features: convertedFeatures
    };
}

export const calculateMercator = (geoJson: GeoJson): GeoJson => {
    const convertedFeatures = geoJson.features.map(feature => {
        return {
            ...feature,
            geometry: calculateMercatorFromGeometry(feature.geometry)
        };
    });

    return {
        ...geoJson,
        features: convertedFeatures
    };
}

/**
 * Adds additional config to given country.
 *
 * @param geoJson
 * @param country
 */
export const addConfigToCountry = (geoJson: GeoJson, country: string|null): GeoJson => {
    const convertedFeatures = geoJson.features.map(feature => {
        let properties = {
            ...feature.properties
        };

        /* Adds additional configuration to given country. */
        if (country === feature.id) {
            properties.fill = '#c0e0c0';
            properties.stroke = '#a0a0a0';
            properties["stroke-width"] = .1;
        }

        return {
            ...feature,
            properties
        };
    });

    return {
        ...geoJson,
        features: convertedFeatures
    };
}

export const getFeatureFromCity = (city: TypeCity): TypeFeature => {
    return {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: city.coordinate
        },
        properties: {
            name: city.name,
            fill: "#808080",
            "stroke-width": 0
        },
        id: `Place-${city.name}`
    };
}

/**
 * Adds additional cities.
 *
 * @param geoJson
 */
export const addCities = (geoJson: GeoJson): GeoJson => {
    if (geoJson.citiesAdded) {
        return geoJson;
    }

    cities.forEach((city) => {
        geoJson.features.push(getFeatureFromCity(city));
    });

    geoJson.citiesAdded = true;

    return geoJson;
}

/**
 * Prepares the given geo json data.
 *
 * @param geoJson
 * @param country
 */
export const prepareGeoJsonData = (geoJson: GeoJson, country: string|null): GeoJson => {
    return addConfigToCountry(
        calculateIds(
            calculateMercator(
                addCities(geoJson)
            )
        ),
        country
    );
}

/**
 * Calculates the mercator projection from given geometry data.
 *
 * @param geometry
 */
export const calculateMercatorFromGeometry = (geometry: TypeGeometry): TypeGeometry =>
{
    if (isTypePointGeometry(geometry)) {
        return calculateMercatorFromPoint(geometry);
    }

    if (isTypeLineStringGeometry(geometry)) {
        return calculateMercatorFromLineString(geometry);
    }

    if (isTypePolygonGeometry(geometry)) {
        return calculateMercatorFromPolygon(geometry);
    }

    if (isTypeMultiPolygonGeometry(geometry)) {
        return calculateMercatorFromMultiPolygon(geometry);
    }

    throw new Error('Invalid geometry type');
}

export const calculateMercatorFromPoint = (geometry: TypePointGeometry): TypePointGeometry  =>
{
    return {
        type: 'Point',
        coordinates: convertCoordinates(geometry.coordinates)
    };
}

export const calculateMercatorFromLineString = (geometry: TypeLineStringGeometry): TypeLineStringGeometry  =>
{
    return {
        type: 'LineString',
        coordinates: geometry.coordinates.map(convertCoordinates)
    };
}

export const calculateMercatorFromPolygon = (geometry: TypePolygonGeometry): TypePolygonGeometry  =>
{
    return {
        type: 'Polygon',
        coordinates: geometry.coordinates.map(ring => ring.map(convertCoordinates))
    };
}

export const calculateMercatorFromMultiPolygon = (geometry: TypeMultiPolygonGeometry): TypeMultiPolygonGeometry  =>
{
    return {
        type: 'MultiPolygon',
        coordinates: geometry.coordinates.map(polygon => polygon.map(ring => ring.map(convertCoordinates)))
    };
}

export const getPointSizeByBoundingBox = (boundingBox: TypeBoundingBox, boundingType: TypeBoundingType): number => {

    if (boundingType === 'all') {
        return .2;
    }

    if (boundingType === 'eu') {
        return .2;
    }

    return .8;
}

export const getBoundingType = (countryGiven: string|null, countryKey: string|null, zoomCountry: boolean): TypeBoundingType => {
    if (!zoomCountry || countryGiven === 'all') {
        return 'all';
    }

    if (countryGiven === 'eu' || countryKey === null) {
        return 'eu';
    }

    return 'country';
}

const convertCoordinates = (coords: TypePoint): TypePoint => {
    return proj4(proj4326, proj3857, coords);
};
