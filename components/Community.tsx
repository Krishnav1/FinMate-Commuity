
import React, { useState, useRef, useEffect } from 'react';
import { Member, ChatMessage } from '../types';
import { chatWithGuruBot } from '../services/geminiService';
import { Search, Shield, Star, Ban, MessageSquare, Bot, Send, Sparkles, Wand2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const QUICK_ACTIONS = [
  { id: '1', label: '📢 Morning Update', prompt: 'Draft a professional pre-market analysis for Nifty and BankNifty. Support is at 22000.' },
  { id: '2', label: '📅 EOD Summary', prompt: 'Summarize today\'s market movement. Nifty was volatile but closed green. BankNifty weak.' },
  { id: '3', label: '📉 Reply: Missed Entry', prompt: 'A user asked "I missed the entry at 22400, can I enter now at 22450?". Write a reply based on my "No Chasing" rule.' },
  { id: '4', label: '🛑 Reply: SL Hit', prompt: 'Users are panicking because the Stop Loss hit on the last trade. Write a reassuring message about probability.' },
  { id: '5', label: '🛡️ Handle Refund', prompt: 'Write a polite refusal for a refund request citing our T&C, but offer a free extension.' },
  { id: '6', label: '🔥 Viral Tweet', prompt: 'Write a controversial tweet about why indicators don\'t work, only price action does.' },
];

const Community: React.FC = () => {
  const { user, members, signals } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: `Hello ${user.name}! I'm ${user.botConfig?.name || 'FinBot'} 🤖. I've analyzed your private strategy context. I can help you draft announcements or reply to members.`, timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Format history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Generate Context String from Active Signals
    const activeSignals = signals.filter(s => s.status === 'ACTIVE');
    const activeSignalsContext = activeSignals.length > 0 
      ? activeSignals.map(s => `${s.type} ${s.symbol} @ ${s.entry}, Target: ${s.targets[0]}, SL: ${s.stopLoss}`).join('\n')
      : "No active trades currently.";

    // Pass the Guru's private strategy AND active signals AND Bot Config to the bot
    const responseText = await chatWithGuruBot(history, userMsg.text, user.strategyContext, activeSignalsContext, user.botConfig);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
       
       {/* Left: Member Directory */}
       <div className="flex-1 flex flex-col min-w-0">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Member Directory</h2>
            <div className="flex gap-3">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                 <input 
                   type="text" 
                   placeholder="Search members..." 
                   className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                 />
               </div>
            </div>
         </div>

         <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex-1 flex flex-col shadow-lg shadow-black/20">
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-900 border-b border-slate-700">
                 <tr>
                   <th className="px-6 py-4 text-slate-400 font-medium uppercase tracking-wider text-xs">Member Name</th>
                   <th className="px-6 py-4 text-slate-400 font-medium uppercase tracking-wider text-xs">Plan</th>
                   <th className="px-6 py-4 text-slate-400 font-medium uppercase tracking-wider text-xs">Status</th>
                   <th className="px-6 py-4 text-slate-400 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-700">
                 {members.map((member) => (
                   <tr key={member.id} className="hover:bg-slate-700/50 transition-colors group">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                           {member.name.substring(0,2).toUpperCase()}
                         </div>
                         <div>
                            <span className="font-medium text-white block">{member.name}</span>
                            <span className="text-xs text-slate-500">Joined {member.joinedDate}</span>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                         member.plan === 'Elite' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                         member.plan === 'Pro' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                         'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                       }`}>
                         {member.plan === 'Elite' && <Star size={10} fill="currentColor" />}
                         {member.plan}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded font-medium flex items-center w-fit gap-1.5 ${
                          member.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                          {member.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-white transition-colors" title="Message"><MessageSquare size={16} /></button>
                         <button className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-rose-400 transition-colors" title="Ban"><Ban size={16} /></button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       </div>

       {/* Right: Guru AI Assistant */}
       <div className="w-[400px] flex flex-col bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl shadow-black/30">
          <div className="p-4 bg-slate-900 border-b border-slate-700 flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white font-bold">
               {user.botConfig?.name?.substring(0,2).toUpperCase() || <Bot className="text-white w-6 h-6" />}
             </div>
             <div>
               <h3 className="font-bold text-white text-sm">{user.botConfig?.name || 'Guru Assistant'}</h3>
               <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                 </span>
                 Online & Ready
               </p>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-slate-700 rounded-2xl rounded-tl-none p-4 flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-700 space-y-3">
             {/* Quick Actions */}
             <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {QUICK_ACTIONS.map(action => (
                   <button
                     key={action.id}
                     onClick={() => handleSendMessage(action.prompt)}
                     className="flex-shrink-0 text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 text-slate-300 px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5"
                   >
                     {action.label.includes('Draft') && <Wand2 size={10} className="text-purple-400" />}
                     {action.label.includes('Handle') && <Shield size={10} className="text-amber-400" />}
                     {action.label.includes('Viral') && <Sparkles size={10} className="text-rose-400" />}
                     {action.label.includes('Check') && <TrendingUp size={10} className="text-emerald-400" />}
                     {action.label.includes('Reply') && <MessageSquare size={10} className="text-indigo-400" />}
                     {action.label.includes('EOD') && <AlertTriangle size={10} className="text-blue-400" />}
                     {action.label}
                   </button>
                ))}
             </div>

             <div className="relative">
               <input 
                 type="text" 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={handleKeyPress}
                 placeholder={`Ask ${user.botConfig?.name || 'FinBot'} anything...`}
                 className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-500 shadow-inner"
               />
               <button 
                 onClick={() => handleSendMessage()}
                 disabled={!inputText.trim() || isTyping}
                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-lg disabled:opacity-50 disabled:bg-slate-700 transition-all"
               >
                 <Send size={16} />
               </button>
             </div>
             <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
               <Sparkles size={10} /> Powered by Gemini 2.5 AI
             </p>
          </div>
       </div>

    </div>
  );
};

export default Community;
