// src/pages/Presentation/components/DraggableElement.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function DraggableElement({
    children,
    initialPosition,
    initialWidth,
    onDragEnd,
    onResizeEnd,
    onDelete,
    onDoubleClick,
    zIndex
}) {
    const [pos, setPos] = useState({ x: initialPosition?.x || 0, y: initialPosition?.y || 0 });
    const [width, setWidth] = useState(initialWidth || null);

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const dragStart = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ clientX: 0, startWidth: 0 });

    useEffect(() => {
        if (initialPosition) setPos({ x: initialPosition.x, y: initialPosition.y });
    }, [initialPosition]);

    useEffect(() => {
        if (initialWidth !== undefined) setWidth(initialWidth);
    }, [initialWidth]);

    const handlePointerDown = (e) => {
        if (isResizing) return;
        e.stopPropagation();
        setIsDragging(true);
        dragStart.current = { clientX: e.clientX, clientY: e.clientY, startX: pos.x, startY: pos.y };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const parent = e.currentTarget.parentElement;
        const percentX = dragStart.current.startX + ((e.clientX - dragStart.current.clientX) / parent.offsetWidth) * 100;
        const percentY = dragStart.current.startY + ((e.clientY - dragStart.current.clientY) / parent.offsetHeight) * 100;
        setPos({ x: percentX, y: percentY });
    };

    const handlePointerUp = (e) => {
        if (!isDragging) return;
        e.stopPropagation();
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
        if (onDragEnd) onDragEnd(pos);
    };

    const handleResizeDown = (e) => {
        e.stopPropagation();
        setIsResizing(true);
        const canvas = e.currentTarget.parentElement.parentElement;
        const currentWidthPct = width || (e.currentTarget.parentElement.offsetWidth / canvas.offsetWidth) * 100;
        resizeStart.current = { clientX: e.clientX, startWidth: currentWidthPct };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handleResizeMove = (e) => {
        if (!isResizing) return;
        e.stopPropagation();
        const canvas = e.currentTarget.parentElement.parentElement;
        const deltaX = e.clientX - resizeStart.current.clientX;
        const deltaPct = (deltaX / canvas.offsetWidth) * 100;
        const newWidth = Math.max(5, resizeStart.current.startWidth + deltaPct);
        setWidth(newWidth);
    };

    const handleResizeUp = (e) => {
        if (!isResizing) return;
        e.stopPropagation();
        setIsResizing(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
        if (onResizeEnd) onResizeEnd(width);
    };

    const showControls = isHovered || isDragging || isResizing;

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={onDoubleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                zIndex: zIndex,
                width: width ? `${width}%` : 'max-content',
                cursor: isDragging ? 'grabbing' : 'grab',
                border: showControls ? '2px dashed #d83b01' : '2px dashed transparent',
                padding: '4px',
                transition: (isDragging || isResizing) ? 'none' : 'border 0.2s',
            }}
        >
            {showControls && onDelete && (
                <div
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '-12px',
                        background: '#ef4444',
                        color: 'white',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        zIndex: 10,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                        lineHeight: 1
                    }}
                    title="Delete Element"
                >
                    ×
                </div>
            )}

            {children}
            {showControls && onResizeEnd && (
                <div
                    onPointerDown={handleResizeDown}
                    onPointerMove={handleResizeMove}
                    onPointerUp={handleResizeUp}
                    style={{
                        position: 'absolute',
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        zIndex: zIndex,
                        width: width ? `${width}%` : 'max-content',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        outline: showControls ? '2px dashed #d83b01' : '2px dashed transparent',
                        outlineOffset: '4px',
                        transition: (isDragging || isResizing) ? 'none' : 'outline 0.2s',
                    }}
                    title="Drag to resize"
                />
            )}
        </div>
    );
}