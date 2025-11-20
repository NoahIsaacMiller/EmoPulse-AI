import React, { useState, useEffect } from 'react';
import { analyzeLocal, analyzeCloud } from './services/geminiService';
import { BackendResponse, HistoryItem, ModelType, TabType } from './types';
import { Loader } from './components/Loader';
import { EmotionRadar } from './components/EmotionRadar';
import { StatsCard } from './components/StatsCard';
import { AdviceSection } from './components/AdviceSection';
import { 
  Sparkles, 
  Brain, 
  Cloud, 
  Trash2, 
  Send, 
  Layout, 
  BarChart3, 
  Coffee,
  History,
  Settings,
  X,
  Zap,
  Heart,
  SmilePlus,
  PenTool,
  Palette
} from 'lucide-react';

const App: React.FC = () => {
  // --- STATE ---
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelType, setModelType] = useState<ModelType>('cloud');
  const [data, setData] = useState<BackendResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showSettings, setShowSettings] = useState(false);

  // --- INIT ---
  useEffect(() => {
    const saved = localStorage.getItem('emo_history_cute_v1');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // --- HANDLERS ---
  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setData(null); 
    setActiveTab('overview');

    try {
      const analyzeFn = modelType === 'local' ? analyzeLocal : analyzeCloud;
      const result = await analyzeFn(input);
      if (modelType === 'local') await new Promise(r => setTimeout(r, 800)); // Fake loading for cuteness
      
      setData(result);

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        text: input,
        timestamp: Date.now(),
        data: result,
        model: modelType
      };
      
      const newHistory = [newItem, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('emo_history_cute_v1', JSON.stringify(newHistory));
    } catch (e: any) {
      alert(`哎呀！出错了: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('emo_history_cute_v1');
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen flex flex-col pb-10">
      
      {/* === HEADER === */}
      <header className="pt-8 pb-4 px-4 text-center z-10">
        <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-8 py-3 rounded-full shadow-sm border-4 border-white ring-4 ring-pink-200/50">
          <div className="bg-pink-400 text-white p-2 rounded-xl animate-bounce">
            <Heart fill="currentColor" size={24} />
          </div>
          <h1 className="text-3xl font-black tracking-wide text-slate-700 font-cute">EmoPulse</h1>
          <span className="bg-blue-300 text-white text-[10px] px-2 py-1 rounded-full font-bold -ml-1 mt-[-15px] rotate-12">Cute Ver.</span>
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className="w-full max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: INPUT --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           {/* Input Card */}
           <div className="cute-card border-purple h-full min-h-[550px] p-1 relative flex flex-col">
              <div className="absolute top-4 right-4 z-10">
                 <button 
                   onClick={() => setShowSettings(true)}
                   className="bg-slate-100 p-2 rounded-2xl hover:bg-slate-200 text-slate-500 transition-colors"
                 >
                   <Settings size={20} />
                 </button>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
                    <PenTool size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-slate-700">心情日记</h2>
                    <p className="text-xs text-slate-400 font-bold">写下此刻的想法...</p>
                  </div>
                </div>

                <div className="relative flex-1 mb-6 group">
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-full paper-input text-lg resize-none"
                    placeholder="今天发生了什么有趣的事？或者有什么烦恼？在这里告诉我吧 (｡•̀ᴗ-)✧"
                  />
                  <div className="absolute -bottom-3 -right-2 bg-yellow-300 text-yellow-800 text-xs font-black px-3 py-1 rounded-full rotate-[-5deg] shadow-sm">
                    {input.length} 字
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6 bg-slate-50 p-2 rounded-[1.5rem]">
                   <button 
                     onClick={() => setModelType('local')}
                     className={`flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${modelType === 'local' ? 'bg-white text-purple-500 shadow-md ring-2 ring-purple-100' : 'text-slate-400 hover:bg-white/50'}`}
                   >
                     <Brain size={18} /> 本地私密
                   </button>
                   <button 
                     onClick={() => setModelType('cloud')}
                     className={`flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${modelType === 'cloud' ? 'bg-white text-blue-400 shadow-md ring-2 ring-blue-100' : 'text-slate-400 hover:bg-white/50'}`}
                   >
                     <Cloud size={18} /> 云端智能
                   </button>
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={loading || !input.trim()}
                  className="w-full squishy-btn btn-primary py-4 text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   {loading ? <Loader color="text-white" /> : <><Send size={24} strokeWidth={3} /> 开始分析</>}
                </button>
              </div>
           </div>
        </div>

        {/* --- RIGHT: DASHBOARD --- */}
        <div className="lg:col-span-7">
           {!data ? (
             <div className="cute-card border-blue h-full min-h-[550px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-48 h-48 bg-blue-50 rounded-full flex items-center justify-center mb-8 animate-[bounce_3s_infinite]">
                   <Sparkles size={64} className="text-blue-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-700 mb-2">准备好啦！</h3>
                <p className="text-slate-400 font-bold max-w-xs mx-auto">
                  在左边写下你的心情，我会用超级可爱的图表展示给你看哦~
                </p>
             </div>
           ) : (
             <div className="flex flex-col gap-6 h-full">
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                   <StatsCard 
                     label="核心情绪" 
                     value={data.primary_emotion} 
                     icon={Heart} 
                     color="pink" 
                   />
                   <StatsCard 
                     label="能量指数" 
                     value={data.score} 
                     icon={Zap} 
                     color="yellow" 
                     suffix="%"
                   />
                </div>

                {/* Main Content Card */}
                <div className="cute-card border-pink flex-1 flex flex-col overflow-hidden p-0">
                   {/* Tabs */}
                   <div className="flex p-2 gap-2 bg-pink-50/50">
                      <button 
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'overview' ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-400 hover:text-pink-400'}`}
                      >
                        <Layout size={18} /> 概览
                      </button>
                      <button 
                        onClick={() => setActiveTab('details')}
                        className={`flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'details' ? 'bg-white text-purple-500 shadow-sm' : 'text-slate-400 hover:text-purple-400'}`}
                      >
                        <BarChart3 size={18} /> 数据
                      </button>
                      <button 
                        onClick={() => setActiveTab('advice')}
                        className={`flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'advice' ? 'bg-white text-blue-500 shadow-sm' : 'text-slate-400 hover:text-blue-400'}`}
                      >
                        <Coffee size={18} /> 建议
                      </button>
                   </div>

                   {/* Tab Content */}
                   <div className="p-6 flex-1 bg-white overflow-y-auto max-h-[500px]">
                      
                      {/* 1. OVERVIEW */}
                      {activeTab === 'overview' && (
                        <div className="flex flex-col items-center h-full gap-6">
                           <div className="text-[7rem] hover:scale-110 transition-transform cursor-default drop-shadow-lg">
                             {data.emoji}
                           </div>
                           
                           <div className="w-full bg-slate-50 rounded-[2rem] p-6 border-2 border-slate-100 text-center relative">
                             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full">
                               AI 评价
                             </div>
                             <p className="text-lg font-bold text-slate-600 leading-relaxed">
                               "{data.comment}"
                             </p>
                           </div>

                           <div className="w-full h-64 bg-purple-50/50 rounded-[2rem] p-4">
                              <EmotionRadar data={data.details} color={data.theme_color} />
                           </div>
                        </div>
                      )}

                      {/* 2. DETAILS */}
                      {activeTab === 'details' && (
                        <div className="space-y-6">
                           <div className="grid grid-cols-1 gap-3">
                             {data.details.map((item, idx) => (
                               <div key={idx} className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                                 <div className="w-12 text-sm font-bold text-slate-500 text-right">{item.name}</div>
                                 <div className="flex-1 h-4 bg-white rounded-full overflow-hidden border border-slate-100">
                                   <div 
                                     className="h-full bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"
                                     style={{ width: `${item.value}%` }}
                                   ></div>
                                 </div>
                                 <div className="w-8 text-sm font-black text-purple-400">{item.value}</div>
                               </div>
                             ))}
                           </div>
                           <div className="text-center mt-8">
                             <span className="inline-block bg-cyan-100 text-cyan-600 px-4 py-2 rounded-xl font-bold text-xs">
                               情感极性: {data.sentiment_polarity > 0 ? '🌈 积极' : data.sentiment_polarity < 0 ? '🌧️ 消极' : '☁️ 中性'} ({data.sentiment_polarity})
                             </span>
                           </div>
                        </div>
                      )}

                      {/* 3. ADVICE */}
                      {activeTab === 'advice' && (
                         <AdviceSection emotion={data.primary_emotion} />
                      )}

                   </div>
                </div>
             </div>
           )}
        </div>
      </main>

      {/* === FOOTER HISTORY === */}
      <section className="w-full max-w-6xl mx-auto px-4 mt-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-6 border-2 border-white">
          <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold pl-2">
             <History size={18} /> 历史足迹
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 px-1 snap-x">
             {history.map(item => (
               <button 
                 key={item.id}
                 onClick={() => {
                   setData(item.data);
                   setInput(item.text);
                   setModelType(item.model);
                   window.scrollTo({top:0, behavior:'smooth'});
                 }}
                 className="snap-start shrink-0 w-48 bg-white p-4 rounded-3xl border-2 border-slate-100 hover:border-pink-200 transition-all text-left group"
               >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">{item.data.emoji}</div>
                  <div className="text-slate-600 font-bold text-sm truncate mb-1">{item.text}</div>
                  <div className="text-slate-300 text-[10px] font-bold">{new Date(item.timestamp).toLocaleDateString()}</div>
               </button>
             ))}
             {history.length === 0 && <div className="text-slate-300 font-bold text-sm p-2">还没写过日记呢~</div>}
          </div>
        </div>
      </section>

      {/* === SETTINGS MODAL === */}
      {showSettings && (
        <div className="fixed inset-0 bg-purple-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="cute-card border-yellow w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black text-slate-700">设置</h3>
                 <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                   <X size={20} />
                 </button>
              </div>
              
              <div className="space-y-4">
                 <div className="p-4 bg-slate-50 rounded-3xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-700 text-sm">清除历史</div>
                      <div className="text-xs text-slate-400 font-bold">清空所有日记</div>
                    </div>
                    <button 
                      onClick={clearHistory}
                      className="p-3 bg-red-100 text-red-500 rounded-2xl hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                 </div>
                 
                 <div className="text-center pt-4">
                   <div className="inline-block bg-yellow-100 text-yellow-600 text-xs font-bold px-3 py-1 rounded-full">
                     Kawaii Mode ON
                   </div>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default App;