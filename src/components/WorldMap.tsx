import React, { useEffect, useState } from 'react';
import SVGRenderer from "./SVGRenderer";
import { WorldMapSvg, TypeDataSource } from "../helper/wordMapHelper";
import { TypeCountry } from "../config/countries";

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
    const [dataSource, setDataSource] = useState<TypeDataSource>('low');
    const [svgContent, setSvgContent] = useState<string[]>([]);
    const [translation, setTranslation] = useState<TypeCountry | null>(null);

    const worldMapSvg = new WorldMapSvg(country);

    useEffect(() => {
        worldMapSvg.setDataSource(dataSource);
        worldMapSvg.setCountry(country);
        setSvgContent(worldMapSvg.renderSvgPaths());
        setTranslation(worldMapSvg.getTranslation());
    }, [dataSource, country]);

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
                <div className="copyright">
                    WorldMapSvg build by <a href="https://www.hempel.li/" target="_blank"
                                    rel="noopener noreferrer">bjoern hempel</a>
                </div>
                <SVGRenderer svgContent={svgContent}/>
            </div>
        </>
    );
};

export default WorldMap;
