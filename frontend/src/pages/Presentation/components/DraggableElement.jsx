// src/pages/Presentation/components/DraggableElement.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function DraggableElement({
    children,
    initialPosition,
    initialWidth,
    isActive,
    onSelect,
    onDragEnd,
    onResizeEnd,
    onDelete,
    onBringToFront,
    onSendToBack,
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

    // ================= 1. 拖拽逻辑 (带边界限制) =================
    const handlePointerDown = (e) => {
        if (isResizing) return;
        e.stopPropagation();
        onSelect();
        setIsDragging(true);
        dragStart.current = { clientX: e.clientX, clientY: e.clientY, startX: pos.x, startY: pos.y };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const parent = e.currentTarget.parentElement;

        let percentX = dragStart.current.startX + ((e.clientX - dragStart.current.clientX) / parent.offsetWidth) * 100;
        let percentY = dragStart.current.startY + ((e.clientY - dragStart.current.clientY) / parent.offsetHeight) * 100;

        const maxSafeX = width ? 100 - width : 95;
        percentX = Math.max(0, Math.min(maxSafeX, percentX));
        percentY = Math.max(0, Math.min(95, percentY));

        setPos({ x: percentX, y: percentY });
    };

    const handlePointerUp = (e) => {
        if (!isDragging) return;
        e.stopPropagation();
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
        if (onDragEnd) onDragEnd(pos);
    };

    // ================= 2. 拉伸逻辑 (带边界限制) =================
    const handleResizeDown = (e) => {
        e.stopPropagation();
        onSelect();
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

        const maxWidth = 100 - pos.x;
        const newWidth = Math.max(5, Math.min(maxWidth, resizeStart.current.startWidth + deltaPct));
        setWidth(newWidth);
    };

    const handleResizeUp = (e) => {
        if (!isResizing) return;
        e.stopPropagation();
        setIsResizing(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
        if (onResizeEnd) onResizeEnd(width);
    };

    const showHoverHint = !isActive && isHovered;

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
                zIndex: isActive ? zIndex + 1000 : zIndex,
                width: width ? `${width}%` : 'max-content',
                cursor: isDragging ? 'grabbing' : 'grab',

                outline: isActive ? '2px solid #d83b01' : (showHoverHint ? '2px dashed rgba(216, 59, 1, 0.4)' : '2px solid transparent'),
                outlineOffset: '4px',
                transition: (isDragging || isResizing) ? 'none' : 'outline 0.2s',
            }}
        >

            {isActive && (
                <div
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{
                        position: 'absolute',
                        top: '-45px',
                        left: '0',
                        background: '#ffffff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        borderRadius: '8px',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        zIndex: 10,
                        border: '1px solid #e2e6ea'
                    }}
                >
                    <button
                        onClick={onBringToFront} title="Bring to Front"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px', borderRadius: '4px', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#f1f3f5'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >⬆️</button>
                    <button
                        onClick={onSendToBack} title="Send to Back"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px', borderRadius: '4px', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#f1f3f5'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >⬇️</button>

                    <div style={{ width: '1px', height: '16px', background: '#dcdfe4', margin: '0 4px' }} />

                    <button
                        onClick={onDelete} title="Delete Element"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px', borderRadius: '4px', color: '#d32f2f', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#ffebee'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >🗑️</button>
                </div>
            )}

            {children}

            {isActive && onResizeEnd && (
                <div
                    onPointerDown={handleResizeDown}
                    onPointerMove={handleResizeMove}
                    onPointerUp={handleResizeUp}
                    style={{
                        position: 'absolute',
                        bottom: '-6px',
                        right: '-6px',
                        width: '14px',
                        height: '14px',
                        background: '#ffffff',
                        border: '3px solid #d83b01',
                        borderRadius: '50%',
                        cursor: 'nwse-resize',
                        zIndex: 10,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}
                />
            )}
        </div>
    );
}