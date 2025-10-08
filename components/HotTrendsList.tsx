import React from 'react';
import type { QuoteItem } from '../types';

interface HotTrendsListProps {
    hotList: (QuoteItem & { score: number })[];
    onSelectQuote: (text: string) => void;
}

const QuoteCard: React.FC<{ quote: QuoteItem & { score: number }; onSelect: () => void }> = ({ quote, onSelect }) => (
    <li className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 bg-white hover:shadow-md transition-shadow hover:border-indigo-300">
        <blockquote className="text-slate-800 text-base leading-relaxed">"{quote.text}"</blockquote>
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-600">
            <span className="px-2 py-1 rounded-full bg-slate-100 font-medium capitalize">{quote.category}</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">Nguồn: {quote.source}</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">❤ {quote.likes.toLocaleString()}</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">↻ {quote.shares.toLocaleString()}</span>
            <span className="font-bold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Score: {quote.score}</span>
            {quote.hashtags?.length ? (
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">{quote.hashtags.join(" ")}</span>
            ) : null}
        </div>
        <div className="pt-2">
            <button
                onClick={onSelect}
                className="px-4 py-2 text-sm rounded-lg shadow-sm bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Chọn làm caption
            </button>
        </div>
    </li>
);

export const HotTrendsList: React.FC<HotTrendsListProps> = ({ hotList, onSelectQuote }) => {
    return (
        <section className="lg:col-span-2">
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Top caption đang hot (xếp theo score)</h3>
                {hotList.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-500 bg-white">
                        <p className="font-semibold">Chưa có dữ liệu.</p>
                        <p>Nhấn "Lấy caption hot" để bắt đầu.</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {hotList.map((q) => (
                            <QuoteCard key={q.id} quote={q} onSelect={() => onSelectQuote(q.text)} />
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};
