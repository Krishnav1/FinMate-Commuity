import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Trophy, TrendingUp, TrendingDown, Calendar, ArrowUpRight, Download, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Simple mock for equity since we don't have historical PnL per day in simple context
const equityData = [
  { date: 'Jan 1', value: 100000 },
  { date: 'Jan 5', value: 102500 },
  { date: 'Jan 10', value: 101000 },
  { date: 'Jan 15', value: 105800 },
  { date: 'Jan 20', value: 108900 },
  { date: 'Jan 25', value: 107500 },
  { date: 'Feb 1', value: 112000 },
  { date: 'Feb 5', value: 115000 },
  { date: 'Feb 10', value: 113500 },
  { date: 'Feb 15', value: 118000 },
];

const Analytics: React.FC = () => {
  const { signals } = useApp();

  // Calculate Real Stats from Signals
  const closedSignals = signals.filter(s => s.status === 'HIT' || s.status === 'STOPPED');
  const totalTrades = closedSignals.length;
  const wins = closedSignals.filter(s => s.status === 'HIT').length;
  const losses = totalTrades - wins;
  const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
  
  // Calculate simulated PnL (Just for display, assuming HIT=1000, LOSS=-500)
  const totalPnL = (wins * 1500) - (losses * 800);

  const winRateData = [
    { name: 'Wins', value: wins || 1, color: '#10b981' }, // Fallback to 1 to show chart
    { name: 'Losses', value: losses, color: '#f43f5e' },
  ];

  // Aggregate by Instrument
  const instrumentStats = signals.reduce((acc, curr) => {
    const symbol = curr.symbol;
    const currentVal = acc[symbol] ?? 0;
    let newVal = currentVal;

    if (curr.status === 'HIT') newVal += 1500;
    if (curr.status === 'STOPPED') newVal -= 800;
    
    acc[symbol] = newVal;
    return acc;
  }, {} as Record<string, number>);

  const instrumentData = Object.entries(instrumentStats)
    .map(([name, profit]) => ({ name, profit }))
    .sort((a, b) => b.profit - a.profit);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white">Trading Performance</h2>
           <p className="text-slate-400 text-sm">Deep dive into your signal accuracy and P&L.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 transition-colors text-sm">
             <Calendar size={16} /> Last 30 Days
           </button>
           <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
             <Download size={16} /> Export PDF
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg">
           <div className="flex justify-between items-start mb-2">
              <p className="text-slate-400 text-xs font-semibold uppercase">Total Profit (Est)</p>
              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <Trophy size={16} className="text-emerald-400" />
              </div>
           </div>
           <h3 className="text-2xl font-bold text-white">₹{totalPnL.toLocaleString()}</h3>
           <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
             <TrendingUp size={12} /> based on closed trades
           </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg">
           <div className="flex justify-between items-start mb-2">
              <p className="text-slate-400 text-xs font-semibold uppercase">Win Rate</p>
              <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                <TrendingUp size={16} className="text-indigo-400" />
              </div>
           </div>
           <h3 className="text-2xl font-bold text-white">{winRate}%</h3>
           <p className="text-xs text-slate-400 mt-1">Based on {totalTrades} signals</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg">
           <div className="flex justify-between items-start mb-2">
              <p className="text-slate-400 text-xs font-semibold uppercase">Avg Risk:Reward</p>
              <div className="p-1.5 bg-amber-500/10 rounded-lg">
                <ArrowUpRight size={16} className="text-amber-400" />
              </div>
           </div>
           <h3 className="text-2xl font-bold text-white">1 : 3.2</h3>
           <p className="text-xs text-emerald-400 mt-1">Optimized Strategy</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg">
           <div className="flex justify-between items-start mb-2">
              <p className="text-slate-400 text-xs font-semibold uppercase">Max Drawdown</p>
              <div className="p-1.5 bg-rose-500/10 rounded-lg">
                <TrendingDown size={16} className="text-rose-400" />
              </div>
           </div>
           <h3 className="text-2xl font-bold text-white">-4.2%</h3>
           <p className="text-xs text-slate-400 mt-1">Recovered in 3 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Curve */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
           <h3 className="text-lg font-bold text-white mb-6">Equity Growth Curve</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={equityData}>
                 <defs>
                   <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                 <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                   itemStyle={{ color: '#fff' }}
                 />
                 <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#colorEquity)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Win/Loss & Breakdown */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col gap-6">
           <div>
              <h3 className="text-lg font-bold text-white mb-4">Accuracy Breakdown</h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={winRateData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {winRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-sm">
                 <div className="flex items-center gap-2">
                   <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                   <span className="text-slate-300">Wins ({winRate}%)</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="w-3 h-3 bg-rose-500 rounded-full"></span>
                   <span className="text-slate-300">Losses</span>
                 </div>
              </div>
           </div>
           
           <div className="border-t border-slate-700 pt-6">
              <h3 className="text-sm font-bold text-white mb-3">Top Instrument Performance</h3>
              <div className="space-y-3">
                 {instrumentData.length > 0 ? instrumentData.slice(0, 3).map((item, i) => (
                   <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">{item.name}</span>
                      <span className={`font-mono font-medium ${item.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.profit >= 0 ? '+' : ''}₹{item.profit.toLocaleString()}
                      </span>
                   </div>
                 )) : (
                    <p className="text-xs text-slate-500 text-center py-2">No closed trades yet.</p>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="bg-indigo-600/20 p-3 rounded-full">
               <Share2 className="text-indigo-400 w-6 h-6" />
            </div>
            <div>
               <h4 className="text-white font-bold">Share Your Success</h4>
               <p className="text-slate-400 text-xs">Generate an Instagram-ready performance card for today.</p>
            </div>
         </div>
         <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            Generate Post
         </button>
      </div>
    </div>
  );
};

export default Analytics;