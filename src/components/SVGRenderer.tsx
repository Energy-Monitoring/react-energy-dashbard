import React, { useEffect, useState, useRef } from 'react';
import { TypeSvgContent } from "../libs/WordlMapSvg/classes/GeoJson2Path";

interface SVGRendererProps {
    svgContent: TypeSvgContent;
    width: number;
    height: number;
    country: string | null;
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
    const initialDistanceRef = useRef<number | null>(null);

    const handleStart = (event: React.MouseEvent<SVGSVGElement, MouseEvent> | React.TouchEvent<SVGSVGElement>) => {
        setIsPanning(true);
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        setStartPoint({ x: clientX, y: clientY });

        if ('touches' in event && event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            initialDistanceRef.current = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        }
    };

    const handleMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent> | React.TouchEvent<SVGSVGElement>) => {
        if (!isPanning || !svgRef.current) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

        if ('touches' in event && event.touches.length === 2 && initialDistanceRef.current) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const newDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            const scale = newDistance / initialDistanceRef.current;

            const centerX = (touch1.clientX + touch2.clientX) / 2 - svgRect.left;
            const centerY = (touch1.clientY + touch2.clientY) / 2 - svgRect.top;

            const newWidth = viewBox.width / scale;
            const newHeight = viewBox.height / scale;

            const dx = (centerX / svgRect.width) * (viewBox.width - newWidth);
            const dy = (centerY / svgRect.height) * (viewBox.height - newHeight);

            setViewBox({
                x: viewBox.x + dx,
                y: viewBox.y + dy,
                width: newWidth,
                height: newHeight
            });

            initialDistanceRef.current = newDistance; // Update the initial distance for the next move
        } else {
            const dx = (startPoint.x - clientX) * (viewBox.width / svgRect.width);
            const dy = (startPoint.y - clientY) * (viewBox.height / svgRect.height);

            setViewBox({
                width: viewBox.width,
                height: viewBox.height,
                x: viewBox.x + dx,
                y: viewBox.y + dy
            });
            setStartPoint({ x: clientX, y: clientY });
        }
    };

    const handleEnd = () => {
        setIsPanning(false);
        initialDistanceRef.current = null;
    };

    const handleWheel = (event: React.WheelEvent<SVGSVGElement> | WheelEvent) => {
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
            svgElement.addEventListener('mouseleave', handleEnd);
            svgElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (svgElement) {
                svgElement.removeEventListener('mouseleave', handleEnd);
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
        <svg
            ref={svgRef}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            dangerouslySetInnerHTML={{ __html: svgContent.svgPaths + svgContent.svgCircles }}
            xmlns="http://www.w3.org/2000/svg"
            id="svg-map"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            onWheel={handleWheel}
            style={{ cursor: isPanning ? 'move' : 'default' }}
        />
    );
};

export default SVGRenderer;
