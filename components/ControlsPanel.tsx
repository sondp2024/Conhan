import React from 'react';
import type { StyleOptions } from '../types';

interface ControlsPanelProps {
    styles: StyleOptions;
    setStyles: React.Dispatch<React.SetStateAction<StyleOptions>>;
    onExport: () => void;
    generatedUrl: string | null;
    isImageLoaded: boolean;
}

const ControlGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-t border-slate-200 pt-4 mt-4">
        <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">{title}</h3>
        {children}
    </div>
);

const InputField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="text-sm font-medium text-slate-700 block mb-1.5">{label}</label>
        {children}
    </div>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

export const ControlsPanel: React.FC<ControlsPanelProps> = ({ styles, setStyles, onExport, generatedUrl, isImageLoaded }) => {
    const handleStyleChange = <K extends keyof StyleOptions,>(key: K, value: StyleOptions[K]) => {
        setStyles(prev => ({ ...prev, [key]: value }));
    };

    return (
        <section className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6">
            <InputField label="Câu ký nhân (Caption)">
                <textarea
                    value={styles.caption}
                    onChange={(e) => handleStyleChange('caption', e.target.value)}
                    placeholder={'Ví dụ: "Sống là cho đâu chỉ nhận riêng mình"'}
                    className="w-full rounded-md border-slate-300 p-3 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    rows={4}
                />
            </InputField>

            <ControlGroup title="Font & Text">
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Cỡ chữ">
                        <input type="number" className="w-full rounded-md border-slate-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 transition" min={14} max={128} value={styles.fontSize} onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value, 10))} />
                    </InputField>
                    <InputField label="Dãn dòng">
                        <input type="number" step={0.1} min={1} max={3} className="w-full rounded-md border-slate-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 transition" value={styles.lineHeight} onChange={(e) => handleStyleChange('lineHeight', parseFloat(e.target.value))} />
                    </InputField>
                     <InputField label="Font Family">
                        <input type="text" className="w-full rounded-md border-slate-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 transition" value={styles.fontFamily} onChange={(e) => handleStyleChange('fontFamily', e.target.value)} placeholder="Inter, Arial, ..." />
                    </InputField>
                    <InputField label="Màu chữ">
                        <input type="color" className="w-full h-10 rounded-md border-slate-300 cursor-pointer" value={styles.fontColor} onChange={(e) => handleStyleChange('fontColor', e.target.value)} />
                    </InputField>
                    <InputField label="Căn lề ngang">
                        <select className="w-full rounded-md border-slate-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 transition" value={styles.textAlign} onChange={(e) => handleStyleChange('textAlign', e.target.value as CanvasTextAlign)}>
                            <option value="left">Trái</option>
                            <option value="center">Giữa</option>
                            <option value="right">Phải</option>
                        </select>
                    </InputField>
                </div>
                 <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                        <input id="bold" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={styles.bold} onChange={(e) => handleStyleChange('bold', e.target.checked)} />
                        <label htmlFor="bold" className="font-medium text-slate-700">Đậm</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="italic" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={styles.italic} onChange={(e) => handleStyleChange('italic', e.target.checked)} />
                        <label htmlFor="italic" className="font-medium text-slate-700">Nghiêng</label>
                    </div>
                </div>
            </ControlGroup>
            
            <ControlGroup title="Layout">
                 <div className="grid grid-cols-2 gap-4">
                     <InputField label="Độ rộng tối đa (px)">
                        <input type="number" className="w-full rounded-md border-slate-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 transition" min={360} max={4096} value={styles.maxWidth} onChange={(e) => handleStyleChange('maxWidth', parseInt(e.target.value, 10))} />
                    </InputField>
                    <InputField label="Padding (px)">
                        <input type="number" className="w-full rounded-md border-slate-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 transition" min={0} max={200} value={styles.padding} onChange={(e) => handleStyleChange('padding', parseInt(e.target.value, 10))} />
                    </InputField>
                 </div>
            </ControlGroup>

            <ControlGroup title="Hiệu ứng chữ">
                <div className="flex items-center gap-2">
                    <input id="shadow" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={styles.textShadow} onChange={(e) => handleStyleChange('textShadow', e.target.checked)} />
                    <label htmlFor="shadow" className="font-medium text-slate-700">Đổ bóng chữ</label>
                </div>
                 {styles.textShadow && (
                    <div className="grid grid-cols-2 gap-4 mt-3">
                         <InputField label="Màu bóng">
                            <input type="color" className="w-full h-10 rounded-md border-slate-300 cursor-pointer" value={styles.shadowColor} onChange={(e) => handleStyleChange('shadowColor', e.target.value)} />
                        </InputField>
                        <InputField label="Độ mờ bóng">
                            <input type="number" className="w-full rounded-md border-slate-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 transition" min={0} max={50} value={styles.shadowBlur} onChange={(e) => handleStyleChange('shadowBlur', parseInt(e.target.value, 10))} />
                        </InputField>
                    </div>
                 )}
            </ControlGroup>

            <ControlGroup title="Watermark">
                 <div className="flex items-center gap-2">
                    <input id="wm" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={styles.addWatermark} onChange={(e) => handleStyleChange('addWatermark', e.target.checked)} />
                    <label htmlFor="wm" className="font-medium text-slate-700">Thêm watermark</label>
                </div>
                {styles.addWatermark && (
                    <InputField label="">
                        <input type="text" className="mt-2 w-full rounded-md border-slate-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 transition" value={styles.watermarkText} onChange={(e) => handleStyleChange('watermarkText', e.target.value)} placeholder="© YourBrand" />
                    </InputField>
                )}
            </ControlGroup>

            <div className="pt-6 mt-4 border-t border-slate-200 flex flex-col gap-3">
                <button onClick={onExport} disabled={!isImageLoaded} className="w-full flex items-center justify-center px-4 py-3 rounded-lg shadow-sm bg-slate-800 text-white font-semibold hover:bg-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700">
                    Xuất ảnh (PNG)
                </button>
                {generatedUrl && (
                    <a href={generatedUrl} download={`image-with-caption-${Date.now()}.png`} className="w-full flex items-center justify-center px-4 py-3 rounded-lg shadow-sm bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <DownloadIcon />
                        Tải về
                    </a>
                )}
            </div>
        </section>
    );
};