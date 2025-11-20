import React, { useState, useEffect, useRef } from 'react';
import { analyzeEmotion } from './services/geminiService';
import { AnalysisResult, HistoryItem } from './types';
import { Loader } from './components/Loader';
import { EmotionRadar } from './components/EmotionRadar';
import { 
  Sparkles, 
  History, 
  Trash2, 
  ArrowRight, 
  Activity,
  MessageSquareText,
  BarChart3
} from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('emoPulseHistory_v2');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (text: string, res: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      text: text.length > 40 ? text.substring(0, 40) + '...' : text,
      timestamp: Date.now(),
      result: res
    };
    const newHistory = [newItem, ...history].slice(0, 8); 
    setHistory(newHistory);
    localStorage.setItem('emoPulseHistory_v2', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('emoPulseHistory_v2');
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeEmotion(inputText);
      setResult(data);
      saveToHistory(inputText, data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError("分析服务暂时不可用，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setResult(item.result);
    setInputText(item.text); 
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      
      {/* Fresh Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply blur-3xl top-[-10%] left-[-10%] animate-[move_15s_infinite_alternate]"></div>
        <div className="blob w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply blur-3xl bottom-[-10%] right-[-10%] animate-[move_12s_infinite_alternate_reverse]"></div>
        <div className="blob w-[400px] h-[400px] bg-yellow-100 rounded-full mix-blend-multiply blur-3xl top-[40%] left-[30%] animate-[move_18s_infinite]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl">
              🌈
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                EmoPulse <span className="text-indigo-600">AI</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium">智能情绪感知系统</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-white shadow-sm text-xs font-bold text-slate-600">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>基于深度学习模型</span>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Input Section */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="glass-panel rounded-[32px] p-8 transition-all hover:shadow-lg hover:shadow-indigo-500/10">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4">
                <MessageSquareText className="w-4 h-4 text-indigo-500" />
                输入分析文本
              </label>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="在这里输入一段文字，例如你今天的心情、一段对话或者日记..."
                className="w-full h-48 bg-white/50 border-2 border-slate-100 rounded-2xl p-5 text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none resize-none transition-all text-lg shadow-inner"
              />

              <div className="mt-6">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !inputText.trim()}
                  className={`
                    w-full relative overflow-hidden rounded-2xl py-4 font-bold text-white text-lg shadow-xl shadow-indigo-500/20 transition-all duration-300
                    ${loading || !inputText.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-[1.02] active:scale-[0.98]'}
                  `}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? '分析中...' : '开始解读情绪'}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </span>
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="glass-panel rounded-[32px] p-6 flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  最近记录
                </h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="group flex items-center gap-3 p-3 rounded-2xl bg-white/40 hover:bg-white border border-transparent hover:border-indigo-100 cursor-pointer transition-all hover:shadow-md"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-white shadow-sm group-hover:scale-110 transition-transform">
                      {item.result.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-bold text-slate-800">{item.result.primaryEmotion}</span>
                        <span className="text-[10px] text-slate-400">{new Date(item.timestamp).getHours()}:{new Date(item.timestamp).getMinutes().toString().padStart(2, '0')}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{item.text}</p>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    暂无分析记录
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Results Section */}
          <div className="lg:col-span-7" ref={resultsRef}>
            {loading ? (
              <div className="h-full min-h-[600px] flex items-center justify-center glass-panel rounded-[40px]">
                <Loader />
              </div>
            ) : error ? (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center glass-panel rounded-[40px] text-center p-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 text-4xl">🚫</div>
                <p className="text-red-500 font-bold">{error}</p>
              </div>
            ) : result ? (
              <div className="space-y-6 animate-[fadeIn_0.6s_ease-out]">
                
                {/* Hero Card */}
                <div className="glass-panel rounded-[40px] p-8 relative overflow-hidden">
                  <div 
                    className="absolute top-0 right-0 w-96 h-96 blur-3xl opacity-20 rounded-full pointer-events-none"
                    style={{ backgroundColor: result.colorHex }}
                  ></div>

                  <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Dynamic Big Emoji */}
                    <div className="flex-shrink-0">
                      <div 
                        className="w-40 h-40 rounded-[32px] flex items-center justify-center text-8xl shadow-2xl transform hover:rotate-6 transition-transform duration-300 bg-white"
                        style={{ color: result.colorHex }}
                      >
                        {result.emoji}
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/60 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border border-white">
                        核心情绪
                      </div>
                      <h1 className="text-5xl font-black text-slate-800 mb-2" style={{ color: result.colorHex }}>
                        {result.primaryEmotion}
                      </h1>
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                        <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden max-w-[200px]">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                            style={{ width: `${result.intensity}%`, backgroundColor: result.colorHex }}
                          ></div>
                        </div>
                        <span className="text-xl font-bold text-slate-600">{result.intensity}%</span>
                      </div>
                      
                      <div className="bg-white/50 p-4 rounded-2xl border border-white/60">
                        <p className="text-slate-700 text-sm leading-relaxed font-medium">
                          "{result.suggestion}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Radar Chart */}
                  <div className="glass-panel rounded-[32px] p-6">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-indigo-500" />
                          情绪光谱
                        </h3>
                     </div>
                     <div className="-ml-4">
                       <EmotionRadar data={result.breakdown} accentColor={result.colorHex} />
                     </div>
                  </div>

                  {/* Details & Sentiment */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Sentiment Meter */}
                    <div className="glass-panel rounded-[32px] p-6">
                      <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-500" />
                        情感极性
                      </h3>
                      <div className="relative pt-6 pb-2">
                         <div className="h-4 w-full bg-gradient-to-r from-rose-400 via-slate-200 to-emerald-400 rounded-full"></div>
                         <div 
                            className="absolute top-2 w-6 h-10 bg-white border-4 border-slate-800 rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-700 ease-out flex items-center justify-center"
                            style={{ left: `${(result.sentimentScore + 100) / 2}%` }}
                         >
                           <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
                         </div>
                         <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                           <span>消极</span>
                           <span>中性</span>
                           <span>积极</span>
                         </div>
                      </div>
                      <div className="text-center mt-2">
                        <span className={`text-2xl font-black ${result.sentimentScore > 0 ? 'text-emerald-500' : result.sentimentScore < 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                           {result.sentimentScore > 0 ? '+' : ''}{result.sentimentScore}
                        </span>
                      </div>
                    </div>

                    {/* Keywords */}
                    <div className="glass-panel rounded-[32px] p-6 flex-1">
                      <h3 className="font-bold text-slate-700 mb-4">关键词提取</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.map((word, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1.5 bg-white rounded-xl border border-slate-100 text-slate-600 text-sm font-bold shadow-sm hover:scale-105 transition-transform cursor-default"
                          >
                            #{word}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full min-h-[600px] glass-panel rounded-[40px] flex flex-col items-center justify-center text-center p-12">
                <div className="w-32 h-32 bg-gradient-to-tr from-indigo-50 to-purple-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                  <Sparkles className="w-16 h-16 text-indigo-300" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4">准备好探索内心了吗？</h2>
                <p className="text-slate-500 max-w-md text-lg leading-relaxed">
                  我们的AI模型将深入分析您的文本，为您提供精准的情绪图谱、色彩建议和心理学见解。
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;