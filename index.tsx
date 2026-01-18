import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import {
  Calendar,
  MapPin,
  Utensils,
  Train,
  Plane,
  Bus,
  ShoppingBag,
  Bed,
  Info,
  Wallet,
  Phone,
  Sparkles,
  Plus,
  Trash2,
  Navigation,
  FileText,
  Camera,
  Upload,
  Wand2,
  Loader2,
  Users
} from 'lucide-react';
import { ITINERARY, HOTELS, FLIGHTS, getWeatherIcon } from './constants';
import { ItineraryItem, Category, Expense } from './types';

// --- Types for AI Features ---
// Removing global window declaration here as it caused conflict, 
// using simple explicit casting in code instead.

// --- Main App ---

const App = () => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'info' | 'budget' | 'ai'>('itinerary');

  return (
    <div className="min-h-screen bg-gradient-to-b from-ski-snow to-ski-ice text-ski-text font-sans pb-24 selection:bg-ski-blue selection:text-white">
      <div className="max-w-md mx-auto min-h-screen shadow-2xl shadow-ski-blue/10 relative overflow-hidden bg-white/60 backdrop-blur-sm">

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent pointer-events-none z-0"></div>
        <div className="relative z-10 h-full">
          {activeTab === 'itinerary' && <ItineraryView />}
          {activeTab === 'info' && <InfoView />}
          {activeTab === 'budget' && <BudgetView />}
          {activeTab === 'ai' && <AiView />}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/50 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
            <NavButton
              active={activeTab === 'itinerary'}
              onClick={() => setActiveTab('itinerary')}
              icon={<Calendar size={22} />}
              label="行程"
            />
            <NavButton
              active={activeTab === 'info'}
              onClick={() => setActiveTab('info')}
              icon={<Info size={22} />}
              label="資訊"
            />
            <NavButton
              active={activeTab === 'ai'}
              onClick={() => setActiveTab('ai')}
              icon={<Sparkles size={22} />}
              label="AI 相機"
            />
            <NavButton
              active={activeTab === 'budget'}
              onClick={() => setActiveTab('budget')}
              icon={<Wallet size={22} />}
              label="預算"
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${active ? 'text-ski-blue translate-y-[-4px]' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`p-2 rounded-2xl transition-all ${active ? 'bg-ski-ice shadow-inner' : 'bg-transparent'}`}>
      {icon}
    </div>
    <span className={`text-[10px] mt-1 font-semibold ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
  </button>
);

// --- AI View (New Feature) ---

const AiView = () => {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [apiKeySet, setApiKeySet] = useState(false);

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      // Cast window to any to avoid type conflict with existing AIStudio definition
      if ((window as any).aistudio && await (window as any).aistudio.hasSelectedApiKey()) {
        setApiKeySet(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      // Assume success to avoid race conditions
      setApiKeySet(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generate = async () => {
    if (!process.env.API_KEY) {
      // Fallback if env not injected
      console.error("No API KEY");
      return;
    }

    setLoading(true);
    setResultImage(null);

    try {
      // Re-initialize for fresh key usage
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      if (mode === 'generate') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              imageSize: imageSize,
              aspectRatio: "1:1" // Default square for social media
            }
          },
        });

        // Extract image
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            setResultImage(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      } else {
        // Edit Mode (Nano Banana)
        if (!uploadImage) return;

        // Extract base64 data and mimeType correctly
        const matches = uploadImage.match(/^data:(.+);base64,(.+)$/);
        if (!matches || matches.length < 3) {
          throw new Error("Invalid image data");
        }
        const mimeType = matches[1];
        const base64Data = matches[2];

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              },
              { text: prompt || "Enhance this image" }
            ]
          }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            setResultImage(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }

    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!apiKeySet) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
        <div className="bg-ski-ice p-6 rounded-full text-ski-blue">
          <Sparkles size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-ski-dark mb-2">解鎖 AI Studio</h2>
          <p className="text-sm text-slate-500">連結您的帳戶以使用 Gemini 生成高品質 4K 圖像並編輯照片。</p>
        </div>
        <button
          onClick={handleSelectKey}
          className="bg-ski-blue text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-ski-blue/30 hover:scale-105 transition-transform"
        >
          連結 API Key
        </button>
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-xs text-slate-400 underline">帳單資訊</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-40 border-b border-slate-100 p-4">
        <h1 className="text-xl font-bold text-ski-dark flex items-center gap-2">
          <Sparkles className="text-ski-blue" /> AI Studio
        </h1>
        <div className="flex bg-slate-100 p-1 rounded-xl mt-4">
          <button
            onClick={() => setMode('generate')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'generate' ? 'bg-white shadow-sm text-ski-blue' : 'text-slate-500'}`}
          >
            生成圖片
          </button>
          <button
            onClick={() => setMode('edit')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'edit' ? 'bg-white shadow-sm text-ski-blue' : 'text-slate-500'}`}
          >
            編輯照片
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">

        {mode === 'generate' ? (
          <div className="space-y-4">
            <div className="bg-ski-ice/30 p-4 rounded-2xl border border-ski-ice">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">解析度</label>
              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${imageSize === size ? 'bg-ski-blue text-white border-ski-blue' : 'bg-white text-slate-500 border-slate-200'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">提示詞</label>
              <textarea
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-ski-blue outline-none resize-none h-32 text-slate-700"
                placeholder="滑雪者跳過鳥居，暴風雪中，動漫風格..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="relative w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              {uploadImage ? (
                <img src={uploadImage} alt="Upload" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Upload className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-sm text-slate-400 font-medium">點擊上傳照片</p>
                </div>
              )}
              <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>
            <input
              type="text"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ski-blue outline-none"
              placeholder="描述編輯內容 (例如 '讓它下雪')..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        )}

        <button
          disabled={loading || (!prompt && mode === 'generate') || (!uploadImage && mode === 'edit')}
          onClick={generate}
          className="w-full bg-ski-blue text-white font-bold py-4 rounded-2xl shadow-lg shadow-ski-blue/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
          {loading ? '夢想中...' : (mode === 'generate' ? '生成圖片' : '混搭照片')}
        </button>

        {resultImage && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img src={resultImage} alt="Generated" className="w-full h-auto" />
              <a href={resultImage} download="gemini_ski.png" className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full text-ski-dark hover:bg-white transition-colors">
                <Camera size={20} />
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};


// --- Itinerary View ---

type FilterType = 'All' | 'Rina' | 'Kiwi' | 'David';

const ItineraryView = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [filter, setFilter] = useState<FilterType>('All');
  const currentDay = ITINERARY[selectedDayIndex];

  // Logic to filter items based on participants
  const filteredItems = currentDay.items.filter(item => {
    // If no specific participants listed, assume it's for everyone
    if (!item.participants || item.participants.length === 0) return true;

    if (filter === 'All') return true;

    // Check if the current filter person is in the participants list
    return item.participants.includes(filter);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header / Day Selector */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-40 border-b border-white/20 shadow-sm pt-safe">
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-ski-dark">日本 2026</h1>
            <p className="text-xs text-ski-blue font-bold uppercase tracking-widest mt-0.5">滑雪團</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-ski-text bg-ski-ice/50 px-3 py-1.5 rounded-full border border-ski-ice">
            {currentDay.weatherForecast && getWeatherIcon(currentDay.weatherForecast.condition)}
            <span className="font-mono font-bold">{currentDay.weatherForecast?.temp}</span>
          </div>
        </div>

        {/* Person Filter */}
        <div className="px-5 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2">
            {(['All', 'Rina', 'Kiwi', 'David'] as FilterType[]).map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filter === p
                    ? 'bg-ski-blue text-white border-ski-blue shadow-md shadow-ski-blue/20'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-ski-blue/50'
                  }`}
              >
                {p === 'All' ? '全部' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Scroll Day Selector */}
        <div className="flex overflow-x-auto no-scrollbar pb-4 px-4 space-x-3 snap-x">
          {ITINERARY.map((day, idx) => (
            <button
              key={day.date}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-shrink-0 snap-center flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all duration-300 ${selectedDayIndex === idx
                  ? 'bg-ski-dark text-white shadow-lg shadow-ski-dark/20 scale-105 border-transparent'
                  : 'bg-white text-slate-400 border-slate-100 hover:border-ski-blue/30'
                }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{day.dayLabel.split(' ')[0]}</span>
              <span className="text-lg font-bold mt-1">{day.dayLabel.split(' ')[1].replace(/[()]/g, '')}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Timeline */}
      <main className="flex-1 px-4 py-6 space-y-6">
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <MapPin size={80} />
          </div>
          <h2 className="text-xl font-medium text-ski-dark relative z-10">{currentDay.locationLabel}</h2>
          <p className="text-xs text-ski-blue font-bold mt-1 uppercase tracking-widest bg-ski-ice/50 inline-block px-3 py-1 rounded-full relative z-10">{currentDay.date}</p>
        </div>

        <div className="relative pl-4 border-l-2 border-ski-ice space-y-8 pb-10">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">
              今天 {filter} 沒有行程。
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <ItineraryCard key={item.id} item={item} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

const ItineraryCard: React.FC<{ item: ItineraryItem }> = ({ item }) => {
  const getIcon = (cat: Category) => {
    switch (cat) {
      case 'flight': return <Plane className="w-4 h-4" />;
      case 'train': return <Train className="w-4 h-4" />;
      case 'bus': return <Bus className="w-4 h-4" />;
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'shopping': return <ShoppingBag className="w-4 h-4" />;
      case 'hotel': return <Bed className="w-4 h-4" />;
      case 'activity': return <MapPin className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case 'flight':
      case 'train':
      case 'bus': return 'bg-sky-100 text-sky-600';
      case 'food': return 'bg-orange-50 text-orange-600';
      case 'shopping': return 'bg-purple-50 text-purple-600';
      case 'hotel': return 'bg-indigo-50 text-indigo-600';
      case 'activity': return 'bg-emerald-50 text-emerald-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="relative group">
      {/* Dot on timeline */}
      <div className={`absolute -left-[21px] top-4 w-3 h-3 rounded-full border-2 border-white shadow-sm ring-2 ring-ski-snow ${item.highlight ? 'bg-japan-red' : 'bg-ski-blue'}`}></div>

      <div className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-50 hover:shadow-ice hover:-translate-y-0.5 transition-all duration-300 ${item.highlight ? 'ring-1 ring-japan-red/20' : ''}`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{item.time}</span>
            <div className={`p-1.5 rounded-lg ${getCategoryColor(item.category)}`}>
              {getIcon(item.category)}
            </div>
          </div>
          {item.location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location.name)}`}
              target="_blank"
              rel="noreferrer"
              className="text-ski-blue bg-ski-ice/50 p-2 rounded-full hover:bg-ski-blue hover:text-white transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <h3 className={`text-lg font-bold mb-1 leading-tight ${item.highlight ? 'text-japan-red' : 'text-ski-dark'}`}>
          {item.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4 font-light">{item.description}</p>

        {/* Participants & Tags */}
        <div className="flex flex-col gap-2">
          {item.participants && (
            <div className="flex items-center gap-1">
              <Users size={12} className="text-slate-400" />
              <span className="text-[10px] text-slate-400 font-semibold">{item.participants.join(', ')}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {item.tags?.map((tag, i) => {
              let style = "bg-slate-50 text-slate-500 border-slate-100";
              if (tag.toLowerCase().includes('must eat')) style = "bg-emerald-50 text-emerald-700 border-emerald-100 font-semibold";
              if (tag.toLowerCase().includes('booking') || tag.includes('PIN')) style = "bg-red-50 text-japan-red border-red-100 font-bold";
              if (tag.includes('Reserved')) style = "bg-sky-50 text-sky-700 border-sky-100";

              return (
                <span key={i} className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border ${style}`}>
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Info View ---

const InfoView = () => {
  return (
    <div className="p-4 pt-8 space-y-8 bg-white min-h-full">
      <header className="mb-6 px-2">
        <h1 className="text-3xl font-black text-ski-dark">資訊中心</h1>
        <p className="text-slate-400 text-sm">旅程必備資訊</p>
      </header>

      {/* Emergency Section */}
      <section>
        <div className="flex items-center space-x-2 mb-4 px-2">
          <div className="w-1 h-4 bg-japan-red rounded-full"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">緊急聯絡</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <a href="tel:110" className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center hover:bg-red-100 transition-colors group">
            <span className="block text-3xl font-black text-japan-red group-hover:scale-110 transition-transform">110</span>
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-1">警察</span>
          </a>
          <a href="tel:119" className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center hover:bg-red-100 transition-colors group">
            <span className="block text-3xl font-black text-japan-red group-hover:scale-110 transition-transform">119</span>
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-1">救護車</span>
          </a>
        </div>
      </section>

      {/* Hotels */}
      <section>
        <div className="flex items-center space-x-2 mb-4 px-2">
          <div className="w-1 h-4 bg-japan-indigo rounded-full"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">住宿</h2>
        </div>
        <div className="space-y-4">
          {HOTELS.map((hotel, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-ice border border-ski-ice/50">
              <h3 className="font-bold text-lg text-ski-dark">{hotel.name}</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">登記入住</span>
                  <span className="font-medium">{hotel.checkIn} - {hotel.checkOut}</span>
                </div>
                <div className="flex justify-between items-center bg-ski-snow p-3 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">預訂代號</span>
                  <span className="font-mono font-bold text-japan-indigo select-all cursor-copy">{hotel.bookingRef}</span>
                </div>
                <div className="pt-1 flex items-start space-x-2 text-xs text-slate-400">
                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + " " + hotel.address)}`} className="underline decoration-slate-200 hover:text-ski-blue">
                    {hotel.address}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flights */}
      <section>
        <div className="flex items-center space-x-2 mb-4 px-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">航班</h2>
        </div>
        <div className="space-y-3">
          {FLIGHTS.map((flight, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-black text-ski-dark tracking-tight">{flight.flight}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-500">{flight.passenger}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">{flight.route}</span>
                <span className="font-mono text-slate-400 text-xs">{flight.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Budget View ---

const BudgetView = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [newItem, setNewItem] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [currency, setCurrency] = useState<'JPY' | 'TWD'>('JPY');
  const [payer, setPayer] = useState('Common');

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem || !newAmount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      item: newItem,
      amount: parseFloat(newAmount),
      currency,
      payer,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    };
    setExpenses([expense, ...expenses]);
    setNewItem('');
    setNewAmount('');
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalJPY = expenses.filter(e => e.currency === 'JPY').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-4 pt-8 h-full flex flex-col bg-slate-50">
      <header className="mb-6 px-2">
        <h1 className="text-3xl font-black text-ski-dark">預算</h1>
      </header>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-ski-dark to-slate-800 text-white p-6 rounded-3xl shadow-xl shadow-slate-300 mb-8 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">總支出 (JPY)</p>
        <p className="text-5xl font-black tracking-tighter">¥{totalJPY.toLocaleString()}</p>
        <div className="mt-6 flex gap-2">
          <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-md">
            {expenses.length} 筆交易
          </div>
        </div>
      </div>

      {/* Add New */}
      <form onSubmit={addExpense} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <input
            type="text"
            placeholder="買了什麼？"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="col-span-3 p-3 bg-slate-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-ski-blue outline-none transition-all placeholder:text-slate-400 font-medium text-ski-dark"
          />
          <div className="col-span-2 relative">
            <span className="absolute left-3 top-3 text-slate-400 text-sm font-bold">{currency === 'JPY' ? '¥' : '$'}</span>
            <input
              type="number"
              placeholder="0"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="w-full p-3 pl-8 bg-slate-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-ski-blue outline-none transition-all font-mono font-bold text-ski-dark"
            />
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'JPY')}
            className="p-3 bg-slate-50 rounded-xl border-transparent focus:bg-white outline-none font-bold text-slate-600 text-sm"
          >
            <option value="JPY">JPY</option>
            <option value="TWD">TWD</option>
          </select>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
          <div className="flex space-x-1">
            {['Common', 'Rina', 'Kiwi'].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPayer(p)}
                className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors ${payer === p ? 'bg-ski-dark text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button type="submit" className="bg-ski-blue text-white p-3 rounded-full hover:bg-sky-600 hover:rotate-90 transition-all shadow-lg shadow-ski-blue/30">
            <Plus size={20} />
          </button>
        </div>
      </form>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-24 px-1">
        {expenses.length === 0 ? (
          <div className="text-center text-slate-300 py-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-medium">尚無支出</p>
          </div>
        ) : (
          expenses.map(exp => (
            <div key={exp.id} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-50 group">
              <div className="flex items-center space-x-4">
                <div className="bg-ski-ice/50 p-3 rounded-xl text-ski-blue">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="font-bold text-ski-dark text-sm">{exp.item}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">{exp.payer} • {exp.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-mono font-bold text-ski-dark">
                  {exp.currency === 'JPY' ? '¥' : '$'}{exp.amount.toLocaleString()}
                </span>
                <button onClick={() => deleteExpense(exp.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);