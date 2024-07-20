import {countryMap, TypeCountry} from "./config/countries";
import {GeoJSON2SVG} from "geojson2svg";
import {
    InterfaceGeoJson, TypeCountryKey, TypeDataSource, TypeFeature,
    TypeFeatureMap,
} from "./types/types";
import {BoundingBox} from "./classes/BoundingBox";
import {DataConverter} from "./classes/DataConverter";
import {GeoJson2Path} from "./classes/GeoJson2Path";

interface WorldMapSvgOptions {
    country?: string | null;
    width?: number;
    height?: number;
    dataSource?: TypeDataSource;
    zoomCountry?: boolean;
}

/**
 * Class WorldMapSvg.
 *
 * @author Björn Hempel <bjoern@hempel.li>
 * @version 0.1.0 (2024-07-14)
 * @since 0.1.0 (2024-07-14) First version.
 */
export class WorldMapSvg {

    private country: TypeCountryKey;

    private countryKey: TypeCountryKey;

    private readonly width: number;

    private readonly height: number;

    private readonly zoomCountry: boolean;

    private dataSource: TypeDataSource = 'low';

    private data: InterfaceGeoJson;

    private dataIdMap: TypeFeatureMap;

    private dataConverter: DataConverter = new DataConverter();

    private boundingBox: BoundingBox = new BoundingBox();

    private geoJson2Path: GeoJson2Path = new GeoJson2Path();

    private readonly propertyCountryDefault: TypeCountryKey = null;

    private readonly propertyWidthDefault: number = 200;

    private readonly propertyHeightDefault: number = 110;

    private readonly propertyDataSourceDefault: TypeDataSource = 'low';

    private readonly propertyZoomCountryDefault: boolean = true;

    private readonly propertyTitleNotSpecified: string = 'Not specified';

    private readonly propertiesCountryFill: string = '#d0d0d0';

    private readonly propertiesCountryStroke: string = '#a0a0a0';

    private readonly propertiesCountryStrokeWidth: number = .1;

    private readonly zoomGapBoundingBoxLongitudeFactor = .2;

    private readonly zoomGapBoundingBoxLatitudeFactor = .2;

    private readonly zoomGapBoundingBoxLongitudeFactorAll = .05;

    private readonly zoomGapBoundingBoxLatitudeFactorAll = .05;

    /**
     * The constructor of WorldMapSvg.
     *
     * @param options
     */
    constructor(options: WorldMapSvgOptions = {}) {
        /* Initialize the given options. */
        this.country = options.country ?? this.propertyCountryDefault;
        this.width = options.width ?? this.propertyWidthDefault;
        this.height = options.height ?? this.propertyHeightDefault;
        this.dataSource = options.dataSource ?? this.propertyDataSourceDefault;
        this.zoomCountry = options.zoomCountry ?? this.propertyZoomCountryDefault;

        /* Calculates the needed properties from given properties. */
        this.countryKey = this.getCountryKey(this.country);
        this.data = this.dataConverter.getPreparedData(this.dataSource, this.countryKey);
        this.dataIdMap = this.transformGeoJsonToFeatureMap(this.data);
        this.fixCountryKeyToAvailableData();
    }

    /**
     * Sets the country.
     *
     * @param country
     */
    public setCountry(country: TypeCountryKey): void {
        this.country = country;
        this.countryKey = this.getCountryKey(this.country);
        this.fixCountryKeyToAvailableData();
    }

    /**
     * Sets the data source.
     *
     * @param dataSource
     */
    public setDataSource(dataSource: TypeDataSource): void {
        this.dataSource = dataSource;
        this.data = this.dataConverter.getPreparedData(this.dataSource, this.countryKey);
        this.dataIdMap = this.transformGeoJsonToFeatureMap(this.data);
        this.fixCountryKeyToAvailableData();
    }

    /**
     * Transform the given GeoJSON data into a feature key object.
     *
     * @param geoJson
     */
    private transformGeoJsonToFeatureMap(geoJson: InterfaceGeoJson): TypeFeatureMap {
        const countryMap: TypeFeatureMap = {};

        geoJson.features.forEach(feature => {
            countryMap[this.dataConverter.getIsoCode(feature)] = feature;
        });

        return countryMap;
    }

    /**
     * Returns the country key from given country code.
     *
     * @param country
     * @private
     */
    private getCountryKey(country: TypeCountryKey): TypeCountryKey {
        return country !== null ? country.toUpperCase() : null
    }

    /**
     * Sets the country key to null if there is no country as given.
     *
     * @private
     */
    private fixCountryKeyToAvailableData(): void {
        if (this.countryKey !== null && !this.dataIdMap.hasOwnProperty(this.countryKey)) {
            this.countryKey = null;
        }
    }

    /**
     * Adds title tags to all svg elements.
     *
     * @param svgElements
     * @param features
     * @private
     */
    private addTitlesToSvgElements(svgElements: string[], features: TypeFeature[]): string[] {
        return svgElements.map((svgElement, index) => {
            const feature = features[index];
            const title = feature.name || feature.id || this.propertyTitleNotSpecified;
            const titleElement = `<title>${title}</title>`;
            svgElement = svgElement.replace(/\/>/, `>${titleElement}</path>`);
            return svgElement;
        });
    };

    /**
     * Renders the svg paths.
     */
    public renderSvgPaths(): string[] {
        let boundingType = this.boundingBox.getBoundingType(this.country, this.countryKey, this.zoomCountry);

        /* Calculates the bounding box without gap or centering ("raw" bounding box). */
        let boundingBox = this.boundingBox.calculateBoundingBox(
            this.dataIdMap,
            boundingType,
            this.countryKey
        );

        const factorGapLongitude = boundingType === 'country' ? this.zoomGapBoundingBoxLongitudeFactor : this.zoomGapBoundingBoxLongitudeFactorAll;
        const factorGapLatitude = boundingType === 'country' ? this.zoomGapBoundingBoxLatitudeFactor : this.zoomGapBoundingBoxLatitudeFactorAll;

        /* Centers the bounding box to output svg and add a gap. */
        boundingBox = this.boundingBox.centerBoundingBox(
            boundingBox,
            this.width,
            this.height,
            factorGapLongitude,
            factorGapLatitude
        );

        const converter: GeoJSON2SVG = new GeoJSON2SVG({
            mapExtent: { left: boundingBox.longitudeMin, bottom: boundingBox.latitudeMin, right: boundingBox.longitudeMax, top: boundingBox.latitudeMax },
            viewportSize: { width: this.width, height: this.height },
            attributes: [
                /* Default colors and properties. */
                {property: 'fill', type: 'static', value: this.propertiesCountryFill},
                {property: 'stroke', type: 'static', value: this.propertiesCountryStroke},
                {property: 'stroke-width', type: 'static', value: this.propertiesCountryStrokeWidth.toString()},

                /* Use colors and properties if given within geoJson data. */
                {property: 'properties.fill', type: 'dynamic'},
                {property: 'properties.stroke', type: 'dynamic'},
                {property: 'properties.stroke-width', type: 'dynamic'},
                {property: 'properties.class', type: 'dynamic'}
            ],
            r: this.boundingBox.getPointSizeByBoundingBox(boundingBox, boundingType)
        });

        return this.addTitlesToSvgElements(converter.convert(this.data), this.data.features);
    }

    public renderSvgString(country: string|null): string {
        let boundingType = this.boundingBox.getBoundingType(this.country, this.countryKey, this.zoomCountry);

        /* Calculates the bounding box without gap or centering ("raw" bounding box). */
        let boundingBox = this.boundingBox.calculateBoundingBox(
            this.dataIdMap,
            boundingType,
            this.countryKey
        );

        const factorGapLongitude = boundingType === 'country' ? this.zoomGapBoundingBoxLongitudeFactor : this.zoomGapBoundingBoxLongitudeFactorAll;
        const factorGapLatitude = boundingType === 'country' ? this.zoomGapBoundingBoxLatitudeFactor : this.zoomGapBoundingBoxLatitudeFactorAll;

        /* Centers the bounding box to output svg and add a gap. */
        boundingBox = this.boundingBox.centerBoundingBox(
            boundingBox,
            this.width,
            this.height,
            factorGapLongitude,
            factorGapLatitude
        );

        return this.geoJson2Path.generateSVG(this.data, boundingBox, country, this.width, this.height);
    }

    /**
     * Returns the translation from countryMap.
     *
     * @see countryMap
     */
    public getTranslation(): TypeCountry|null {
        if (this.country !== null  && this.country === 'eu' && countryMap.hasOwnProperty(this.country.toLowerCase())) {
            return countryMap[this.country.toLowerCase()];
        }

        if (this.countryKey === null) {
            return null;
        }

        if (!countryMap.hasOwnProperty(this.countryKey.toLowerCase())) {
            return null;
        }

        return countryMap[this.countryKey.toLowerCase()];
    }
}
