import { useEffect } from 'react';
import type { StyleOptions } from '../types';

export interface TextBoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Function to wrap text on a canvas
const wrapText = (
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    lineHeight: number
): { lines: string[], totalHeight: number, lineWidths: number[] } => {
    if (!text) {
        return { lines: [], totalHeight: 0, lineWidths: [] };
    }
    const words = text.split(' ');
    let line = '';
    const lines: string[] = [];
    const lineWidths: number[] = [];

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            const trimmedLine = line.trim();
            lines.push(trimmedLine);
            lineWidths.push(context.measureText(trimmedLine).width);
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }
    const lastLine = line.trim();
    lines.push(lastLine);
    lineWidths.push(context.measureText(lastLine).width);

    return {
        lines,
        totalHeight: lines.length * lineHeight,
        lineWidths,
    };
};

export const useCanvasRenderer = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    image: HTMLImageElement | null,
    styles: StyleOptions,
    onBoundingBoxChange: (box: TextBoundingBox | null) => void
) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        
        if (!canvas || !context) return;
        
        if (!image) {
            onBoundingBoxChange(null);
            // Clear canvas if no image
            context.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        // Set canvas dimensions to match image
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background image
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // --- Caption styling ---
        const {
            caption,
            fontFamily,
            fontSize,
            bold,
            italic,
            fontColor,
            textAlign,
            textPosX,
            textPosY,
            lineHeight,
            padding,
            maxWidth,
            textShadow,
            shadowColor,
            shadowBlur,
            addWatermark,
            watermarkText,
        } = styles;

        if (!caption.trim()) {
            onBoundingBoxChange(null);
            return;
        }

        const fontStyle = `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}${fontSize}px ${fontFamily}`;
        context.font = fontStyle;
        context.fillStyle = fontColor;
        context.textAlign = textAlign;
        context.textBaseline = 'top';

        if (textShadow) {
            context.shadowColor = shadowColor;
            context.shadowBlur = shadowBlur;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
        } else {
            context.shadowColor = 'transparent';
            context.shadowBlur = 0;
        }

        const actualMaxWidth = Math.min(maxWidth, canvas.width - padding * 2);
        const actualLineHeight = fontSize * lineHeight;
        const wrappedText = wrapText(context, caption, actualMaxWidth, actualLineHeight);

        let x: number;
        if (textPosX !== null) {
            x = textPosX;
        } else {
            if (textAlign === 'left') {
                x = padding;
            } else if (textAlign === 'right') {
                x = canvas.width - padding;
            } else { // center
                x = canvas.width / 2;
            }
        }
        
        let y: number;
        if (textPosY !== null) {
            y = textPosY;
        } else {
            // Center vertically by default
            y = (canvas.height - wrappedText.totalHeight) / 2;
        }
        
        // Draw each line
        wrappedText.lines.forEach((line, index) => {
            context.fillText(line, x, y + index * actualLineHeight);
        });

        // Calculate bounding box
        const maxLineWidth = Math.max(0, ...wrappedText.lineWidths);
        let boxX: number;
        if (textAlign === 'left') {
             boxX = x;
        } else if (textAlign === 'right') {
            boxX = x - maxLineWidth;
        } else { // center
            boxX = x - maxLineWidth / 2;
        }

        const boundingBox: TextBoundingBox = {
            x: boxX,
            y: y,
            width: maxLineWidth,
            height: wrappedText.totalHeight,
        };
        onBoundingBoxChange(boundingBox);


        // --- Watermark ---
        if (addWatermark && watermarkText) {
            // Reset shadow for watermark
            context.shadowColor = 'transparent';
            context.shadowBlur = 0;
            context.font = `16px ${fontFamily}`;
            context.fillStyle = 'rgba(255, 255, 255, 0.7)';
            context.textAlign = 'right';
            context.textBaseline = 'bottom';
            context.fillText(watermarkText, canvas.width - 15, canvas.height - 15);
        }

    }, [image, styles, canvasRef, onBoundingBoxChange]);
};
