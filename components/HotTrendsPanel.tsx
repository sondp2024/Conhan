import React from 'react';
import type { QuoteItem } from '../types';

interface HotTrendsPanelProps {
    hotCategory: QuoteItem["category"] | "all";
    setHotCategory: (category: QuoteItem["category"] | "all") => void;
    hotQuery: string;
    setHotQuery: (query: string) => void;
    loadHot: () => void;
    hotLoading: boolean;
}

export const HotTrendsPanel: React.FC<HotTrendsPanelProps> = ({
    hotCategory,
    setHotCategory,
    hotQuery,
    setHotQuery,
    loadHot,
    hotLoading,
}) => {
    const handleReset = () => {
        setHotCategory("all");
        setHotQuery("");
        loadHot();
    };
    
    const handleSearchOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            loadHot();
        }
    }

    return (
        <section className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6 space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Bộ lọc Caption</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="category-select" className="text-sm font-medium text-slate-700 block mb-1.5">Danh mục</label>
                        <select
                            id="category-select"
                            className="w-full rounded-md border-slate-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={hotCategory}
                            onChange={(e) => setHotCategory(e.target.value as any)}
                        >
                            <option value="all">Tất cả</option>
                            <option value="triet-ly">Triết lý</option>
                            <option value="hai-huoc">Hài hước</option>
                            <option value="ngan-gon">Ngắn gọn</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="search-input" className="text-sm font-medium text-slate-700 block mb-1.5">Tìm nhanh</label>
                        <input
                            id="search-input"
                            value={hotQuery}
                            onChange={(e) => setHotQuery(e.target.value)}
                            onKeyDown={handleSearchOnEnter}
                            className="w-full rounded-md border-slate-300 p-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="VD: hạnh phúc, kỷ luật..."
                        />
                    </div>
                </div>
                <div className="flex gap-3 pt-2">
                    <button onClick={loadHot} className="flex-1 px-4 py-2 rounded-lg shadow-sm bg-slate-800 text-white font-semibold hover:bg-slate-900 transition-colors disabled:opacity-50" disabled={hotLoading}>
                        {hotLoading ? "Đang tải..." : "Lấy caption hot"}
                    </button>
                    <button onClick={handleReset} className="px-4 py-2 rounded-lg shadow-sm bg-white text-slate-700 font-semibold hover:bg-slate-50 border border-slate-300 transition-colors">Làm mới</button>
                </div>
                <p className="text-xs text-slate-500 pt-2">* Demo sử dụng mock data. Trong thực tế, dữ liệu sẽ được lấy từ API của mạng xã hội, lưu vào cache và xếp hạng.</p>
            </div>
        </section>
    );
};
