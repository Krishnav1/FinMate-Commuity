import React, { useState, useEffect } from 'react';
import { generateMarketAnalysis } from '../services/geminiService';
import { 
  Pencil, 
  Maximize2, 
  Settings, 
  Camera, 
  Eraser, 
  TrendingUp,
  MousePointer2,
  Share2,
  Sparkles,
  X
} from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Initial Mock candle data
const generateInitialData = () => Array.from({ length: 50 }, (_, i) => ({
  time: `10:${i < 10 ? '0' + i : i}`,
  open: 100 + Math.random() * 10 - 5,
  high: 100 + Math.random() * 15 - 5,
  low: 100 + Math.random() * 5 - 10,
  close: 100 + Math.random() * 10 - 5,
  vol: Math.floor(Math.random() * 1000)
}));

const ChartStudio: React.FC = () => {
  const [symbol, setSymbol] = useState('NIFTY 50');
  const [timeframe, setTimeframe] = useState('15m');
  const [data, setData] = useState(generateInitialData());
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Live Candle Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        const lastCandle = {...newData[newData.length - 1]};
        
        // Simulate live price movement
        const change = (Math.random() - 0.5) * 2;
        lastCandle.close += change;
        lastCandle.high = Math.max(lastCandle.high, lastCandle.close);
        lastCandle.low = Math.min(lastCandle.low, lastCandle.close);
        lastCandle.vol += Math.floor(Math.random() * 10);

        newData[newData.length - 1] = lastCandle;
        return newData;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    // In a real app, we would pass the chart data points to the AI
    const analysis = await generateMarketAnalysis(symbol, timeframe);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-slate-800 rounded-xl border border-slate-700 overflow-hidden relative">
      {/* Chart Toolbar */}
      <div className="h-12 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white">{symbol}</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
          </div>
          <div className="h-6 w-px bg-slate-700"></div>
          <div className="flex gap-1">
            {['1m', '5m', '15m', '1h', '4h', 'D'].map(tf => (
              <button 
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs font-medium rounded ${timeframe === tf ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={handleAiAnalysis}
             disabled={isAnalyzing}
             className="flex items-center gap-2 bg-slate-800 border border-slate-600 hover:border-indigo-500 text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded text-sm transition-all"
           >
             <Sparkles size={14} className={isAnalyzing ? 'animate-spin' : ''} />
             {isAnalyzing ? 'Analyzing...' : 'Ask AI'}
           </button>
           <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm transition-colors">
             <Share2 size={14} /> Publish Idea
           </button>
           <button className="text-slate-400 hover:text-white"><Settings size={18} /></button>
           <button className="text-slate-400 hover:text-white"><Camera size={18} /></button>
           <button className="text-slate-400 hover:text-white"><Maximize2 size={18} /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Drawing Tools */}
        <div className="w-12 border-r border-slate-700 bg-slate-900 flex flex-col items-center py-4 gap-4">
          <button className="p-2 rounded hover:bg-slate-800 text-indigo-400"><MousePointer2 size={20} /></button>
          <button className="p-2 rounded hover:bg-slate-800 text-slate-400"><TrendingUp size={20} /></button>
          <button className="p-2 rounded hover:bg-slate-800 text-slate-400"><Pencil size={20} /></button>
          <button className="p-2 rounded hover:bg-slate-800 text-slate-400"><Eraser size={20} /></button>
        </div>

        {/* Chart Area (Simulated with Recharts) */}
        <div className="flex-1 bg-slate-900 relative">
          <ResponsiveContainer width="100%" height="100%">
             <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                 <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#475569" orientation="right" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: any) => parseFloat(value).toFixed(2)}
              />
              <ReferenceLine y={105} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Resistance', position: 'right', fill: '#ef4444', fontSize: 10 }} />
              <ReferenceLine y={95} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Support', position: 'right', fill: '#10b981', fontSize: 10 }} />
              <Line type="monotone" dataKey="close" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Bar dataKey="vol" barSize={4} fill="#334155" yAxisId={0} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* AI Analysis Modal Overlay */}
          {aiAnalysis && (
            <div className="absolute top-4 right-16 w-80 bg-slate-800/95 backdrop-blur border border-indigo-500/50 rounded-xl shadow-2xl p-4 animate-in slide-in-from-top-4 fade-in duration-300">
               <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-2 text-indigo-400">
                   <Sparkles size={16} />
                   <h3 className="font-bold text-sm">Gemini Technical Outlook</h3>
                 </div>
                 <button onClick={() => setAiAnalysis(null)} className="text-slate-400 hover:text-white">
                   <X size={16} />
                 </button>
               </div>
               <p className="text-sm text-slate-200 leading-relaxed">
                 {aiAnalysis}
               </p>
               <div className="mt-3 flex gap-2">
                 <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 rounded transition-colors">
                   Copy to Signal
                 </button>
               </div>
            </div>
          )}
          
          {/* Chart Overlay Controls */}
          <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-700 shadow-xl pointer-events-none">
             <div className="text-xs text-slate-400 mb-1">AI Trend Detection</div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-sm font-bold text-white">Bullish Breakout</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartStudio;