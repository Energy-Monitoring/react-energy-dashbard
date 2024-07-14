import React, { useEffect, useState } from 'react';
import SVGRenderer from "./SVGRenderer";
import { TypeCountry } from "../libs/WordlMapSvg/config/countries";
import { WorldMapSvg } from "../libs/WordlMapSvg/WorldMapSvg";
import {TypeDataSource} from "../libs/WordlMapSvg/types/types";
import {zoomCountry} from "../config/chartConfig";

interface WorldMapProps {
    country: string|null;
    width: number;
    height: number;
}

/**
 * WorldMap component.
 *
 * @author Björn Hempel <bjoern@hempel.li>
 * @version 0.1.0 (2024-07-14)
 * @since 0.1.0 (2024-07-14) First version.
 */
const WorldMap: React.FC<WorldMapProps> = ({
    country, width, height
}) => {
    const [dataSource, setDataSource] = useState<TypeDataSource>('low');
    const [svgContent, setSvgContent] = useState<string[]>([]);
    const [translation, setTranslation] = useState<TypeCountry | null>(null);

    const worldMapSvg = new WorldMapSvg({
        country, width, height, zoomCountry
    });

    useEffect(() => {
        worldMapSvg.setDataSource(dataSource);
        worldMapSvg.setCountry(country);
        setSvgContent(worldMapSvg.renderSvgPaths());
        setTranslation(worldMapSvg.getTranslation());
    }, [dataSource, country]);

    return (
        <>
            <h2 className="title-2">Weltkarte</h2>
            <p>Ausgewähltes Land oder Bereich.</p>
            <div className="svg">
                <div className="svg-title">
                    {translation ? `Karte von "${translation.name}"` : 'Weltkarte'}
                </div>
                <div className="copyright">
                    WorldMapSvg build by <a href="https://www.hempel.li/" target="_blank"
                                            rel="noopener noreferrer">bjoern hempel</a>
                </div>
                <SVGRenderer svgContent={svgContent} width={width} height={height}/>
            </div>
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
        </>
    );
};

export default WorldMap;
