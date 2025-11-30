

import React, { useState } from 'react';
import { generateMarketAnalysis } from '../services/geminiService';
import { 
  Sparkles,
  BarChart2,
  List,
  Plus,
  Minus,
  X,
  Zap,
  TrendingUp,
  ArrowRight,
  Repeat,
  Video,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Layout,
  Layers,
  Palette,
  Eye,
  MousePointer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdvancedRealTimeChart, TechnicalAnalysis } from './TradingViewWidgets';
import { View, CreatorPersona, ContentRecommendation } from '../types';

// Simple Watchlist for the sidebar (Interactive with TV chart)
const WATCHLIST = [
  { symbol: 'NSE:NIFTY', name: 'NIFTY 50' },
  { symbol: 'NSE:BANKNIFTY', name: 'BANK NIFTY' },
  { symbol: 'NSE:RELIANCE', name: 'RELIANCE' },
  { symbol: 'NSE:HDFCBANK', name: 'HDFC BANK' },
  { symbol: 'NSE:INFY', name: 'INFOSYS' },
  { symbol: 'NSE:TATASTEEL', name: 'TATA STEEL' },
  { symbol: 'BINANCE:BTCUSDT', name: 'BITCOIN' },
];

const ChartStudio: React.FC<{ onNavigate?: (view: View) => void }> = ({ onNavigate }) => {
  const { addSignal, user, recommendations, setActiveDraft } = useApp();
  
  // State
  const [symbol, setSymbol] = useState('NSE:NIFTY');
  const [showWatchlist, setShowWatchlist] = useState(true);
  
  // AI State
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Trading Panel State
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [qty, setQty] = useState(50);

  const handleQuickTrade = () => {
    // Note: In a real TV widget, we can't easily extract the exact price from the iframe 
    // without the paid library API. For this demo, we mock the price based on symbol.
    const mockPrice = 22450.00; 

    const sl = orderType === 'BUY' ? mockPrice * 0.99 : mockPrice * 1.01;
    const tp = orderType === 'BUY' ? mockPrice * 1.02 : mockPrice * 0.98;

    addSignal({
      id: `sig-${Date.now()}`,
      symbol: symbol.split(':')[1] || symbol,
      type: orderType,
      entry: parseFloat(mockPrice.toFixed(2)),
      stopLoss: parseFloat(sl.toFixed(2)),
      targets: [parseFloat(tp.toFixed(2))],
      status: 'ACTIVE',
      timestamp: 'Just now',
      createdAt: Date.now(),
      confidence: 'Medium',
      notes: `Quick Execution from Chart Studio. Qty: ${qty}`
    });

    alert(`Order Placed: ${orderType} ${symbol} @ Market`);
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    // Remove exchange prefix for cleaner prompt
    const cleanSymbol = symbol.split(':')[1] || symbol;
    const text = await generateMarketAnalysis(cleanSymbol, '15m');
    setAiAnalysis(text);
    setIsAnalyzing(false);
  };

  const handleExecuteRecommendation = (rec: ContentRecommendation) => {
      setActiveDraft({
          title: rec.title,
          text: rec.suggestedDraft,
          platforms: ['LINKEDIN'],
          strategyOrigin: rec.actionType
      });
      // We assume onNavigate is passed down (if not, in a real app we'd use routing)
      // For this demo structure, if onNavigate exists (from Dashboard usually) we use it, 
      // but ChartStudio might be top level. 
      // We will assume the Sidebar handles view switching, but here we want to force switch.
      // Since we don't have access to setView here easily without prop drilling from App,
      // We rely on the user navigating manually or we could add onNavigate prop to ChartStudio.
      alert(`Draft created for "${rec.title}". Go to Content Studio to publish!`);
  };

  // --- ANALYST VIEW: GROWTH RECOMMENDATION ENGINE ---
  if (user.persona !== CreatorPersona.TRADER) {
      return (
          <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 overflow-y-auto pr-2 custom-scrollbar">
              {/* HEADER */}
              <div className="flex justify-between items-end">
                  <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                          <Zap className="text-amber-400" /> Growth Intelligence
                      </h2>
                      <p className="text-slate-400 text-sm">Strategic content recommendations based on deep DNA analysis.</p>
                  </div>
                  <div className="flex gap-4">
                      <div className="text-right">
                          <p className="text-xs text-slate-500 uppercase font-bold">Avg Engagement</p>
                          <p className="text-xl font-bold text-white">8.4% <span className="text-emerald-400 text-sm">(+1.2%)</span></p>
                      </div>
                      <div className="text-right">
                          <p className="text-xs text-slate-500 uppercase font-bold">Top Format</p>
                          <p className="text-xl font-bold text-white">Carousel</p>
                      </div>
                  </div>
              </div>

              {/* SECTION 1: CONTENT DNA LAB */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                 <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="text-purple-400" size={16} /> Content DNA Lab
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* FORMAT DNA */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                       <p className="text-xs text-slate-400 uppercase font-bold mb-3 flex items-center gap-2"><Layers size={14}/> Format Efficacy</p>
                       <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                             <span className="text-slate-300">Carousels</span>
                             <div className="flex items-center gap-2">
                                <div className="w-24 bg-slate-800 rounded-full h-2"><div className="w-[85%] bg-emerald-500 h-2 rounded-full"></div></div>
                                <span className="font-bold text-white">8.5%</span>
                             </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                             <span className="text-slate-300">Video</span>
                             <div className="flex items-center gap-2">
                                <div className="w-24 bg-slate-800 rounded-full h-2"><div className="w-[60%] bg-indigo-500 h-2 rounded-full"></div></div>
                                <span className="font-bold text-white">6.0%</span>
                             </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                             <span className="text-slate-300">Text Only</span>
                             <div className="flex items-center gap-2">
                                <div className="w-24 bg-slate-800 rounded-full h-2"><div className="w-[20%] bg-rose-500 h-2 rounded-full"></div></div>
                                <span className="font-bold text-white">2.0%</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* HOOK DNA */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                       <p className="text-xs text-slate-400 uppercase font-bold mb-3 flex items-center gap-2"><MousePointer size={14}/> Hook Analysis</p>
                       <div className="flex items-center gap-4 mb-2">
                          <div className="flex-1 bg-slate-800 p-2 rounded text-center">
                             <span className="block text-[10px] text-slate-400 uppercase">Questions</span>
                             <span className="text-lg font-bold text-emerald-400">4.2% CTR</span>
                          </div>
                          <div className="flex-1 bg-slate-800 p-2 rounded text-center">
                             <span className="block text-[10px] text-slate-400 uppercase">Statements</span>
                             <span className="text-lg font-bold text-slate-400">1.8% CTR</span>
                          </div>
                       </div>
                       <p className="text-[10px] text-slate-400 italic text-center mt-2">
                          Insight: "Is HDFC..." works 2.3x better than "HDFC is..."
                       </p>
                    </div>

                    {/* VISUAL DNA */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                       <p className="text-xs text-slate-400 uppercase font-bold mb-3 flex items-center gap-2"><Palette size={14}/> Visual Style</p>
                       <div className="flex gap-2">
                          <div className="flex-1 bg-[#1e293b] p-2 rounded border border-slate-600 text-center">
                             <div className="w-full h-8 bg-blue-900/50 mb-1 rounded"></div>
                             <span className="text-[10px] font-bold text-white">Corporate</span>
                             <span className="block text-[10px] text-emerald-400">+45% Saves</span>
                          </div>
                          <div className="flex-1 bg-[#1e293b] p-2 rounded border border-slate-600 text-center opacity-60">
                             <div className="w-full h-8 bg-white/10 mb-1 rounded"></div>
                             <span className="text-[10px] font-bold text-white">Minimalist</span>
                             <span className="block text-[10px] text-slate-400">Baseline</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* SECTION 2: WIN VS LOSS ANALYSIS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px]">
                  {/* WINNER */}
                  <div className="bg-emerald-900/10 border border-emerald-500/30 rounded-xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 bg-emerald-500 text-black text-xs font-bold rounded-bl-xl">TOP PERFORMER</div>
                      <div className="flex items-start gap-3 mb-4">
                          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><ThumbsUp size={20} /></div>
                          <div>
                              <h3 className="font-bold text-white text-lg">HDFC Bank Analysis</h3>
                              <p className="text-xs text-slate-400">Posted 2 days ago • <span className="text-emerald-400 font-bold">Carousel (7 Slides)</span></p>
                          </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-slate-900/50 p-2 rounded border border-emerald-500/20 text-center">
                              <p className="text-xs text-slate-400">Dwell Time</p>
                              <p className="font-bold text-white">45s</p>
                          </div>
                          <div className="bg-slate-900/50 p-2 rounded border border-emerald-500/20 text-center">
                              <p className="text-xs text-slate-400">Saves</p>
                              <p className="font-bold text-white">120</p>
                          </div>
                          <div className="bg-slate-900/50 p-2 rounded border border-emerald-500/20 text-center">
                              <p className="text-xs text-slate-400">Scroll %</p>
                              <p className="font-bold text-white">85%</p>
                          </div>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                          <p className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1"><Sparkles size={10} /> AI Insight</p>
                          <p className="text-xs text-slate-300 leading-relaxed">
                              This post worked because you used a <span className="text-white font-bold">Question Hook</span> ("Is HDFC Dead?") combined with <span className="text-white font-bold">Corporate Style</span> visuals.
                          </p>
                      </div>
                  </div>

                  {/* LOSER */}
                  <div className="bg-rose-900/10 border border-rose-500/30 rounded-xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 bg-rose-500 text-white text-xs font-bold rounded-bl-xl">NEEDS WORK</div>
                      <div className="flex items-start gap-3 mb-4">
                          <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><ThumbsDown size={20} /></div>
                          <div>
                              <h3 className="font-bold text-white text-lg">Macro Alert: Inflation</h3>
                              <p className="text-xs text-slate-400">Posted 5 days ago • Text Only</p>
                          </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-slate-900/50 p-2 rounded border border-rose-500/20 text-center">
                              <p className="text-xs text-slate-400">Dwell Time</p>
                              <p className="font-bold text-white">4s</p>
                          </div>
                          <div className="bg-slate-900/50 p-2 rounded border border-rose-500/20 text-center">
                              <p className="text-xs text-slate-400">Saves</p>
                              <p className="font-bold text-white">2</p>
                          </div>
                          <div className="bg-slate-900/50 p-2 rounded border border-rose-500/20 text-center">
                              <p className="text-xs text-slate-400">Scroll %</p>
                              <p className="font-bold text-white">20%</p>
                          </div>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                          <p className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1"><Sparkles size={10} /> AI Insight</p>
                          <p className="text-xs text-slate-300 leading-relaxed">
                              Text blocks over 5 lines see <span className="text-white font-bold">40% drop-off</span>. The "Urgent" tone was good, but the format killed retention.
                          </p>
                      </div>
                  </div>
              </div>

              {/* SECTION 3: AI RECOMMENDATIONS */}
              <div className="flex-1 pb-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="text-indigo-400" /> Strategic Recommendations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {recommendations.map((rec, i) => (
                          <div key={rec.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-indigo-500 transition-colors group flex flex-col h-full shadow-lg">
                              <div className="flex justify-between items-start mb-3">
                                  <div className={`p-2 rounded-lg ${
                                      rec.actionType === 'REPURPOSE' ? 'bg-blue-500/20 text-blue-400' :
                                      rec.actionType === 'TREND_JACK' ? 'bg-amber-500/20 text-amber-400' :
                                      'bg-purple-500/20 text-purple-400'
                                  }`}>
                                      {rec.actionType === 'REPURPOSE' && <Repeat size={20} />}
                                      {rec.actionType === 'TREND_JACK' && <Zap size={20} />}
                                      {rec.actionType === 'FORMAT_PIVOT' && <Video size={20} />}
                                      {rec.actionType === 'DEEP_DIVE' && <Eye size={20} />}
                                  </div>
                                  {rec.expectedImpact === 'High' && (
                                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-500/20 font-bold uppercase">High Impact</span>
                                  )}
                              </div>
                              <h4 className="font-bold text-white text-base mb-2 group-hover:text-indigo-400 transition-colors">{rec.title}</h4>
                              <p className="text-xs text-slate-400 mb-4 flex-1 leading-relaxed">{rec.reason}</p>
                              
                              <div className="mt-auto pt-4 border-t border-slate-700">
                                  <button 
                                      onClick={() => handleExecuteRecommendation(rec)}
                                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                  >
                                      Execute Idea <ArrowRight size={12} />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // --- TRADER VIEW: TRADINGVIEW CHART ---
  return (
    <div className="h-[calc(100vh-2rem)] flex bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      
      {/* Center: Chart Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Top Bar overlay for AI */}
        <div className="absolute top-4 right-16 z-20">
           <button 
               onClick={handleAiAnalysis}
               className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
             >
               <Sparkles size={16} className={isAnalyzing ? 'animate-spin' : ''} />
               {isAnalyzing ? 'Analyzing Chart...' : 'Ask AI Analyst'}
             </button>
        </div>

        {/* TRADINGVIEW WIDGET */}
        <div className="flex-1 bg-[#131722] relative z-10">
           <AdvancedRealTimeChart symbol={symbol} theme="dark" />

           {/* AI Analysis Overlay */}
           {aiAnalysis && (
              <div className="absolute top-16 right-16 max-w-sm bg-slate-900/95 backdrop-blur border border-indigo-500/50 rounded-xl shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300 z-50">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                       <Sparkles size={12} /> GEMINI INSIGHT
                    </h3>
                    <button onClick={() => setAiAnalysis(null)} className="text-slate-500 hover:text-white"><X size={14} /></button>
                 </div>
                 <p className="text-xs text-slate-300 leading-relaxed">{aiAnalysis}</p>
                 <div className="mt-3 flex gap-2">
                    <button onClick={() => setAiAnalysis(null)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 rounded transition-colors">
                       Copy to Signal Composer
                    </button>
                 </div>
              </div>
           )}
        </div>
      </div>

      {/* Right Panel: Watchlist & Quick Trade */}
      {showWatchlist && (
        <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col">
          
          {/* Watchlist Section */}
          <div className="flex-1 flex flex-col min-h-0 border-b border-slate-800">
             <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
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
                      <div className="flex justify-between items-center">
                         <span className={`text-sm font-bold ${symbol === item.symbol ? 'text-white' : 'text-slate-300'}`}>{item.name}</span>
                         <span className="text-[10px] text-slate-500">{item.symbol.split(':')[0]}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Technical Analysis Widget */}
          <div className="h-64 border-b border-slate-800 bg-[#131722] p-2">
             <TechnicalAnalysis symbol={symbol} />
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
                {orderType} {symbol.split(':')[1] || symbol}
             </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default ChartStudio;