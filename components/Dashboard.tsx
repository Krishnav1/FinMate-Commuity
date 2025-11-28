import React, { useState, useEffect } from 'react';
import { Metric, NewsItem, MarketTicker } from '../types';
import { 
  AlertCircle, 
  CheckCircle2,
  Newspaper,
  Zap,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, signals: 2 },
  { name: 'Tue', revenue: 3000, signals: 4 },
  { name: 'Wed', revenue: 5000, signals: 3 },
  { name: 'Thu', revenue: 2780, signals: 5 },
  { name: 'Fri', revenue: 6890, signals: 8 },
  { name: 'Sat', revenue: 2390, signals: 1 },
  { name: 'Sun', revenue: 3490, signals: 2 },
];

const INITIAL_NEWS: NewsItem[] = [
  { id: '1', headline: "RBI keeps repo rate unchanged at 6.5%", source: "FinWire", time: "2m ago", sentiment: "Neutral" },
  { id: '2', headline: "Nifty hits all-time high amidst global rally", source: "MarketPulse", time: "15m ago", sentiment: "Bullish" },
  { id: '3', headline: "Adani Ports sees 20% surge in cargo volume", source: "TradeNews", time: "1h ago", sentiment: "Bullish" },
  { id: '4', headline: "IT Sector faces headwinds due to US inflation", source: "GlobalEcon", time: "2h ago", sentiment: "Bearish" },
];

const POTENTIAL_NEWS = [
  { headline: "TCS announces massive buyback program worth ₹17,000 Cr", source: "TechDaily", sentiment: "Bullish" },
  { headline: "Oil prices surge as tensions rise in Middle East", source: "GlobalMarkets", sentiment: "Bearish" },
  { headline: "Fed Chair hints at potential rate cuts in Q4", source: "EcoTimes", sentiment: "Bullish" },
  { headline: "Crypto markets flash crash: Bitcoin down 5%", source: "CoinDesk", sentiment: "Bearish" },
  { headline: "Auto sales data shows robust growth in SUV segment", source: "AutoIndia", sentiment: "Bullish" }
];

const INITIAL_TICKERS: MarketTicker[] = [
  { symbol: 'NIFTY 50', price: 22450.00, change: 120.50 },
  { symbol: 'BANKNIFTY', price: 47800.00, change: -45.00 },
  { symbol: 'RELIANCE', price: 2980.00, change: 15.00 },
  { symbol: 'HDFCBANK', price: 1450.00, change: -12.00 },
  { symbol: 'TATASTEEL', price: 155.00, change: 2.50 },
];

const Dashboard: React.FC = () => {
  const [tickers, setTickers] = useState<MarketTicker[]>(INITIAL_TICKERS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Today Revenue', value: '₹24,500', change: '+12%', trend: 'up' },
    { label: 'Active Subscribers', value: '1,240', change: '+5%', trend: 'up' },
    { label: 'Signals Sent', value: '8', change: '0%', trend: 'neutral' },
    { label: 'Avg Win Rate', value: '76%', change: '-2%', trend: 'down' },
  ]);

  // Simulate Live Market Data
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prev => prev.map(t => ({
        ...t,
        price: t.price + (Math.random() - 0.5) * 5,
        change: t.change + (Math.random() - 0.5)
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate Live News Feed
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to add news every 5 seconds
        const randomNews = POTENTIAL_NEWS[Math.floor(Math.random() * POTENTIAL_NEWS.length)];
        const newItem: NewsItem = {
          id: Date.now().toString(),
          headline: randomNews.headline,
          source: randomNews.source,
          time: 'Just now',
          sentiment: randomNews.sentiment as any
        };
        setNews(prev => [newItem, ...prev.slice(0, 9)]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Creator Command Center</h1>
          <p className="text-slate-400 text-sm">Welcome back, Trading Wizard.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
           Download Report
        </button>
      </header>

      {/* Live Ticker Tape */}
      <div className="w-full bg-slate-900 border-y border-slate-800 overflow-hidden py-2 flex items-center shadow-inner">
         <div className="flex gap-8 whitespace-nowrap animate-marquee">
            {tickers.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-mono">
                <span className="font-bold text-slate-300">{t.symbol}</span>
                <span className={t.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {t.price.toFixed(2)}
                </span>
                <span className={`text-xs ${t.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.change >= 0 ? '▲' : '▼'} {Math.abs(t.change).toFixed(2)}
                </span>
              </div>
            ))}
             {/* Duplicate for seamless loop */}
             {tickers.map((t, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-2 text-sm font-mono">
                <span className="font-bold text-slate-300">{t.symbol}</span>
                <span className={t.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {t.price.toFixed(2)}
                </span>
                <span className={`text-xs ${t.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.change >= 0 ? '▲' : '▼'} {Math.abs(t.change).toFixed(2)}
                </span>
              </div>
            ))}
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors shadow-lg shadow-black/20">
            <p className="text-slate-400 text-sm font-medium mb-1">{metric.label}</p>
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                metric.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 
                metric.trend === 'down' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'
              }`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg shadow-black/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Revenue & Activity</h2>
            <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live News Feed */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col h-[400px] shadow-lg shadow-black/20">
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-indigo-500/10 p-2 rounded-lg">
                <Newspaper className="text-indigo-500 w-5 h-5" />
             </div>
             <div>
               <h2 className="text-lg font-semibold text-white leading-none">Live News Wire</h2>
               <p className="text-[10px] text-slate-400 mt-1">Real-time market updates</p>
             </div>
             <span className="ml-auto flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
             </span>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {news.map((item) => (
              <div key={item.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:bg-slate-700/50 transition-all cursor-pointer group animate-in slide-in-from-right-2 duration-300">
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                    {item.source}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    item.sentiment === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                    item.sentiment === 'Bearish' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {item.sentiment}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">
                  {item.headline}
                </h4>
                <div className="mt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-slate-500">{item.time}</span>
                  <ArrowRight className="w-3 h-3 text-indigo-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Action Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border border-indigo-500/30 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div>
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mb-4 text-white shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Create Quick Signal</h3>
              <p className="text-sm text-indigo-200 mt-1">Found a setup? Publish it in 30 seconds using TradeFlow™ technology.</p>
            </div>
            <button className="mt-6 bg-white text-indigo-900 font-bold py-2.5 rounded-lg text-sm hover:bg-indigo-50 transition-colors shadow-lg">
              Launch Composer
            </button>
         </div>

         <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg shadow-black/20">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              Pending Actions
            </h2>
             <div className="space-y-3">
              <div className="flex gap-4 items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                <div className="flex gap-4 items-center">
                   <div className="bg-amber-500/10 p-2 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                   </div>
                   <div>
                     <h4 className="text-sm font-medium text-white">Approve Community Post</h4>
                     <p className="text-xs text-slate-400">User @crypto_king posted a link to an external site.</p>
                   </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded transition-colors font-medium">Approve</button>
                  <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors font-medium">Reject</button>
                </div>
              </div>

              <div className="flex gap-4 items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                 <div className="flex gap-4 items-center">
                    <div className="bg-indigo-500/10 p-2 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Verify KYC Documents</h4>
                      <p className="text-xs text-slate-400">20 new members are waiting for approval.</p>
                    </div>
                 </div>
                 <button className="text-xs border border-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors font-medium">Review All</button>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;