import React from 'react';

interface SVGRendererProps {
    svgContent: string[];
}

const SVGRenderer: React.FC<SVGRendererProps> = ({ svgContent }) => {
    /* Join the array into a single string */
    const svgContentCombined = svgContent.join('');

    return (
        <svg
            viewBox="0 0 200 100"
            dangerouslySetInnerHTML={{ __html: svgContentCombined }}
            xmlns="http://www.w3.org/2000/svg"
        />
    );
};

export default SVGRenderer;