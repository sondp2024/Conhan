import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ControlsPanel } from './components/ControlsPanel';
import { Preview } from './components/Preview';
import { HotTrendsPanel } from './components/HotTrendsPanel';
import { HotTrendsList } from './components/HotTrendsList';
import type { StyleOptions, QuoteItem } from './types';
import { fetchTrendingQuotes } from './api/trendingQuotes';

const INITIAL_STYLES: StyleOptions = {
    caption: "",
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontSize: 48,
    bold: true,
    italic: false,
    fontColor: "#ffffff",
    textAlign: "center",
    textPosX: null,
    textPosY: null,
    lineHeight: 1.3,
    padding: 32,
    maxWidth: 1080,
    bgColor: "#ffffff",
    addWatermark: true,
    watermarkText: "© YourBrand",
    textShadow: true,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowBlur: 5,
};

type AppTab = 'editor' | 'hot';

function App() {
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
    const [styles, setStyles] = useState<StyleOptions>(INITIAL_STYLES);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<AppTab>('editor');
    const [hotLoading, setHotLoading] = useState(false);
    const [hotCategory, setHotCategory] = useState<QuoteItem["category"] | "all">("all");
    const [hotQuery, setHotQuery] = useState("");
    const [hotList, setHotList] = useState<(QuoteItem & { score: number })[]>([]);

    useEffect(() => {
        if (!imgSrc) return;
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => setImgEl(image);
        image.src = imgSrc;
    }, [imgSrc]);

    const loadHot = async () => {
        setHotLoading(true);
        const cat = hotCategory === "all" ? undefined : hotCategory;
        try {
            const data = await fetchTrendingQuotes({ category: cat, query: hotQuery });
            setHotList(data);
        } catch (error) {
            console.error("Failed to fetch trending quotes:", error);
        } finally {
            setHotLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "hot") {
            loadHot();
        }
    }, [activeTab]);

    const handleSelectQuote = (text: string) => {
        setStyles(prev => ({ 
            ...prev, 
            caption: text,
            textPosX: null,
            textPosY: null,
        }));
        setActiveTab('editor');
    };

    const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImgSrc(reader.result as string);
        reader.readAsDataURL(file);
        setGeneratedUrl(null);
    };

    const handleResetImage = () => {
        setImgSrc(null);
        setImgEl(null);
        setGeneratedUrl(null);
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const handleExportImage = () => {
        if (!previewCanvasRef.current) return;
        const url = previewCanvasRef.current.toDataURL("image/png");
        setGeneratedUrl(url);
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans">
            <main className="max-w-7xl mx-auto p-6 lg:p-8">
                <Header 
                    onPickFile={handlePickFile}
                    onResetImage={handleResetImage}
                />
                
                <div className="mb-6 flex gap-2">
                    <button
                        className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
                        onClick={() => setActiveTab('editor')}
                        aria-pressed={activeTab === 'editor'}
                    >
                        Soạn caption
                    </button>
                    <button
                        className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'hot' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
                        onClick={() => setActiveTab('hot')}
                        aria-pressed={activeTab === 'hot'}
                    >
                        Hot Trend Caption 🔥
                    </button>
                </div>
                
                {activeTab === 'editor' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <ControlsPanel
                            styles={styles}
                            setStyles={setStyles}
                            onExport={handleExportImage}
                            generatedUrl={generatedUrl}
                            isImageLoaded={!!imgEl}
                        />
                        <Preview
                            imgSrc={imgSrc}
                            imgEl={imgEl}
                            styles={styles}
                            setStyles={setStyles}
                            canvasRef={previewCanvasRef}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <HotTrendsPanel
                            hotCategory={hotCategory}
                            setHotCategory={setHotCategory}
                            hotQuery={hotQuery}
                            setHotQuery={setHotQuery}
                            loadHot={loadHot}
                            hotLoading={hotLoading}
                        />
                        <HotTrendsList
                            hotList={hotList}
                            onSelectQuote={handleSelectQuote}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;