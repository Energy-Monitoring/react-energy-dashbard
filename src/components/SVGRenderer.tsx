import React from 'react';

interface SVGRendererProps {
    svgContent: string[];
    width: number;
    height: number;
}

/**
 * SVGRenderer component.
 */
const SVGRenderer: React.FC<SVGRendererProps> = ({ svgContent, width, height }) => {
    /* Join the array into a single string */
    const svgContentCombined = svgContent.join('');
    const viewBoxValue = `0 0 ${width} ${height}`;

    return (
        <svg
            viewBox={viewBoxValue}
            dangerouslySetInnerHTML={{ __html: svgContentCombined }}
            xmlns="http://www.w3.org/2000/svg"
        />
    );
};

export default SVGRenderer;