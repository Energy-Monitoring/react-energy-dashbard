import React, { useEffect, useState, useRef } from 'react';
import { TypeSvgContent } from "../libs/WordlMapSvg/classes/GeoJson2Path";

interface SVGRendererProps {
    svgContent: TypeSvgContent;
    width: number;
    height: number;
    country: string | null;
}
interface SVGViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * SVGRenderer component.
 */
const SVGRenderer: React.FC<SVGRendererProps> = ({ svgContent, width, height, country }) => {
    const [isPanning, setIsPanning] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [viewBox, setViewBox] = useState<SVGViewBox>({
        x: svgContent.viewBoxLeft,
        y: svgContent.viewBoxTop,
        width: svgContent.viewBoxWidth,
        height: svgContent.viewBoxHeight
    });
    const svgRef = useRef<SVGSVGElement>(null!);
    const initialDistanceRef = useRef<number | null>(null);
    const initialViewBoxRef= useRef<SVGViewBox | null>(null);

    const handleStart = (event: React.MouseEvent<SVGSVGElement, MouseEvent> | React.TouchEvent<SVGSVGElement> | SVGSVGElementEventMap["mousedown"] | SVGSVGElementEventMap["touchstart"]) => {
        setDebugType('handleStart');

        event.preventDefault();

        setIsPanning(true);
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        setStartPoint({ x: clientX, y: clientY });

        if ('touches' in event && event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            initialDistanceRef.current = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            initialViewBoxRef.current = viewBox;
        }
    };

    const handleMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent> | React.TouchEvent<SVGSVGElement> | SVGSVGElementEventMap["mousemove"] | SVGSVGElementEventMap["touchmove"]) => {
        if (!isPanning || !svgRef.current) {
            return;
        }

        event.preventDefault();

        setDebugType('handleMove');

        const svgRect = svgRef.current.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

        if (
            'touches' in event &&
            event.touches.length === 2 &&
            initialDistanceRef.current &&
            initialViewBoxRef.current
        ) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            const newDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

            const scale = newDistance / initialDistanceRef.current;

            const centerX = (touch1.clientX + touch2.clientX) / 2 - svgRect.left;
            const centerY = (touch1.clientY + touch2.clientY) / 2 - svgRect.top;

            const newWidth = initialViewBoxRef.current?.width / scale;
            const newHeight = initialViewBoxRef.current?.height / scale;

            const dx = (centerX / svgRect.width) * (initialViewBoxRef.current?.width - newWidth);
            const dy = (centerY / svgRect.height) * (initialViewBoxRef.current?.height - newHeight);

            setDebugType('handleMove touch');

            setViewBoxDebug({
                x: initialViewBoxRef.current?.x + dx,
                y: initialViewBoxRef.current?.y + dy,
                width: newWidth,
                height: newHeight
            }, scale);

            return;
        }

        setDebugType('handleMove move');

        const dx = (startPoint.x - clientX) * (viewBox.width / svgRect.width);
        const dy = (startPoint.y - clientY) * (viewBox.height / svgRect.height);

        setViewBoxDebug({
            width: viewBox.width,
            height: viewBox.height,
            x: viewBox.x + dx,
            y: viewBox.y + dy
        });
        setStartPoint({ x: clientX, y: clientY });
    };

    const handleEnd = () => {
        setIsPanning(false);
        initialDistanceRef.current = null;

        setDebugType('handleEnd');
    };

    const handleWheel = (event: React.WheelEvent<SVGSVGElement> | WheelEvent) => {
        if (!svgRef.current) return;

        setDebugType('handleWheel');

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

        setViewBoxDebug({
            x: viewBox.x + dx,
            y: viewBox.y + dy,
            width: newWidth,
            height: newHeight
        });
    };

    const setDebugType = (type: string) => {
        const element = document.getElementById('debug-map-type');

        if (!element) {
            return;
        }

        element.innerHTML = type;
    }

    const setDebugContent = (content: string) => {
        const element = document.getElementById('debug-map-content');

        if (!element) {
            return;
        }

        element.innerHTML = content;
    }

    const setViewBoxDebug = (viewBox: SVGViewBox, scale: number|null = null) => {
        setViewBox(viewBox);

        let debugContent = 'x=' + viewBox.x + '<br>y=' + viewBox.y + '<br>width=' + viewBox.width + '<br>height=' + viewBox.height;

        if (scale !== null) {
            debugContent += '<br>scale = ' + scale;
        }

        setDebugContent(debugContent);
    };

    useEffect(() => {
        const svgElement = svgRef.current;

        if (svgElement) {
            svgElement.addEventListener('mouseleave', handleEnd, { passive: false });
            svgElement.addEventListener('wheel', handleWheel, { passive: false });
            svgElement.addEventListener('mousedown', handleStart, { passive: false });
            svgElement.addEventListener('mousemove', handleMove, { passive: false });
            svgElement.addEventListener('mouseup', handleEnd, { passive: false });
            svgElement.addEventListener('touchstart', handleStart, { passive: false });
            svgElement.addEventListener('touchmove', handleMove, { passive: false });
            svgElement.addEventListener('touchend', handleEnd, { passive: false });
        }

        return () => {
            if (svgElement) {
                svgElement.removeEventListener('mouseleave', handleEnd);
                svgElement.removeEventListener('wheel', handleWheel);
                svgElement.removeEventListener('mousedown', handleStart);
                svgElement.removeEventListener('mousemove', handleMove);
                svgElement.removeEventListener('mouseup', handleEnd);
                svgElement.removeEventListener('touchstart', handleStart);
                svgElement.removeEventListener('touchmove', handleMove);
                svgElement.removeEventListener('touchend', handleEnd);
            }
        };
    }, []);

    useEffect(() => {
        setDebugType('Initial render');
        setViewBoxDebug({
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
