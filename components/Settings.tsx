import React, { useState } from 'react';
import { User, Bell, Lock, Globe, CreditCard, Shield, Zap, Link } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { id: 'Profile', icon: User },
    { id: 'Integrations', icon: Link },
    { id: 'Billing', icon: CreditCard },
    { id: 'Notifications', icon: Bell },
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
               <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-700">
                     <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg relative">
                        AT
                        <button className="absolute bottom-0 right-0 w-6 h-6 bg-slate-900 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white">
                           +
                        </button>
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white">Alex Trader</h3>
                        <p className="text-slate-400 text-sm">SEBI Reg: INH000012345</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                        <input type="text" defaultValue="Alex Trader" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors" />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                        <input type="email" defaultValue="alex@finmate.app" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors" />
                     </div>
                     <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-400 mb-1">Bio</label>
                        <textarea className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors resize-none" defaultValue="Professional options trader with 10 years of experience. Helping retail traders become profitable." />
                     </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                     <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Save Changes</button>
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
            
            {/* Placeholder for other tabs to save space in demo code */}
            {(activeTab === 'Billing' || activeTab === 'Notifications') && (
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