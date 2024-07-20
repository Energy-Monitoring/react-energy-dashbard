import React, { useEffect, useState, useRef } from 'react';
import { TypeSvgContent } from "../libs/WordlMapSvg/classes/GeoJson2Path";

interface SVGRendererProps {
    svgContent: TypeSvgContent;
    width: number;
    height: number;
}

/**
 * SVGRenderer component.
 */
const SVGRenderer: React.FC<SVGRendererProps> = ({ svgContent }) => {
    const [isPanning, setIsPanning] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [viewBox, setViewBox] = useState({
        x: svgContent.viewBoxLeft,
        y: svgContent.viewBoxTop,
        width: svgContent.viewBoxWidth,
        height: svgContent.viewBoxHeight
    });
    const svgRef = useRef<SVGSVGElement>(null);

    const handleMouseDown = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        setIsPanning(true);
        setStartPoint({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (!isPanning || !svgRef.current) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const dx = (startPoint.x - event.clientX) * (viewBox.width / svgRect.width);
        const dy = (startPoint.y - event.clientY) * (viewBox.height / svgRect.height);

        setViewBox(prevViewBox => ({
            ...prevViewBox,
            x: prevViewBox.x + dx,
            y: prevViewBox.y + dy
        }));
        setStartPoint({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;

        event.preventDefault();
        const { clientX, clientY, deltaY } = event;
        const svgRect = svgRef.current.getBoundingClientRect();
        const zoomFactor = 1.1;
        const direction = deltaY > 0 ? 1 : -1;
        const scale = direction > 0 ? zoomFactor : 1 / zoomFactor;

        const mouseX = clientX - svgRect.left;
        const mouseY = clientY - svgRect.top;
        const newWidth = viewBox.width * scale;
        const newHeight = viewBox.height * scale;
        const dx = (mouseX / svgRect.width) * (newWidth - viewBox.width);
        const dy = (mouseY / svgRect.height) * (newHeight - viewBox.height);

        setViewBox(prevViewBox => ({
            x: prevViewBox.x + dx,
            y: prevViewBox.y + dy,
            width: newWidth,
            height: newHeight
        }));
    };

    useEffect(() => {
        const svgElement = svgRef.current;

        if (svgElement) {
            svgElement.addEventListener('mouseleave', handleMouseUp);
        }

        return () => {
            if (svgElement) {
                svgElement.removeEventListener('mouseleave', handleMouseUp);
            }
        };
    }, []);

    useEffect(() => {
        setViewBox({
            x: svgContent.viewBoxLeft,
            y: svgContent.viewBoxTop,
            width: svgContent.viewBoxWidth,
            height: svgContent.viewBoxHeight
        });
    }, [svgContent]);

    return (
        <>
            <svg
                ref={svgRef}
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                dangerouslySetInnerHTML={{ __html: svgContent.svgPaths + svgContent.svgCircles }}
                xmlns="http://www.w3.org/2000/svg"
                id="svg-map"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
                style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
            />
        </>
    );
};

export default SVGRenderer;
