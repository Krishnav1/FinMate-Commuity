
import React, { useState, useEffect, useRef } from 'react';
import { CreatorPersona, ContentOpportunity, ChatMessage, NewsItem, PromptTemplate, FundamentalData } from '../types';
import { 
  Zap, TrendingUp, Lightbulb, Sparkles, PenTool, Search, MessageSquare, Send, Bot, ArrowRight, LayoutDashboard, Globe, List, Plus, X, Newspaper, ChevronRight, Wand2, FileText, Microscope, Share2, Copy, PieChart, BarChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { View } from '../types';
import { TickerTape, MarketOverview, StockHeatmap, AdvancedRealTimeChart } from './TradingViewWidgets';
import { generateContentFromData, generateHybridContent, runSmartTemplate, refineCanvasContent } from '../services/geminiService';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';

// --- SMART TEMPLATES LIBRARY ---
const PROMPT_TEMPLATES: PromptTemplate[] = [
    { id: '1', label: 'Earnings Decoder', description: 'Extract key metrics & guidance', icon: FileText, category: 'Fundamental', systemPrompt: 'Analyze the latest quarterly results. Extract Revenue, Net Profit, Margins, and Management Guidance. Summarize in 3 clear sections.' },
    { id: '2', label: 'Bull vs Bear', description: 'Create a balanced thesis', icon: TrendingUp, category: 'Fundamental', systemPrompt: 'Create a Bull Case vs Bear Case table for this stock based on current valuations and market sentiment.' },
    { id: '3', label: 'Viral Thread', description: 'Convert data to tweets', icon: Share2, category: 'Social', systemPrompt: 'Turn the recent news and price action into a 5-tweet viral thread with hooks, emojis and hashtags.' },
];

const Dashboard: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const { user, signals, updateSignal, reports, setActiveDraft, selectedSymbol, setSelectedSymbol, watchlist, currentFundamentalData, newsFeed, canvasContent, setCanvasContent } = useApp();

  // --- TRADER DASHBOARD (Existing) ---
  const TraderDashboard = () => {
    const activeSignals = signals.filter(s => s.status === 'ACTIVE');
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
         <div className="w-full bg-slate-900 border-y border-slate-800 overflow-hidden py-1 shadow-inner h-20">
             <TickerTape />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {['Revenue', 'Signals', 'Win Rate', 'Subscribers'].map((label, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg">
                   <p className="text-slate-400 text-xs font-semibold uppercase">{label}</p>
                   <h3 className="text-2xl font-bold text-white mt-1">{i === 0 ? '₹24k' : i === 1 ? '12' : i === 2 ? '78%' : '1.2k'}</h3>
                </div>
             ))}
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden h-[400px]">
               <MarketOverview />
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
               <h2 className="text-lg font-semibold text-white mb-4">Active Trades</h2>
               <div className="space-y-3 overflow-y-auto h-[320px]">
                  {activeSignals.map(signal => (
                     <div key={signal.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                        <div className="flex justify-between">
                           <span className="font-bold text-white">{signal.symbol}</span>
                           <span className={`text-xs px-2 rounded ${signal.type === 'BUY' ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'}`}>{signal.type}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                           <button onClick={() => updateSignal(signal.id, { status: 'HIT' })} className="flex-1 text-xs bg-emerald-500/20 text-emerald-400 py-1 rounded">Target</button>
                           <button onClick={() => updateSignal(signal.id, { status: 'STOPPED' })} className="flex-1 text-xs bg-rose-500/20 text-rose-400 py-1 rounded">Stop</button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    );
  };

  // --- NEW ANALYST DASHBOARD (Research Hub) ---
  const AnalystDashboard = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [magicPrompt, setMagicPrompt] = useState('');
    const [showMagicMenu, setShowMagicMenu] = useState(false);

    // Helpers
    const handleTemplateClick = async (template: PromptTemplate) => {
        setIsGenerating(true);
        setCanvasContent(''); 
        const result = await runSmartTemplate(selectedSymbol, template.systemPrompt, user.contentNiche);
        setCanvasContent(result);
        setIsGenerating(false);
    };

    const handleDataTrigger = async (dataContext: string) => {
        setIsGenerating(true);
        const prompt = `Draft a short, punchy social media insight specifically about this data point: ${dataContext}.`;
        const result = await runSmartTemplate(selectedSymbol, prompt, user.contentNiche);
        setCanvasContent(prev => prev + "\n\n" + result);
        setIsGenerating(false);
    };

    const handleRefine = async () => {
        if (!magicPrompt) return;
        setIsGenerating(true);
        const refined = await refineCanvasContent(canvasContent, magicPrompt);
        setCanvasContent(refined);
        setIsGenerating(false);
        setMagicPrompt('');
        setShowMagicMenu(false);
    };

    const handleSendToStudio = () => {
        setActiveDraft({
            symbol: selectedSymbol,
            text: canvasContent,
            platforms: ['LINKEDIN', 'TELEGRAM']
        });
        onNavigate(View.TRADE_FLOW);
    };

    if (!currentFundamentalData) return <div className="p-8 text-white">Loading Data...</div>;

    const data = currentFundamentalData;

    return (
      <div className="h-[calc(100vh-6rem)] flex flex-col animate-in fade-in duration-500">
         {/* HEADER */}
         <div className="flex justify-between items-center mb-4 px-1">
             <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <Microscope className="text-purple-400" size={20} /> Research Hub
                </h1>
                <p className="text-xs text-slate-400">Deep Fundamental Intelligence & Content Engine</p>
             </div>
             
             {/* COMPACT SEARCH */}
             <div className="relative group">
                 <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 w-64">
                    <Search size={14} className="text-slate-400 mr-2" />
                    <input 
                        type="text" 
                        value={selectedSymbol}
                        onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
                        className="bg-transparent border-none outline-none text-white text-sm font-bold w-full uppercase placeholder:text-slate-600"
                        placeholder="SEARCH (e.g. TCS)"
                    />
                 </div>
             </div>
         </div>

         {/* 3-PANE WORKSPACE */}
         <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
             
             {/* PANE 1: DATA INTELLIGENCE (Custom UI) */}
             <div className="col-span-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
                
                {/* 1. Header Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{data.companyName}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="bg-slate-700 text-xs px-2 py-0.5 rounded text-slate-300">{data.symbol}</span>
                                <span className="text-slate-400 text-xs">{data.sector}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-mono font-bold text-white">₹{data.currentPrice.toLocaleString()}</div>
                            <div className={`text-sm font-bold ${data.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {data.changePercent > 0 ? '+' : ''}{data.changePercent}%
                            </div>
                        </div>
                    </div>
                    {/* Alpha Signal */}
                    <div className="mt-4 bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg flex gap-3 items-start">
                        <Sparkles className="text-purple-400 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                            <p className="text-xs font-bold text-purple-300 uppercase mb-1">AI Alpha Signal</p>
                            <p className="text-sm text-slate-200 leading-snug">{data.alphaSignal}</p>
                        </div>
                        <button onClick={() => handleDataTrigger(data.alphaSignal)} className="ml-auto text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors">Draft</button>
                    </div>
                </div>

                {/* 2. Key Ratios Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'P/E Ratio', value: data.ratios.pe, color: 'text-white' },
                        { label: 'ROE %', value: `${data.ratios.roe}%`, color: 'text-emerald-400' },
                        { label: 'Div Yield', value: `${data.ratios.divYield}%`, color: 'text-amber-400' },
                        { label: 'Market Cap', value: data.marketCap, color: 'text-white' },
                        { label: 'P/B Ratio', value: data.ratios.pb, color: 'text-slate-300' },
                        { label: 'Debt/Eq', value: data.ratios.debtToEq, color: data.ratios.debtToEq > 1 ? 'text-rose-400' : 'text-emerald-400' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-800 border border-slate-700 p-3 rounded-xl relative group">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">{stat.label}</p>
                            <p className={`text-lg font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
                            <button 
                                onClick={() => handleDataTrigger(`${stat.label} is ${stat.value}`)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-slate-700 rounded text-purple-400 hover:text-white"
                                title="Draft insight on this"
                            >
                                <Sparkles size={10} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* 3. Financial Charts (Revenue/Profit) */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-300 text-sm flex items-center gap-2">
                            <BarChart size={14} /> Quarterly Performance
                        </h3>
                        <button onClick={() => handleDataTrigger("Analyze the quarterly revenue trend.")} className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300">Analyze Trend</button>
                    </div>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={data.quarterlyResults}>
                                <ReTooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }} />
                                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
                                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Net Profit" />
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Shareholding */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                     <div className="h-24 w-24 flex-shrink-0">
                        <ResponsiveContainer>
                            <RePieChart>
                                <Pie 
                                    data={[
                                        { name: 'Promoters', value: data.shareholding.promoters },
                                        { name: 'FII', value: data.shareholding.fii },
                                        { name: 'DII', value: data.shareholding.dii },
                                        { name: 'Public', value: data.shareholding.public },
                                    ]} 
                                    dataKey="value" innerRadius={25} outerRadius={40} paddingAngle={2}
                                >
                                    {[ '#8b5cf6', '#10b981', '#f59e0b', '#64748b' ].map((c, i) => <Cell key={i} fill={c} />)}
                                </Pie>
                            </RePieChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="flex-1">
                         <h3 className="text-xs font-bold text-slate-300 mb-2">Shareholding Pattern</h3>
                         <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Promoters</span> <span className="text-purple-400 font-bold">{data.shareholding.promoters}%</span></div>
                             <div className="flex justify-between text-[10px] text-slate-400"><span>FIIs</span> <span className="text-emerald-400 font-bold">{data.shareholding.fii}%</span></div>
                             <div className="flex justify-between text-[10px] text-slate-400"><span>DIIs</span> <span className="text-amber-400 font-bold">{data.shareholding.dii}%</span></div>
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Public</span> <span className="text-slate-300 font-bold">{data.shareholding.public}%</span></div>
                         </div>
                     </div>
                </div>

             </div>

             {/* PANE 2: PROMPTS (The Genie) */}
             <div className="col-span-3 flex flex-col gap-4">
                 <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex-1 flex flex-col h-full">
                     <div className="mb-4">
                         <h2 className="text-sm font-bold text-white mb-1">Smart Templates</h2>
                         <p className="text-xs text-slate-400">One-click analysis.</p>
                     </div>
                     <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-1">
                         {PROMPT_TEMPLATES.map(template => {
                             const Icon = template.icon;
                             return (
                                 <button
                                    key={template.id}
                                    onClick={() => handleTemplateClick(template)}
                                    className="text-left group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 p-3 rounded-lg transition-all flex items-start gap-3"
                                 >
                                     <div className="p-2 bg-slate-800 group-hover:bg-purple-500/10 rounded-lg text-slate-400 group-hover:text-purple-400 transition-colors">
                                         <Icon size={16} />
                                     </div>
                                     <div>
                                         <h3 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{template.label}</h3>
                                         <p className="text-[10px] text-slate-500 group-hover:text-slate-400 leading-tight mt-1">{template.description}</p>
                                     </div>
                                 </button>
                             )
                         })}
                     </div>
                     {/* News Context */}
                     <div className="mt-4 pt-4 border-t border-slate-700 flex-1">
                        <h3 className="text-xs font-bold text-slate-400 mb-2">Recent Headlines</h3>
                        <div className="space-y-2 overflow-y-auto max-h-48 custom-scrollbar">
                           {newsFeed.filter(n => n.symbol.includes(selectedSymbol)).map(n => (
                               <div key={n.id} onClick={() => handleDataTrigger(`News: ${n.headline}`)} className="p-2 bg-slate-900/50 border border-slate-800 rounded hover:border-indigo-500 cursor-pointer">
                                   <p className="text-[10px] text-white leading-snug">{n.headline}</p>
                                   <p className="text-[8px] text-slate-500 mt-1">{n.time} • {n.source}</p>
                               </div>
                           ))}
                        </div>
                     </div>
                 </div>
             </div>

             {/* PANE 3: THE CANVAS (Editor) */}
             <div className="col-span-4 flex flex-col">
                 <div className="bg-slate-900 border border-slate-700 rounded-xl flex flex-col h-full shadow-2xl relative overflow-hidden group">
                     {/* Canvas Header */}
                     <div className="bg-slate-800/50 border-b border-slate-800 p-3 flex justify-between items-center">
                         <div className="flex items-center gap-2">
                             <FileText size={14} className="text-slate-400" />
                             <span className="text-xs font-bold text-slate-300">Draft Content</span>
                         </div>
                         <div className="flex gap-2">
                             <button onClick={() => setCanvasContent('')} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700" title="Clear"><X size={14} /></button>
                             <button onClick={handleSendToStudio} className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1 rounded flex items-center gap-1">
                                 Open in Studio <ArrowRight size={10} />
                             </button>
                         </div>
                     </div>

                     {/* The Editor Area */}
                     <div className="flex-1 relative">
                         <textarea 
                             value={canvasContent}
                             onChange={(e) => setCanvasContent(e.target.value)}
                             placeholder="Select data points or templates to generate content..."
                             className="w-full h-full bg-[#0f172a] text-slate-300 p-6 text-sm leading-7 resize-none outline-none font-serif"
                             style={{ fontFamily: '"Merriweather", "Georgia", serif' }}
                         />
                         
                         {/* Loading Overlay */}
                         {isGenerating && (
                             <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px] flex items-end justify-center pb-8">
                                 <div className="bg-slate-800 text-purple-300 text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-purple-500/30 flex items-center gap-2">
                                     <Sparkles size={12} className="animate-spin" /> Genie is writing...
                                 </div>
                             </div>
                         )}

                         {/* Magic Wand Floating Button */}
                         {canvasContent && !isGenerating && (
                             <div className="absolute bottom-6 right-6">
                                 <div className="relative">
                                     {showMagicMenu && (
                                         <div className="absolute bottom-12 right-0 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 mb-2 animate-in slide-in-from-bottom-2">
                                             <p className="text-[10px] font-bold text-slate-400 px-2 mb-2 uppercase">Refine Selection</p>
                                             <div className="space-y-1">
                                                 {['Make it more professional', 'Expand on key points', 'Fix grammar & tone', 'Add emojis'].map(opt => (
                                                     <button key={opt} onClick={() => { setMagicPrompt(opt); handleRefine(); }} className="w-full text-left text-xs text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-1.5 rounded transition-colors">
                                                         {opt}
                                                     </button>
                                                 ))}
                                             </div>
                                         </div>
                                     )}
                                     <button 
                                         onClick={() => setShowMagicMenu(!showMagicMenu)}
                                         className="w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg shadow-purple-900/40 flex items-center justify-center transition-all hover:scale-105"
                                     >
                                         <Wand2 size={20} />
                                     </button>
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>
             </div>

         </div>
      </div>
    );
  };

  const EducatorDashboard = () => {
     return <div className="text-white">Educator View</div>;
  };

  return (
     <div className="min-h-full">
        {user.persona === CreatorPersona.TRADER && <TraderDashboard />}
        {user.persona === CreatorPersona.ANALYST && <AnalystDashboard />}
        {user.persona === CreatorPersona.EDUCATOR && <TraderDashboard />} 
     </div>
  );
};

export default Dashboard;
