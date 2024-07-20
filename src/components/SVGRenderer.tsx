import React, { useEffect, useState, useRef } from 'react';
import { TypeSvgContent } from "../libs/WordlMapSvg/classes/GeoJson2Path";

interface SVGRendererProps {
    svgContent: TypeSvgContent;
    width: number;
    height: number;
    country: string|null;
}

/**
 * SVGRenderer component.
 */
const SVGRenderer: React.FC<SVGRendererProps> = ({ svgContent, width, height, country }) => {
    const [isPanning, setIsPanning] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [viewBox, setViewBox] = useState({
        x: svgContent.viewBoxLeft,
        y: svgContent.viewBoxTop,
        width: svgContent.viewBoxWidth,
        height: svgContent.viewBoxHeight
    });
    const svgRef = useRef<SVGSVGElement>(null!);

    /**
     * Handles the mouse down event (Start drag and drop).
     *
     * @param event
     */
    const handleMouseDown = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        setIsPanning(true);
        setStartPoint({ x: event.clientX, y: event.clientY });
    };

    /**
     * Handles the mouse move event (Do drag and drop).
     *
     * @param event
     */
    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (!isPanning || !svgRef.current) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const dx = (startPoint.x - event.clientX) * (viewBox.width / svgRect.width);
        const dy = (startPoint.y - event.clientY) * (viewBox.height / svgRect.height);

        setViewBox({
            width: viewBox.width,
            height: viewBox.height,
            x: viewBox.x + dx,
            y: viewBox.y + dy
        });
        setStartPoint({ x: event.clientX, y: event.clientY });
    };

    /**
     * Handles the mouse up event (Finish drag and drop).
     */
    const handleMouseUp = () => {
        setIsPanning(false);
    };

    /**
     * Handles the mouse wheel event (Zoom in/out).
     *
     * @param event
     */
    const handleWheel = (event: React.WheelEvent<SVGSVGElement>|WheelEvent) => {
        if (!svgRef.current) {
            return;
        }

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

        const dx = (mouseX / svgRect.width) * (viewBox.width - newWidth);
        const dy = (mouseY / svgRect.height) * (viewBox.height - newHeight);

        setViewBox({
            x: viewBox.x + dx,
            y: viewBox.y + dy,
            width: newWidth,
            height: newHeight
        });
    };

    useEffect(() => {
        const svgElement = svgRef.current;

        if (svgElement) {
            svgElement.addEventListener('mouseleave', handleMouseUp);
            svgElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (svgElement) {
                svgElement.removeEventListener('mouseleave', handleMouseUp);
                svgElement.removeEventListener('wheel', handleWheel);
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
    }, [country, svgContent]);

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
                style={{ cursor: isPanning ? 'move' : 'default' }}
            />
        </>
    );
};

export default SVGRenderer;
