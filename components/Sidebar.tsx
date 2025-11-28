import React from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  CandlestickChart, 
  Send, 
  BarChart2, 
  Users, 
  GraduationCap, 
  CreditCard, 
  Settings,
  LogOut,
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.CHART_STUDIO, label: 'Chart Studio', icon: CandlestickChart },
    { id: View.TRADE_FLOW, label: 'TradeFlow™', icon: Send },
    { id: View.ANALYTICS, label: 'Performance', icon: BarChart2 },
    { id: View.COMMUNITY, label: 'Community', icon: Users },
    { id: View.COURSES, label: 'Course LMS', icon: GraduationCap },
    { id: View.REVENUE, label: 'Revenue', icon: CreditCard },
    { id: View.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Zap className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">FINMATE</span>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Guru Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-400">SEBI Verified</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="font-medium text-sm">{item.label}</span>
              {item.id === View.TRADE_FLOW && (
                <span className="ml-auto bg-indigo-500 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">NEW</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 text-slate-400 hover:text-rose-400 transition-colors w-full px-3 py-2">
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
