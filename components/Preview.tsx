import React, { useRef, useState, useCallback } from 'react';
import type { StyleOptions } from '../types';
import { useCanvasRenderer, TextBoundingBox } from '../hooks/useCanvasRenderer';

interface PreviewProps {
    imgSrc: string | null;
    imgEl: HTMLImageElement | null;
    styles: StyleOptions;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    setStyles: React.Dispatch<React.SetStateAction<StyleOptions>>;
}

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-4">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);


export const Preview: React.FC<PreviewProps> = ({ imgSrc, imgEl, styles, canvasRef, setStyles }) => {
    const [textBoundingBox, setTextBoundingBox] = useState<TextBoundingBox | null>(null);
    const onBoundingBoxChange = useCallback((box: TextBoundingBox | null) => {
      setTextBoundingBox(box);
    }, []);
    
    useCanvasRenderer(canvasRef, imgEl, styles, onBoundingBoxChange);
    
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const getMousePos = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!textBoundingBox) return;
        const pos = getMousePos(e);

        if (pos.x >= textBoundingBox.x && pos.x <= textBoundingBox.x + textBoundingBox.width &&
            pos.y >= textBoundingBox.y && pos.y <= textBoundingBox.y + textBoundingBox.height) 
        {
            setIsDragging(true);
            const anchorX = styles.textPosX ?? (styles.textAlign === 'left' ? styles.padding : styles.textAlign === 'right' ? (canvasRef.current?.width ?? 0) - styles.padding : (canvasRef.current?.width ?? 0) / 2);
            const anchorY = styles.textPosY ?? ((canvasRef.current?.height ?? 0) - textBoundingBox.height) / 2;
            
            dragOffset.current = {
                x: pos.x - anchorX,
                y: pos.y - anchorY,
            };
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const pos = getMousePos(e);
        let isOverText = false;
        if (textBoundingBox) {
            isOverText = pos.x >= textBoundingBox.x && pos.x <= textBoundingBox.x + textBoundingBox.width &&
                         pos.y >= textBoundingBox.y && pos.y <= textBoundingBox.y + textBoundingBox.height;
        }

        if (isDragging) {
            const newAnchorX = pos.x - dragOffset.current.x;
            const newAnchorY = pos.y - dragOffset.current.y;

            setStyles(prev => ({
                ...prev,
                textPosX: newAnchorX,
                textPosY: newAnchorY,
            }));
        } else {
             canvas.style.cursor = isOverText ? 'move' : 'default';
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <section className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="mb-3 text-sm font-semibold text-slate-600">Xem trước (canvas xuất ảnh):</div>
                {!imgSrc ? (
                    <div className="aspect-video w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg text-slate-500 p-6 text-center">
                        <ImageIcon />
                        <span className="font-semibold">Chưa có ảnh</span>
                        <span className="text-sm">Bấm "Chọn ảnh" để tải lên.</span>
                    </div>
                ) : (
                    <div className="overflow-auto bg-slate-100 rounded-lg p-4 flex justify-center items-center">
                        <canvas 
                            ref={canvasRef} 
                            className="max-w-full h-auto rounded-md shadow-md"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                         />
                    </div>
                )}
            </div>
            {imgSrc && (
                <div className="mt-4 text-sm text-slate-500 bg-slate-100 rounded-lg p-3">
                    <p>
                        <b>Mẹo:</b> Nhấn và kéo thả dòng chữ để di chuyển đến vị trí bạn muốn.
                    </p>
                    <p>
                        Mọi thay đổi trong bảng điều khiển sẽ tự động cập nhật bản xem trước.
                    </p>
                </div>
            )}
        </section>
    );
};