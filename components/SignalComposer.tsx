import React, { useState } from 'react';
import { generateSignalDescription, generateMarketAnalysis } from '../services/geminiService';
import { Sparkles, Send, Copy, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

const SignalComposer: React.FC = () => {
  const [form, setForm] = useState({
    symbol: '',
    type: 'BUY',
    entry: '',
    sl: '',
    tp1: '',
    tp2: '',
    timeframe: '15m'
  });

  const [aiDescription, setAiDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState('');

  const handleGenerateAI = async () => {
    if (!form.symbol || !form.entry) return;
    setIsGenerating(true);
    
    // Parallel AI calls
    const descPromise = generateSignalDescription(
      form.symbol, 
      form.type, 
      Number(form.entry), 
      Number(form.sl), 
      [Number(form.tp1), Number(form.tp2)]
    );
    
    const analysisPromise = generateMarketAnalysis(form.symbol, form.timeframe);

    const [desc, analysisText] = await Promise.all([descPromise, analysisPromise]);
    
    setAiDescription(desc);
    setAnalysis(analysisText);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Left: Input Form */}
      <div className="space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-500" />
              Compose Signal
            </h2>
            <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              <ShieldCheck size={12} />
              SEBI Compliant Mode
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Instrument</label>
              <input 
                type="text" 
                value={form.symbol}
                onChange={e => setForm({...form, symbol: e.target.value.toUpperCase()})}
                placeholder="e.g. RELIANCE"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Action</label>
              <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                <button 
                  onClick={() => setForm({...form, type: 'BUY'})}
                  className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${form.type === 'BUY' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  BUY
                </button>
                <button 
                  onClick={() => setForm({...form, type: 'SELL'})}
                  className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${form.type === 'SELL' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  SELL
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Entry Price</label>
              <input 
                type="number" 
                value={form.entry}
                onChange={e => setForm({...form, entry: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Stop Loss</label>
              <input 
                type="number" 
                value={form.sl}
                onChange={e => setForm({...form, sl: e.target.value})}
                className="w-full bg-slate-900 border border-rose-900/50 rounded-lg p-2.5 text-rose-100 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target 1</label>
              <input 
                type="number" 
                value={form.tp1}
                onChange={e => setForm({...form, tp1: e.target.value})}
                className="w-full bg-slate-900 border border-emerald-900/50 rounded-lg p-2.5 text-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

           <div className="mb-6">
             <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-medium text-slate-400">AI Analysis & Description</label>
                <button 
                  onClick={handleGenerateAI}
                  disabled={!form.symbol || isGenerating}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                >
                  <Sparkles size={12} />
                  {isGenerating ? 'Thinking...' : 'Generate with Gemini'}
                </button>
             </div>
             <textarea 
               value={aiDescription}
               onChange={e => setAiDescription(e.target.value)}
               placeholder="Click generate to get AI insights..."
               className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
             />
             {analysis && (
               <div className="mt-2 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
                 <p className="text-xs text-indigo-200"><span className="font-bold">Gemini Insight:</span> {analysis}</p>
               </div>
             )}
           </div>

           <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/25 flex justify-center items-center gap-2">
             <Send size={18} />
             Publish Signal Now
           </button>
        </div>
      </div>

      {/* Right: Preview & Validation */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Channel Preview</h3>
        
        {/* Telegram Card Preview */}
        <div className="bg-[#182030] rounded-xl p-4 max-w-sm mx-auto shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-xs">
              FM
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">FinMate Official</h4>
              <p className="text-[10px] text-slate-400">Just now</p>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 mb-3">
            <div className="flex justify-between items-center mb-2">
               <span className="font-bold text-white text-lg">{form.symbol || 'SYMBOL'}</span>
               <span className={`text-xs font-bold px-2 py-0.5 rounded ${form.type === 'BUY' ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'}`}>
                 {form.type}
               </span>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Entry Zone:</span>
                <span className="font-mono text-white">{form.entry || '---'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                 <span>Stop Loss:</span>
                 <span className="font-mono text-rose-400">{form.sl || '---'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                 <span>Target 1:</span>
                 <span className="font-mono text-emerald-400">{form.tp1 || '---'}</span>
              </div>
            </div>
          </div>

          <p className="text-slate-300 text-sm mb-4 whitespace-pre-wrap">
            {aiDescription || "Waiting for signal details..."}
          </p>

          <div className="text-[10px] text-slate-500 text-center italic border-t border-slate-800 pt-2">
             Disclaimer: Not financial advice. SEBI Reg: INH0000XXXX
          </div>
        </div>

        {/* Validation Errors */}
        {!form.sl && form.entry && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex gap-3 items-start">
            <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" />
            <div>
              <h4 className="text-amber-400 text-sm font-bold">Missing Stop Loss</h4>
              <p className="text-amber-200/70 text-xs">For safety and compliance, every signal must have a defined SL.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalComposer;
