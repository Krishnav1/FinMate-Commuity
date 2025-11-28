
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
  X,
  Layers,
  Activity,
  List,
  ChevronDown,
  Plus,
  Minus,
  BarChart2
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';

// --- Types & Mock Data Generators ---

interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vol: number;
  sma20?: number;
  ema50?: number;
  upperBand?: number;
  lowerBand?: number;
}

const generateInitialData = (basePrice: number = 22400): ChartDataPoint[] => {
  let price = basePrice;
  const data: ChartDataPoint[] = [];
  
  for (let i = 0; i < 60; i++) {
    const move = (Math.random() - 0.5) * 20;
    price += move;
    const vol = Math.floor(Math.random() * 5000) + 1000;
    
    // Indicators Simulation
    const sma20 = price + (Math.sin(i / 5) * 10); 
    const ema50 = price + (Math.cos(i / 10) * 20);
    const upperBand = price + 30 + (Math.random() * 5);
    const lowerBand = price - 30 - (Math.random() * 5);

    data.push({
      time: `10:${i < 10 ? '0' + i : i}`,
      open: price - Math.random() * 5,
      high: price + Math.random() * 10,
      low: price - Math.random() * 10,
      close: price,
      vol,
      sma20,
      ema50,
      upperBand,
      lowerBand
    });
  }
  return data;
};

const WATCHLIST = [
  { symbol: 'NIFTY 50', price: 22450.50, change: 0.45 },
  { symbol: 'BANKNIFTY', price: 47800.10, change: -0.12 },
  { symbol: 'RELIANCE', price: 2980.00, change: 1.20 },
  { symbol: 'HDFCBANK', price: 1450.75, change: -0.50 },
  { symbol: 'INFY', price: 1650.00, change: 0.80 },
  { symbol: 'TATASTEEL', price: 155.40, change: 2.10 },
  { symbol: 'ADANIENT', price: 3120.00, change: -1.50 },
];

const ChartStudio: React.FC = () => {
  const { addSignal } = useApp();
  
  // State
  const [symbol, setSymbol] = useState('NIFTY 50');
  const [timeframe, setTimeframe] = useState('15m');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [data, setData] = useState<ChartDataPoint[]>(generateInitialData());
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['vol']);
  const [showWatchlist, setShowWatchlist] = useState(true);
  
  // AI State
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Trading Panel State
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [qty, setQty] = useState(50);

  // Live Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const last = {...newData[newData.length - 1]};
        const move = (Math.random() - 0.5) * 5;
        
        last.close += move;
        last.high = Math.max(last.high, last.close);
        last.low = Math.min(last.low, last.close);
        last.vol += Math.floor(Math.random() * 50);
        
        // Update indicators roughly
        last.sma20 = last.close + (Math.random() * 2);
        
        newData[newData.length - 1] = last;
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleIndicator = (id: string) => {
    setActiveIndicators(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleQuickTrade = () => {
    const currentPrice = data[data.length - 1].close;
    const sl = orderType === 'BUY' ? currentPrice * 0.99 : currentPrice * 1.01;
    const tp = orderType === 'BUY' ? currentPrice * 1.02 : currentPrice * 0.98;

    addSignal({
      id: `sig-${Date.now()}`,
      symbol: symbol,
      type: orderType,
      entry: parseFloat(currentPrice.toFixed(2)),
      stopLoss: parseFloat(sl.toFixed(2)),
      targets: [parseFloat(tp.toFixed(2))],
      status: 'ACTIVE',
      timestamp: 'Just now',
      createdAt: Date.now(),
      confidence: 'Medium',
      notes: `Quick Execution from Chart Studio. Qty: ${qty}`
    });

    alert(`Order Placed: ${orderType} ${symbol} @ ${currentPrice.toFixed(2)}`);
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const text = await generateMarketAnalysis(symbol, timeframe);
    setAiAnalysis(text);
    setIsAnalyzing(false);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      
      {/* Left Toolbar (Tools) */}
      <div className="w-12 border-r border-slate-800 bg-slate-900 flex flex-col items-center py-4 gap-4 z-10">
        <button className="p-2 rounded hover:bg-slate-800 text-indigo-400 bg-indigo-500/10" title="Cursor"><MousePointer2 size={18} /></button>
        <div className="w-6 h-px bg-slate-800"></div>
        <button className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white" title="Trendline"><TrendingUp size={18} /></button>
        <button className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white" title="Fib Retracement"><Activity size={18} /></button>
        <button className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white" title="Brush"><Pencil size={18} /></button>
        <button className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white" title="Text"><List size={18} /></button>
        <div className="w-6 h-px bg-slate-800"></div>
        <button className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white" title="Eraser"><Eraser size={18} /></button>
        <div className="mt-auto">
          <button className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white"><Settings size={18} /></button>
        </div>
      </div>

      {/* Center: Chart Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Top Toolbar */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-1.5 rounded transition-colors" onClick={() => setShowWatchlist(!showWatchlist)}>
              <span className="font-bold text-lg text-white">{symbol}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex bg-slate-800 rounded-lg p-0.5">
              {['1m', '5m', '15m', '1h', 'D'].map(tf => (
                <button 
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeframe === tf ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center gap-1">
               <button 
                 onClick={() => setChartType('area')}
                 className={`p-1.5 rounded ${chartType === 'area' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white'}`}
               >
                 <Activity size={18} />
               </button>
               <button 
                 onClick={() => setChartType('line')}
                 className={`p-1.5 rounded ${chartType === 'line' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white'}`}
               >
                 <TrendingUp size={18} />
               </button>
            </div>
            <div className="h-6 w-px bg-slate-700"></div>
            
            {/* Indicators Dropdown Simulation */}
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => toggleIndicator('sma20')}
                 className={`px-2 py-1 text-xs rounded border ${activeIndicators.includes('sma20') ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
               >
                 SMA 20
               </button>
               <button 
                 onClick={() => toggleIndicator('ema50')}
                 className={`px-2 py-1 text-xs rounded border ${activeIndicators.includes('ema50') ? 'border-blue-500 text-blue-500 bg-blue-500/10' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
               >
                 EMA 50
               </button>
               <button 
                 onClick={() => toggleIndicator('bb')}
                 className={`px-2 py-1 text-xs rounded border ${activeIndicators.includes('bb') ? 'border-purple-500 text-purple-500 bg-purple-500/10' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
               >
                 Bollinger
               </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={handleAiAnalysis}
               className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
             >
               <Sparkles size={14} className={isAnalyzing ? 'animate-spin' : ''} />
               {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
             </button>
             <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded">
               <Camera size={18} />
             </button>
             <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded">
               <Maximize2 size={18} />
             </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="flex-1 bg-[#0b1221] relative">
           <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <defs>
                    <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                 <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                 <YAxis 
                   domain={['auto', 'auto']} 
                   stroke="#475569" 
                   orientation="right" 
                   fontSize={11} 
                   tickLine={false} 
                   axisLine={false} 
                   tickFormatter={(val) => val.toFixed(1)}
                 />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: '12px' }}
                   itemStyle={{ color: '#fff' }}
                   formatter={(value: any) => parseFloat(value).toFixed(2)}
                 />
                 <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                 
                 {/* Main Price Line/Area */}
                 {chartType === 'area' ? (
                   <Area type="monotone" dataKey="close" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorClose)" name={symbol} />
                 ) : (
                   <Line type="monotone" dataKey="close" stroke="#6366f1" strokeWidth={2} dot={false} name={symbol} />
                 )}

                 {/* Indicators */}
                 {activeIndicators.includes('sma20') && (
                   <Line type="monotone" dataKey="sma20" stroke="#eab308" strokeWidth={1} dot={false} name="SMA 20" />
                 )}
                 {activeIndicators.includes('ema50') && (
                   <Line type="monotone" dataKey="ema50" stroke="#3b82f6" strokeWidth={1} dot={false} name="EMA 50" />
                 )}
                 {activeIndicators.includes('bb') && (
                    <>
                       <Line type="monotone" dataKey="upperBand" stroke="#a855f7" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Upper" />
                       <Line type="monotone" dataKey="lowerBand" stroke="#a855f7" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Lower" />
                    </>
                 )}
                 
                 {/* Volume Bar */}
                 {activeIndicators.includes('vol') && (
                   <Bar dataKey="vol" barSize={2} fill="#334155" yAxisId={0} name="Volume" />
                 )}
              </ComposedChart>
           </ResponsiveContainer>

           {/* AI Analysis Overlay */}
           {aiAnalysis && (
              <div className="absolute top-4 left-4 max-w-sm bg-slate-900/90 backdrop-blur border border-indigo-500/50 rounded-xl shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                       <Sparkles size={12} /> GEMINI INSIGHT
                    </h3>
                    <button onClick={() => setAiAnalysis(null)} className="text-slate-500 hover:text-white"><X size={14} /></button>
                 </div>
                 <p className="text-xs text-slate-300 leading-relaxed">{aiAnalysis}</p>
                 <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 rounded transition-colors">
                       Generate Signal
                    </button>
                 </div>
              </div>
           )}
        </div>
      </div>

      {/* Right Panel: Watchlist & Quick Trade */}
      {showWatchlist && (
        <div className="w-72 border-l border-slate-800 bg-slate-900 flex flex-col">
          
          {/* Watchlist Section */}
          <div className="flex-1 flex flex-col min-h-0 border-b border-slate-800">
             <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                   <List size={14} /> Watchlist
                </h3>
                <button className="text-slate-500 hover:text-white"><Plus size={16} /></button>
             </div>
             <div className="flex-1 overflow-y-auto">
                {WATCHLIST.map((item, idx) => (
                   <div 
                     key={idx} 
                     onClick={() => setSymbol(item.symbol)}
                     className={`p-3 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors ${symbol === item.symbol ? 'bg-slate-800 border-l-2 border-l-indigo-500' : ''}`}
                   >
                      <div className="flex justify-between items-center mb-1">
                         <span className={`text-sm font-bold ${symbol === item.symbol ? 'text-white' : 'text-slate-300'}`}>{item.symbol}</span>
                         <span className={`text-sm font-mono ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {item.price.toFixed(2)}
                         </span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] text-slate-500">NSE</span>
                         <span className={`text-[10px] ${item.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {item.change >= 0 ? '+' : ''}{item.change}%
                         </span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Quick Trading Panel */}
          <div className="p-4 bg-slate-800/50">
             <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BarChart2 size={14} /> Quick Execution
             </h3>
             
             <div className="flex gap-2 mb-3">
                <button 
                  onClick={() => setOrderType('BUY')}
                  className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${orderType === 'BUY' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                >
                  BUY
                </button>
                <button 
                  onClick={() => setOrderType('SELL')}
                  className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${orderType === 'SELL' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                >
                  SELL
                </button>
             </div>
             
             <div className="flex items-center justify-between mb-4 bg-slate-900 rounded border border-slate-700 p-2">
                <span className="text-xs text-slate-400">Qty</span>
                <div className="flex items-center gap-3">
                   <button onClick={() => setQty(Math.max(1, qty - 25))} className="text-slate-400 hover:text-white"><Minus size={14} /></button>
                   <span className="text-sm font-bold text-white w-8 text-center">{qty}</span>
                   <button onClick={() => setQty(qty + 25)} className="text-slate-400 hover:text-white"><Plus size={14} /></button>
                </div>
             </div>

             <button 
               onClick={handleQuickTrade}
               className={`w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-lg active:scale-95 ${orderType === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}
             >
                {orderType} {symbol}
             </button>
             <p className="text-[10px] text-slate-500 text-center mt-2">
                Simulated Order • Market Price
             </p>
          </div>

        </div>
      )}

    </div>
  );
};

export default ChartStudio;
