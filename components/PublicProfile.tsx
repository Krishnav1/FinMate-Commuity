import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, Star, Users, TrendingUp, Lock, ExternalLink, 
  Youtube, Twitter, Instagram, Send, PlayCircle, BookOpen, 
  Award, Clock, CheckCircle2, MapPin
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

// Mock Performance Data
const performanceData = [
  { month: 'Jan', return: 12 },
  { month: 'Feb', return: 18 },
  { month: 'Mar', return: 8 },
  { month: 'Apr', return: 22 },
  { month: 'May', return: 15 },
  { month: 'Jun', return: 28 },
];

const PublicProfile: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, signals } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');

  const activeSignals = signals.filter(s => s.status === 'ACTIVE' || s.status === 'PENDING').length;
  const winRate = '76%'; 

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            {/* Strategy & Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="text-indigo-400" /> Trading Strategy
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {user.strategyContext || user.bio}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {user.tradingStyles.map((style, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/20">
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools Stack */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4">Tools I Use</h3>
                 <div className="space-y-3">
                    {user.toolsUsed.map((tool, i) => (
                      <div key={i} className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                            <CheckCircle2 size={16} />
                         </div>
                         <span className="text-sm text-slate-300 font-medium">{tool}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <Clock className="text-emerald-400" /> My Journey
              </h3>
              <div className="relative border-l-2 border-slate-800 ml-3 space-y-12">
                {user.milestones.map((milestone, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-slate-900 border-2 border-emerald-500 rounded-full"></div>
                    <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded mb-1 inline-block">
                      {milestone.year}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">{milestone.title}</h4>
                    <p className="text-slate-400 text-sm mt-1">{milestone.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Testimonials */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6">What Students Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {user.testimonials.map((t) => (
                   <div key={t.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                      <div className="flex items-center gap-3 mb-4">
                         <img src={t.avatar} alt={t.user} className="w-10 h-10 rounded-full" />
                         <div>
                            <h5 className="font-bold text-white text-sm">{t.user}</h5>
                            <span className="text-xs text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{t.role}</span>
                         </div>
                      </div>
                      <p className="text-slate-300 text-sm italic">"{t.text}"</p>
                      <div className="flex gap-1 mt-3 text-amber-400">
                         {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        );
      
      case 'Signals':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-2 duration-500">
            <div className="flex justify-between items-center bg-indigo-600/10 p-4 rounded-xl border border-indigo-500/20 mb-6">
               <div className="flex gap-3 items-center">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <ShieldCheck className="text-white h-5 w-5" />
                  </div>
                  <div>
                     <h3 className="font-bold text-white">Verified Signal Feed</h3>
                     <p className="text-xs text-indigo-300">All signals are auto-verified by FinMate. No deletions allowed.</p>
                  </div>
               </div>
               <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg">
                 Subscribe to Unlock
               </button>
            </div>

            {/* Signal Cards */}
            {signals.map((signal, idx) => (
              <div key={signal.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all">
                 <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${signal.type === 'BUY' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                             {signal.type}
                          </div>
                          <div>
                             <h3 className="font-bold text-white text-lg">{signal.symbol}</h3>
                             <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{signal.timestamp}</span>
                                {signal.status === 'HIT' && <span className="text-emerald-500 font-bold">• Target Hit</span>}
                             </div>
                          </div>
                       </div>
                       {idx === 0 ? (
                          <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/20">Free Signal</span>
                       ) : (
                          <span className="bg-amber-500/10 text-amber-400 text-xs px-2 py-1 rounded border border-amber-500/20 flex items-center gap-1">
                             <Lock size={10} /> Premium
                          </span>
                       )}
                    </div>
                    
                    {idx === 0 ? (
                       <div className="grid grid-cols-3 gap-4 mb-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                          <div><p className="text-xs text-slate-500">Entry</p><p className="text-white font-mono">{signal.entry}</p></div>
                          <div><p className="text-xs text-slate-500">Stop</p><p className="text-rose-400 font-mono">{signal.stopLoss}</p></div>
                          <div><p className="text-xs text-slate-500">Target</p><p className="text-emerald-400 font-mono">{signal.targets[0]}</p></div>
                       </div>
                    ) : (
                       <div className="relative overflow-hidden rounded-lg mb-4">
                          <div className="grid grid-cols-3 gap-4 bg-slate-950/50 p-3 blur-sm select-none border border-slate-800">
                             <div><p className="text-xs text-slate-500">Entry</p><p className="text-white font-mono">22000</p></div>
                             <div><p className="text-xs text-slate-500">Stop</p><p className="text-rose-400 font-mono">21900</p></div>
                             <div><p className="text-xs text-slate-500">Target</p><p className="text-emerald-400 font-mono">22200</p></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[1px]">
                             <div className="text-center">
                                <Lock className="mx-auto text-slate-400 mb-2" size={20} />
                                <span className="text-xs font-bold text-white bg-slate-800 px-3 py-1 rounded-full border border-slate-600">Premium Content</span>
                             </div>
                          </div>
                       </div>
                    )}
                    <p className="text-sm text-slate-300">
                       {idx === 0 ? signal.notes : "Join premium to see the detailed logic and trade management for this setup."}
                    </p>
                 </div>
              </div>
            ))}
          </div>
        );
      
      case 'Performance':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-2 duration-500">
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Monthly Returns (Verified)</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Area type="monotone" dataKey="return" stroke="#10b981" strokeWidth={3} fill="url(#colorReturn)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                   <div className="text-3xl font-bold text-white">76%</div>
                   <div className="text-xs text-slate-500 font-bold uppercase mt-1">Win Rate</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                   <div className="text-3xl font-bold text-emerald-400">1:3.2</div>
                   <div className="text-xs text-slate-500 font-bold uppercase mt-1">Avg R:R</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                   <div className="text-3xl font-bold text-white">458</div>
                   <div className="text-xs text-slate-500 font-bold uppercase mt-1">Trades Taken</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                   <div className="text-3xl font-bold text-white">4.8yr</div>
                   <div className="text-xs text-slate-500 font-bold uppercase mt-1">Avg Hold Time</div>
                </div>
             </div>
          </div>
        );

      case 'Content':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-2 duration-500">
             {/* Videos */}
             <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                   <Youtube className="text-red-500" /> Latest Videos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {user.youtubeVideos.map((video) => (
                      <div key={video.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group cursor-pointer hover:border-slate-600 transition-all">
                         <div className="relative aspect-video">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                               <PlayCircle size={48} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                            </div>
                         </div>
                         <div className="p-4">
                            <h4 className="font-bold text-white text-sm line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors">{video.title}</h4>
                            <p className="text-xs text-slate-500">{video.views} views • YouTube</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Courses */}
             <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                   <BookOpen className="text-indigo-400" /> My Courses
                </h3>
                <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                   <div className="w-full md:w-1/3 aspect-video bg-slate-800 rounded-lg overflow-hidden relative shadow-lg">
                      <img src="https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Course" />
                      <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded">BESTSELLER</div>
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <h4 className="text-xl font-bold text-white mb-2">Option Buying Mastery 2.0</h4>
                      <p className="text-slate-400 text-sm mb-4">The ultimate guide to trading Nifty options with small capital. Learn my exact setups.</p>
                      <div className="flex justify-center md:justify-start gap-4">
                         <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-bold transition-colors">
                            Enroll for ₹4,999
                         </button>
                         <button className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium">View Syllabus</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Top Nav */}
      <nav className="h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur fixed top-0 w-full z-50 px-4 md:px-8 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-indigo-600/20">FM</div>
            <span className="font-bold text-lg tracking-tight">FinMate</span>
         </div>
         <button 
           onClick={onBack}
           className="text-xs text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
         >
           <ExternalLink size={12} /> Dashboard
         </button>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-8 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
           <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center p-[2px] shadow-2xl shadow-indigo-500/30 mb-6">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                 {user.avatarUrl ? (
                   <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-4xl font-bold text-white">{user.name.substring(0,2).toUpperCase()}</span>
                 )}
              </div>
           </div>
           
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              {user.name}
           </h1>
           
           <div className="flex items-center justify-center gap-3 mb-6">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
                 <ShieldCheck size={12} /> SEBI Reg: {user.sebiReg}
              </span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
                 <Award size={12} /> Top Rated Mentor
              </span>
           </div>

           <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed mb-8">
              {user.bio}
           </p>

           <div className="flex justify-center gap-4 mb-8">
              {user.socialLinks.twitter && <button className="p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-sky-400 hover:border-sky-500/50 transition-all"><Twitter size={18} /></button>}
              {user.socialLinks.youtube && <button className="p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-red-500 hover:border-red-500/50 transition-all"><Youtube size={18} /></button>}
              {user.socialLinks.instagram && <button className="p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-pink-500 hover:border-pink-500/50 transition-all"><Instagram size={18} /></button>}
              {user.socialLinks.telegram && <button className="p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"><Send size={18} /></button>}
           </div>

           <div className="inline-flex bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-lg">
             {['Overview', 'Signals', 'Performance', 'Content'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab}
                </button>
             ))}
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
         {renderTabContent()}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-center">
         <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-xs font-bold text-slate-300">FM</div>
            <span className="font-bold text-slate-300">FinMate</span>
         </div>
         <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed px-4">
            Disclaimer: Investments in securities market are subject to market risks. Read all the related documents carefully before investing. {user.name} is a SEBI registered Research Analyst.
         </p>
      </footer>
    </div>
  );
};

export default PublicProfile;