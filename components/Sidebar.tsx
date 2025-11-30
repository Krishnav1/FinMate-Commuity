
import React from 'react';
import { View, CreatorPersona } from '../types';
import { 
  LayoutDashboard, 
  CandlestickChart, 
  Send, 
  BarChart2, 
  Users, 
  Settings,
  LogOut,
  Zap,
  Globe,
  PieChart,
  Newspaper,
  BookOpen,
  Microscope,
  LineChart,
  PenTool
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const { user } = useApp();

  const getMenuItems = () => {
    const commonItems = [
       { id: View.COMMUNITY, label: 'Community', icon: Users },
       { id: View.ANALYTICS, label: 'Analytics', icon: BarChart2 },
       { id: View.REVENUE, label: 'Revenue', icon: PieChart },
       { id: View.SETTINGS, label: 'Settings', icon: Settings },
    ];

    if (user.persona === CreatorPersona.TRADER) {
       return [
         { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
         { id: View.CHART_STUDIO, label: 'Chart Studio', icon: CandlestickChart },
         { id: View.TRADE_FLOW, label: 'TradeFlow™', icon: Send, badge: 'NEW' },
         ...commonItems
       ];
    } else if (user.persona === CreatorPersona.ANALYST) {
       return [
         { id: View.DASHBOARD, label: 'Research Hub', icon: Microscope },
         { id: View.CHART_STUDIO, label: 'Growth Intelligence', icon: Zap }, // Renamed from Market Intelligence
         { id: View.TRADE_FLOW, label: 'Content Creator Studio', icon: PenTool }, 
         ...commonItems
       ];
    } else {
       // EDUCATOR
       return [
         { id: View.DASHBOARD, label: 'Creator Home', icon: LayoutDashboard },
         { id: View.CHART_STUDIO, label: 'Market Data', icon: Globe },
         { id: View.TRADE_FLOW, label: 'Content Studio', icon: Newspaper },
         { id: View.COURSES, label: 'Course LMS', icon: BookOpen },
         ...commonItems
       ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${user.persona === CreatorPersona.ANALYST ? 'bg-purple-600' : user.persona === CreatorPersona.EDUCATOR ? 'bg-amber-600' : 'bg-indigo-600'}`}>
          <Zap className="text-white w-5 h-5" />
        </div>
        <div>
           <span className="text-xl font-bold text-white tracking-tight block">FINMATE</span>
           <span className="text-[10px] text-slate-400 uppercase tracking-widest">{user.persona} OS</span>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
             {user.persona === CreatorPersona.TRADER ? 'Live Status' : 'System Status'}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-400">
               {user.persona === CreatorPersona.TRADER ? 'Market Open' : 'System Active'}
            </span>
            <span className="text-xs text-slate-500 ml-auto">Reg: {user.sebiReg.slice(-4)}</span>
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
                  ? 'bg-slate-800 text-white shadow-lg shadow-black/10 border-l-4 border-indigo-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="font-medium text-sm">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-indigo-500 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 space-y-2 border-t border-slate-800">
         <button 
           onClick={() => onChangeView(View.PUBLIC_PROFILE)}
           className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300 transition-colors w-full px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
         >
          <Globe size={18} />
          <span className="text-sm font-medium">My Public Page</span>
        </button>
        <button className="flex items-center gap-3 text-slate-400 hover:text-rose-400 transition-colors w-full px-3 py-2">
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
