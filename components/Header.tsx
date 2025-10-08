import React, { useRef } from 'react';

interface HeaderProps {
    onPickFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onResetImage: () => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ onPickFile, onResetImage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <header className="mb-8 pb-4 border-b border-slate-200 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Ngạn ngữ + Picctur
            </h1>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center px-4 py-2 rounded-lg shadow-sm bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <UploadIcon />
                    Chọn ảnh
                </button>
                <button
                    onClick={onResetImage}
                    className="flex items-center justify-center px-4 py-2 rounded-lg shadow-sm bg-white text-slate-700 font-semibold hover:bg-slate-50 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <TrashIcon />
                    Xoá ảnh
                </button>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onPickFile}
                className="hidden"
            />
        </header>
    );
};