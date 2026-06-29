import React, { useEffect, useRef } from 'react';
import { Save, Trash2 } from 'lucide-react';

const FloatingDrawingToolbar = ({
    selectedDrawing,
    onColorChange,
    onSave,
    onDelete,
    onRequestClose,
    isSaving,
    position
}) => {
    const toolbarRef = useRef(null);
    const selectedColor = selectedDrawing?.style?.color || '#3b82f6';

    useEffect(() => {
        if (!onRequestClose) return;

        const handleClickOutside = (event) => {
            if (!toolbarRef.current) return;
            if (!toolbarRef.current.contains(event.target)) {
                onRequestClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onRequestClose]);

    if (!selectedDrawing || !position) return null;

    return (
        <div
            ref={toolbarRef}
            className="absolute z-50 flex items-center gap-3 px-3 py-2 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl shadow-black/30 backdrop-blur-xl"
            style={{
                left: `${position.left}px`,
                top: `${position.top}px`,
                transform: 'translate(-50%, -110%)',
                minWidth: '220px'
            }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div className="flex items-center gap-2">
                <span className="text-slate-300 text-xs uppercase tracking-[0.24em]">🎨</span>
                <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => onColorChange?.(e.target.value)}
                    className="w-9 h-9 p-0 border-none rounded-full overflow-hidden cursor-pointer"
                    title="Change drawing color"
                    onMouseDown={(e) => e.stopPropagation()}
                />
            </div>

            <button
                onClick={onSave}
                disabled={!selectedDrawing || isSaving}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] rounded-xl bg-slate-800 text-slate-100 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Save className="w-4 h-4" />
                Save
            </button>

            <button
                onClick={onDelete}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] rounded-xl bg-red-600 text-white hover:bg-red-500"
            >
                <Trash2 className="w-4 h-4" />
                Delete
            </button>
        </div>
    );
};

export default FloatingDrawingToolbar;
