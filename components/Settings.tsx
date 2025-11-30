
import React, { useState, useEffect } from 'react';
import { User, Bell, Link, Zap, CreditCard, Shield, Bot, Save, BrainCircuit, RefreshCw, CheckCircle2, AlertTriangle, Smartphone, MessageSquare, Terminal, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CreatorPersona, BotConfig, IntegrationConfig } from '../types';

const Settings: React.FC = () => {
  const { user, updateProfile } = useApp();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for forms to handle inputs before saving
  const [botForm, setBotForm] = useState<BotConfig>(user.botConfig || {
    name: 'FinBot', avatar: '', tone: 'Professional', signature: '', welcomeMessage: '', enabled: true
  });

  const [integrationForm, setIntegrationForm] = useState<IntegrationConfig>(user.integrationConfig || {
    telegram: { botToken: '', channelId: '', connected: false },
    whatsapp: { phoneNumberId: '', businessAccountId: '', connected: false },
    discord: { webhookUrl: '', connected: false }
  });

  const [strategyForm, setStrategyForm] = useState(user.strategyContext || '');

  // Simulation states
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'idle' | 'testing' | 'connected' | 'failed'>>({
    telegram: user.integrationConfig?.telegram?.connected ? 'connected' : 'idle',
    whatsapp: user.integrationConfig?.whatsapp?.connected ? 'connected' : 'idle'
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      updateProfile({
        botConfig: botForm,
        integrationConfig: integrationForm,
        strategyContext: strategyForm
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const handleTestConnection = (platform: 'telegram' | 'whatsapp') => {
    setConnectionStatus(prev => ({ ...prev, [platform]: 'testing' }));
    
    // Simulate Network Latency and handshake
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% success chance for demo
      
      setConnectionStatus(prev => ({ ...prev, [platform]: isSuccess ? 'connected' : 'failed' }));
      
      if (isSuccess) {
        setIntegrationForm(prev => ({
          ...prev,
          [platform]: { ...prev[platform as keyof IntegrationConfig], connected: true }
        }));
      }
    }, 1500);
  };

  const handlePersonaSwitch = (persona: CreatorPersona) => {
    updateProfile({ persona });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1500);
  };

  const tabs = [
    { id: 'Profile', icon: User, label: 'Identity' },
    { id: 'Bot Studio', icon: Bot, label: 'Bot Studio' },
    { id: 'AI Brain', icon: BrainCircuit, label: 'Strategy Brain' },
    { id: 'Connections', icon: Link, label: 'Integrations' },
    { id: 'Billing', icon: CreditCard, label: 'Subscription' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      {/* HEADER & PERSONA SWITCHER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
         <div>
            <h2 className="text-2xl font-bold text-white">System Settings</h2>
            <p className="text-slate-400 text-sm">Manage your digital ecosystem and AI configuration.</p>
         </div>
         <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            {[CreatorPersona.TRADER, CreatorPersona.ANALYST, CreatorPersona.EDUCATOR].map(persona => (
               <button 
                 key={persona}
                 onClick={() => handlePersonaSwitch(persona)}
                 className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    user.persona === persona 
                      ? 'bg-indigo-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                 }`}
               >
                  {persona}
               </button>
            ))}
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         {/* SIDEBAR NAVIGATION */}
         <div className="w-full lg:w-64 flex flex-col gap-1">
            {tabs.map((tab) => {
               const Icon = tab.icon;
               return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                       activeTab === tab.id 
                       ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/50' 
                       : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                    }`}
                  >
                     <Icon size={18} />
                     {tab.label}
                  </button>
               );
            })}
         </div>

         {/* MAIN CONTENT PANEL */}
         <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden min-h-[600px]">
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

            {/* --- PROFILE TAB --- */}
            {activeTab === 'Profile' && (
               <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="flex items-center gap-6">
                     <div className="relative">
                        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-slate-800 shadow-xl overflow-hidden">
                           {user.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : user.name.substring(0,2).toUpperCase()}
                        </div>
                        <button className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white border-2 border-slate-900 hover:bg-indigo-500 transition-colors">
                           <RefreshCw size={14} />
                        </button>
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                              <Shield size={10} /> SEBI Reg: {user.sebiReg}
                           </span>
                           <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2 py-0.5 rounded">
                              {user.persona} Plan
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Display Name</label>
                        <input type="text" value={user.name} disabled className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-300 focus:outline-none cursor-not-allowed opacity-70" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                        <input type="text" value={user.email} disabled className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-300 focus:outline-none cursor-not-allowed opacity-70" />
                     </div>
                     <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Public Bio</label>
                        <textarea className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none" defaultValue={user.bio} />
                        <p className="text-[10px] text-slate-500 mt-2 text-right">Visible on your public profile page.</p>
                     </div>
                  </div>
               </div>
            )}

            {/* --- BOT STUDIO TAB --- */}
            {activeTab === 'Bot Studio' && (
               <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="flex justify-between items-start">
                     <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                           <Bot className="text-indigo-400" /> Bot Personality Studio
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">Design your AI twin to handle community queries 24/7.</p>
                     </div>
                     <div className="flex items-center gap-3 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                        <span className="text-xs text-slate-300 font-medium">Status</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${botForm.enabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`}></div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="space-y-5">
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Bot Name</label>
                           <input 
                              type="text" 
                              value={botForm.name} 
                              onChange={(e) => setBotForm({...botForm, name: e.target.value})}
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tone of Voice</label>
                           <div className="grid grid-cols-3 gap-2">
                              {['Professional', 'Friendly', 'Strict', 'Coach', 'Sarcastic'].map((tone) => (
                                 <button 
                                    key={tone}
                                    onClick={() => setBotForm({...botForm, tone: tone as any})}
                                    className={`text-xs py-2 px-1 rounded border transition-all ${
                                       botForm.tone === tone 
                                       ? 'bg-indigo-600 text-white border-indigo-500' 
                                       : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                                    }`}
                                 >
                                    {tone}
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Signature</label>
                           <input 
                              type="text" 
                              value={botForm.signature} 
                              onChange={(e) => setBotForm({...botForm, signature: e.target.value})}
                              placeholder="- Team Alpha"
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                           />
                        </div>
                     </div>

                     {/* Bot Preview Card */}
                     <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 relative">
                        <span className="absolute -top-3 left-4 bg-slate-900 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-800 uppercase font-bold">Live Preview</span>
                        <div className="space-y-4 mt-2">
                           {/* User Msg */}
                           <div className="flex justify-end">
                              <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2 text-sm max-w-[80%]">
                                 Can I enter the Nifty trade now? I missed the entry price.
                              </div>
                           </div>
                           {/* Bot Msg */}
                           <div className="flex justify-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                 {botForm.name.substring(0,2).toUpperCase()}
                              </div>
                              <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-sm border border-slate-700 max-w-[90%] shadow-lg">
                                 <p className="mb-2">
                                    {botForm.tone === 'Strict' ? 'Absolutely not. 🛑' : botForm.tone === 'Friendly' ? 'Hey there! 👋' : 'Attention Trader:'} 
                                    {' '}We never chase trades. The risk-reward is no longer favorable. Wait for a pullback.
                                 </p>
                                 <p className="text-xs text-slate-500 font-medium italic opacity-80">{botForm.signature}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* --- CONNECTIONS TAB --- */}
            {activeTab === 'Connections' && (
               <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Link className="text-emerald-400" /> Platform Integrations
                     </h3>
                     <p className="text-slate-400 text-sm mt-1">Connect your community channels for auto-posting.</p>
                  </div>

                  {/* Telegram */}
                  <div className={`border rounded-xl p-6 transition-all ${connectionStatus.telegram === 'connected' ? 'bg-slate-800/50 border-emerald-500/30' : 'bg-slate-800 border-slate-700'}`}>
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-[#0088cc] rounded-lg flex items-center justify-center text-white">
                              <MessageSquare size={20} />
                           </div>
                           <div>
                              <h4 className="font-bold text-white">Telegram Bot</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <span className={`w-2 h-2 rounded-full ${connectionStatus.telegram === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                 <span className={`text-xs font-medium ${connectionStatus.telegram === 'connected' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {connectionStatus.telegram === 'connected' ? 'Active & Listening' : 'Disconnected'}
                                 </span>
                              </div>
                           </div>
                        </div>
                        {(connectionStatus.telegram === 'connected' || connectionStatus.telegram === 'testing') && (
                           <button onClick={() => handleTestConnection('telegram')} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                              {connectionStatus.telegram === 'testing' ? <RefreshCw size={12} className="animate-spin" /> : <Wifi size={12} />}
                              {connectionStatus.telegram === 'testing' ? 'Testing' : 'Test Ping'}
                           </button>
                        )}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Bot Token</label>
                           <div className="relative">
                              <input 
                                 type="password" 
                                 value={integrationForm.telegram?.botToken}
                                 onChange={e => setIntegrationForm({...integrationForm, telegram: {...integrationForm.telegram!, botToken: e.target.value}})}
                                 placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                                 className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                              />
                              <Terminal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Channel ID</label>
                           <input 
                              type="text" 
                              value={integrationForm.telegram?.channelId}
                              onChange={e => setIntegrationForm({...integrationForm, telegram: {...integrationForm.telegram!, channelId: e.target.value}})}
                              placeholder="@my_trading_channel"
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                           />
                        </div>
                     </div>
                     
                     {connectionStatus.telegram !== 'connected' && connectionStatus.telegram !== 'testing' && (
                        <button 
                           onClick={() => handleTestConnection('telegram')}
                           disabled={!integrationForm.telegram?.botToken}
                           className="mt-4 w-full bg-[#0088cc] hover:bg-[#0077b5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg transition-all flex justify-center items-center gap-2"
                        >
                           <Link size={16} />
                           Connect Telegram
                        </button>
                     )}
                  </div>

                  {/* WhatsApp */}
                  <div className={`border rounded-xl p-6 transition-all ${connectionStatus.whatsapp === 'connected' ? 'bg-slate-800/50 border-emerald-500/30' : 'bg-slate-800 border-slate-700'}`}>
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center text-white">
                              <Smartphone size={20} />
                           </div>
                           <div>
                              <h4 className="font-bold text-white">WhatsApp Business</h4>
                              <p className="text-xs text-slate-500">Official Meta Cloud API</p>
                           </div>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-[10px] rounded uppercase font-bold">Premium</span>
                     </div>
                     <p className="text-sm text-slate-400 mb-4">Connect your Meta Business Account to send automated alerts directly to WhatsApp.</p>
                     <button className="w-full border border-slate-600 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-lg transition-colors">
                        Configure WhatsApp
                     </button>
                  </div>
               </div>
            )}

            {/* --- AI BRAIN TAB --- */}
            {activeTab === 'AI Brain' && (
               <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <BrainCircuit className="text-purple-400" /> Strategy Context
                     </h3>
                     <p className="text-slate-400 text-sm mt-1">Teach the AI your specific trading rules so it answers correctly.</p>
                  </div>
                  
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                     <label className="block text-xs font-bold text-slate-400 uppercase mb-2">My Strategy & Rules</label>
                     <textarea 
                        value={strategyForm}
                        onChange={(e) => setStrategyForm(e.target.value)}
                        placeholder="e.g. I trade Nifty 5m breakouts. My favorite indicator is VWAP. I never trade after 2:30 PM. My max risk per trade is 1%..."
                        className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white text-sm leading-relaxed focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                     />
                     <div className="flex justify-between items-center mt-2">
                        <p className="text-[10px] text-slate-500">The AI will use this text as its "Knowledge Base".</p>
                        <button className="text-xs text-purple-400 hover:text-white flex items-center gap-1">
                           <RefreshCw size={10} /> Reset to Default
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {/* SAVE BAR */}
            <div className="absolute bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur border-t border-slate-800 p-4 flex justify-end items-center gap-4">
               {saveSuccess && <span className="text-emerald-400 text-sm font-bold flex items-center gap-1 animate-in slide-in-from-right-4"><CheckCircle2 size={16} /> Saved Successfully</span>}
               <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
               >
                  {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
               </button>
            </div>

         </div>
      </div>
    </div>
  );
};

export default Settings;
