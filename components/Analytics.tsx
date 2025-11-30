
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';
import { Trophy, TrendingUp, TrendingDown, Calendar, ArrowUpRight, Download, Share2, Users, Eye, MessageCircle, Sparkles, BrainCircuit, Target, Activity, Clock, Zap, Briefcase, MapPin, Award, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Signal, CreatorPersona } from '../types';
import { analyzeContentPerformance } from '../services/geminiService';

// --- MOCK DATA FOR CHARTS ---

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

const engagementData = [
  { date: 'Mon', views: 2400, likes: 120 },
  { date: 'Tue', views: 3500, likes: 240 },
  { date: 'Wed', views: 2100, likes: 90 },
  { date: 'Thu', views: 4200, likes: 350 },
  { date: 'Fri', views: 5100, likes: 410 },
  { date: 'Sat', views: 3200, likes: 180 },
  { date: 'Sun', views: 2800, likes: 150 },
];

const contentGapData = [
   { topic: 'Green Energy', marketInterest: 90, yourCoverage: 10 },
   { topic: 'AI Tech', marketInterest: 85, yourCoverage: 30 },
   { topic: 'Banking', marketInterest: 60, yourCoverage: 80 },
];

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b'];

const Analytics: React.FC = () => {
  const { signals, user, reports } = useApp();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'PERFORMANCE' | 'AUDIENCE'>('PERFORMANCE');

  // --- TRADER METRICS CALCULATION ---
  const closedSignals = signals.filter(s => s.status === 'HIT' || s.status === 'STOPPED');
  const totalTrades = closedSignals.length;
  const wins = closedSignals.filter(s => s.status === 'HIT').length;
  const losses = totalTrades - wins;
  const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
  const totalPnL = (wins * 1500) - (losses * 800);
  
  const winRateData = [
    { name: 'Wins', value: wins || 1, color: '#10b981' }, 
    { name: 'Losses', value: losses, color: '#f43f5e' },
  ];

  const instrumentStats = signals.reduce((acc: Record<string, number>, curr: Signal) => {
    const symbol = curr.symbol;
    const currentVal = acc[symbol] ?? 0;
    let newVal = currentVal;

    if (curr.status === 'HIT') newVal += 1500;
    if (curr.status === 'STOPPED') newVal -= 800;
    
    acc[symbol] = newVal;
    return acc;
  }, {} as Record<string, number>);

  const instrumentData = Object.entries(instrumentStats)
    .map(([name, profit]) => ({ name, profit: profit as number }))
    .sort((a, b) => b.profit - a.profit);

  // --- ANALYST/CREATOR METRICS CALCULATION ---
  const totalImpressions = reports.reduce((acc, r) => acc + (r.socialStats?.impressions || 0), 0);
  const totalClicks = reports.reduce((acc, r) => acc + (r.socialStats?.clicks || 0), 0);
  const totalLikes = reports.reduce((acc, r) => acc + (r.socialStats?.likes || 0), 0);
  
  // Calculate Avg Engagement Rate (Realistic LinkedIn Calculation)
  // (Likes + Comments + Shares) / Impressions
  const totalEngagements = reports.reduce((acc, r) => acc + (r.socialStats?.likes || 0) + (r.socialStats?.comments || 0) + (r.socialStats?.shares || 0), 0);
  const avgEngagementRate = totalImpressions > 0 ? ((totalEngagements / totalImpressions) * 100).toFixed(2) : '0';

  useEffect(() => {
    // If user is Analyst/Educator, generate AI Insight
    if (user.persona !== CreatorPersona.TRADER && reports.length > 0) {
       const fetchInsight = async () => {
         const insight = await analyzeContentPerformance(
           reports.map(r => ({ title: r.title, stats: r.socialStats })), 
           user.audienceDemographics
         );
         setAiInsight(insight);
       };
       fetchInsight();
    }
  }, [user.persona, reports, user.audienceDemographics]);


  // ==========================
  // VIEW: TRADER DASHBOARD
  // ==========================
  if (user.persona === CreatorPersona.TRADER) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="text-emerald-400" /> Trading Performance
            </h2>
            <p className="text-slate-400 text-sm">Deep dive into your signal accuracy and P&L.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 transition-colors text-sm">
              <Calendar size={16} /> Last 30 Days
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-bold">
              <Download size={16} /> Report
            </button>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-2 relative z-10">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Net Profit</p>
                <Trophy size={18} className="text-emerald-400" />
            </div>
            <h3 className="text-3xl font-bold text-white relative z-10">₹{totalPnL.toLocaleString()}</h3>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp size={12} /> +15.3% this month
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Win Rate</p>
                <Target size={18} className="text-indigo-400" />
            </div>
            <h3 className="text-3xl font-bold text-white">{winRate}%</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Target: 70%
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg R:R</p>
                <ArrowUpRight size={18} className="text-amber-400" />
            </div>
            <h3 className="text-3xl font-bold text-white">1 : 3.2</h3>
            <p className="text-xs text-emerald-400 mt-2 font-medium">Optimized Strategy</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Max Drawdown</p>
                <TrendingDown size={18} className="text-rose-400" />
            </div>
            <h3 className="text-3xl font-bold text-white">-4.2%</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">Recovered in 3 days</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equity Curve */}
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-white">Equity Growth Curve</h3>
               <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                  <span className="text-xs text-slate-400">Account Value</span>
               </div>
            </div>
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
                <div className="h-[180px] relative">
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
                        stroke="none"
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
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-3xl font-bold text-white">{winRate}%</span>
                     <span className="text-xs text-slate-500 uppercase">Win Rate</span>
                  </div>
                </div>
            </div>
            
            <div className="border-t border-slate-700 pt-6 flex-1">
                <h3 className="text-sm font-bold text-white mb-4">Top Performing Instruments</h3>
                <div className="space-y-3">
                  {instrumentData.length > 0 ? instrumentData.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-300 font-medium">{item.name}</span>
                        <span className={`font-mono font-bold ${item.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
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
      </div>
    );
  }

  // ==========================
  // VIEW: CREATOR/ANALYST DASHBOARD
  // ==========================
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="text-indigo-400" /> Audience Intelligence
             </h2>
             <p className="text-slate-400 text-sm">LinkedIn & Social Performance Analytics.</p>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
             <button 
               onClick={() => setViewMode('PERFORMANCE')}
               className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'PERFORMANCE' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
             >
                Content ROI
             </button>
             <button 
               onClick={() => setViewMode('AUDIENCE')}
               className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'AUDIENCE' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
             >
                Demographics
             </button>
          </div>
       </div>

       {/* AI Insight Hero */}
       {aiInsight && (
         <div className="bg-gradient-to-r from-purple-900/50 to-slate-800 border border-purple-500/30 rounded-xl p-6 relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
             <div className="flex items-start gap-4">
                 <div className="p-3 bg-purple-600/20 rounded-lg text-purple-300 border border-purple-500/30">
                    <Sparkles size={24} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-2">AI Content Strategist</h3>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{aiInsight}</p>
                 </div>
             </div>
         </div>
       )}

       {viewMode === 'PERFORMANCE' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Eye size={64} /></div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Impressions</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{totalImpressions.toLocaleString()}</h3>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={64} /></div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Engagement Rate</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{avgEngagementRate}%</h3>
                    <p className="text-xs text-emerald-400 mt-1 font-medium">Top 5% of Industry</p>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Target size={64} /></div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Link Clicks</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{totalClicks.toLocaleString()}</h3>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Share2 size={64} /></div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Viral Velocity</p>
                    <h3 className="text-3xl font-bold text-emerald-400 mt-1">High</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Engagement Chart */}
                <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-white mb-6">Engagement Trends (Last 7 Days)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={engagementData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                            <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="likes" fill="#a855f7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* Content Gap Analysis */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap className="text-amber-400" size={18} />
                        <h3 className="font-bold text-white">Content Gap Analysis</h3>
                    </div>
                    <div className="space-y-5">
                        {contentGapData.map((data, i) => (
                        <div key={i} className="group">
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-slate-300 font-medium">{data.topic}</span>
                                <span className="text-slate-400">Gap: {Math.max(0, data.marketInterest - data.yourCoverage)}%</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden flex">
                                <div 
                                className="h-full bg-indigo-500"
                                style={{ width: `${data.yourCoverage}%` }}
                                ></div>
                                <div 
                                className="h-full bg-slate-700 relative"
                                style={{ width: `${data.marketInterest - data.yourCoverage}%` }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[8px] text-white opacity-50">MISSED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Post Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/50">
                    <h3 className="font-bold text-white">Recent Post Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-3">Content Title</th>
                                <th className="px-6 py-3">Platform</th>
                                <th className="px-6 py-3 text-right">Impressions</th>
                                <th className="px-6 py-3 text-right">CTR</th>
                                <th className="px-6 py-3 text-right">Eng. Rate</th>
                                <th className="px-6 py-3 text-center">Velocity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{report.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-300 border border-slate-600">
                                            {report.platform || 'LINKEDIN'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-300">
                                        {report.socialStats?.impressions.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-indigo-400">
                                        {report.socialStats?.performance?.ctr}%
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-emerald-400">
                                        {report.socialStats?.performance?.engagementRate}%
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                            report.socialStats?.performance?.viralVelocity === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            report.socialStats?.performance?.viralVelocity === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                        }`}>
                                            {report.socialStats?.performance?.viralVelocity}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </>
       ) : (
          /* AUDIENCE DEMOGRAPHICS VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Industries */}
             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                    <Briefcase className="text-blue-400" size={20} />
                    <h3 className="font-bold text-white">Audience Industry</h3>
                </div>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={user.audienceDemographics?.industries}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="percentage"
                                label={({name, percentage}) => `${name} ${percentage}%`}
                            >
                                {user.audienceDemographics?.industries.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
             </div>

             {/* Seniority */}
             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                    <Award className="text-amber-400" size={20} />
                    <h3 className="font-bold text-white">Seniority Level</h3>
                </div>
                <div className="space-y-4">
                    {user.audienceDemographics?.seniority.map((level, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-300">{level.name}</span>
                                <span className="text-white font-bold">{level.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2">
                                <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600" style={{ width: `${level.percentage}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* Job Functions */}
             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                    <Layers className="text-purple-400" size={20} />
                    <h3 className="font-bold text-white">Job Functions</h3>
                </div>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={user.audienceDemographics?.jobFunctions}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                            <Bar dataKey="percentage" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </div>
             
             {/* Locations */}
             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                    <MapPin className="text-emerald-400" size={20} />
                    <h3 className="font-bold text-white">Top Locations</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {user.audienceDemographics?.locations.map((loc, i) => (
                        <div key={i} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                            <span className="text-sm text-slate-300">{loc.name}</span>
                            <span className="text-emerald-400 font-bold">{loc.percentage}%</span>
                        </div>
                    ))}
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default Analytics;
