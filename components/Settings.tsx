import React, { useState } from 'react';
import { User, Bell, Lock, Globe, CreditCard, Shield, Zap, Link, BrainCircuit, Save, MessageCircle, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Settings: React.FC = () => {
  const { user, updateProfile } = useApp();
  const [activeTab, setActiveTab] = useState('Profile');
  const [strategyInput, setStrategyInput] = useState(user.strategyContext);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    updateProfile({
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      bio: (form.elements.namedItem('bio') as HTMLTextAreaElement).value,
    });
    alert('Profile updated!');
  };

  const handleSaveStrategy = () => {
    updateProfile({ strategyContext: strategyInput });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const tabs = [
    { id: 'Profile', icon: User },
    { id: 'AI Brain', icon: BrainCircuit },
    { id: 'Connections', icon: Link },
    { id: 'Integrations', icon: Zap },
    { id: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-white">Settings</h2>

      <div className="flex flex-col md:flex-row gap-8">
         {/* Sidebar Tabs */}
         <div className="w-full md:w-64 flex flex-col gap-1">
            {tabs.map((tab) => {
               const Icon = tab.icon;
               return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                       activeTab === tab.id 
                       ? 'bg-indigo-600 text-white shadow-md' 
                       : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                     <Icon size={18} />
                     {tab.id}
                  </button>
               );
            })}
         </div>

         {/* Content Area */}
         <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg min-h-[500px]">
            {activeTab === 'Profile' && (
               <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-700">
                     <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg relative">
                        {user.name.substring(0, 2).toUpperCase()}
                        <button type="button" className="absolute bottom-0 right-0 w-6 h-6 bg-slate-900 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white">
                           +
                        </button>
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                        <p className="text-slate-400 text-sm">SEBI Reg: {user.sebiReg}</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                        <input name="name" type="text" defaultValue={user.name} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors" />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                        <input name="email" type="email" defaultValue={user.email} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors" />
                     </div>
                     <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-400 mb-1">Bio</label>
                        <textarea name="bio" className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors resize-none" defaultValue={user.bio} />
                     </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                     <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Save Changes</button>
                  </div>
               </form>
            )}

            {activeTab === 'AI Brain' && (
               <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-indigo-500/30 p-4 rounded-lg flex gap-3 items-start">
                     <BrainCircuit className="text-purple-400 flex-shrink-0 mt-1" size={24} />
                     <div>
                        <h4 className="font-bold text-white text-sm">Private Strategy Twin</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                           Train your AI Assistant on your specific trading rules. When you ask the bot questions in Community, it will use this knowledge base to give answers that sound like YOU.
                        </p>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-medium text-slate-400 mb-2">Your Secret Sauce (Strategy & Rules)</label>
                     <textarea 
                        value={strategyInput}
                        onChange={(e) => setStrategyInput(e.target.value)}
                        placeholder="e.g. I never trade in the first 15 mins. I only look for hammer candles on support..."
                        className="w-full h-64 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none leading-relaxed font-mono" 
                     />
                     <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-slate-500">The AI will use this context for all future interactions.</p>
                        <button 
                           onClick={handleSaveStrategy}
                           className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                              isSaved ? 'bg-emerald-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
                           }`}
                        >
                           {isSaved ? <span className="flex items-center gap-2">Saved!</span> : <><Save size={16} /> Update Brain</>}
                        </button>
                     </div>
                  </div>
               </div>
            )}

             {activeTab === 'Connections' && (
               <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
                    <h3 className="text-white font-bold text-lg mb-2">Social Connections</h3>
                    <p className="text-slate-400 text-sm mb-4">Connect your social channels to auto-publish signals.</p>
                    
                    <div className="space-y-3">
                       {/* Telegram */}
                       <div className="flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-[#24A1DE] rounded-full flex items-center justify-center text-white">
                                <Send size={20} className="ml-0.5" />
                             </div>
                             <div>
                                <h4 className="font-bold text-white text-sm">Telegram Channel</h4>
                                <p className="text-xs text-emerald-400">Connected to @FinMateSignals</p>
                             </div>
                          </div>
                          <button className="text-xs text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded hover:bg-rose-500/10">Disconnect</button>
                       </div>

                       {/* WhatsApp */}
                       <div className="flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-green-500/50 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white">
                                <MessageCircle size={20} />
                             </div>
                             <div>
                                <h4 className="font-bold text-white text-sm">WhatsApp Business</h4>
                                <p className="text-xs text-slate-500">Not connected</p>
                             </div>
                          </div>
                          <button className="text-xs text-white bg-slate-700 px-3 py-1.5 rounded hover:bg-slate-600">Connect</button>
                       </div>

                       {/* Discord */}
                       <div className="flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-indigo-500/50 transition-colors opacity-70">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-[#5865F2] rounded-full flex items-center justify-center text-white">
                                <Zap size={20} />
                             </div>
                             <div>
                                <h4 className="font-bold text-white text-sm">Discord Server</h4>
                                <p className="text-xs text-slate-500">Coming Soon</p>
                             </div>
                          </div>
                          <button className="text-xs text-slate-500 border border-slate-700 px-3 py-1.5 rounded cursor-not-allowed">Waitlist</button>
                       </div>
                    </div>
                  </div>
               </div>
            )}

            {activeTab === 'Integrations' && (
               <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg flex gap-3 items-start">
                     <Zap className="text-indigo-400 flex-shrink-0 mt-1" size={20} />
                     <div>
                        <h4 className="font-bold text-indigo-100 text-sm">Automated Trading (Algo)</h4>
                        <p className="text-xs text-indigo-200/70 mt-1">Connect your broker account to enable 1-click execution for your users.</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-indigo-900 text-xs">Zerodha</div>
                           <div>
                              <h4 className="font-medium text-white">Zerodha Kite</h4>
                              <p className="text-xs text-emerald-400">Connected</p>
                           </div>
                        </div>
                        <button className="text-xs border border-rose-500/50 text-rose-400 px-3 py-1.5 rounded hover:bg-rose-500/10">Disconnect</button>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700 opacity-60">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center font-bold text-white text-xs">Dhan</div>
                           <div>
                              <h4 className="font-medium text-white">Dhan HQ</h4>
                              <p className="text-xs text-slate-500">Not connected</p>
                           </div>
                        </div>
                        <button className="text-xs bg-slate-700 text-white px-3 py-1.5 rounded hover:bg-slate-600">Connect</button>
                     </div>
                  </div>
               </div>
            )}
            
            {activeTab === 'Billing' && (
               <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-in fade-in duration-300">
                  <Shield size={48} className="mb-4 opacity-20" />
                  <p>Secure configuration panel.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Settings;