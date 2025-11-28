import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChartStudio from './components/ChartStudio';
import SignalComposer from './components/SignalComposer';
import Community from './components/Community';
import Analytics from './components/Analytics';
import Courses from './components/Courses';
import Revenue from './components/Revenue';
import Settings from './components/Settings';
import PublicProfile from './components/PublicProfile';
import { View } from './types';
import { Bell, Search, UserCircle } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';

// Inner App Component to use Context
const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const { user } = useApp();

  // Special Route for Public Profile (Full Screen)
  if (currentView === View.PUBLIC_PROFILE) {
    return <PublicProfile onBack={() => setCurrentView(View.DASHBOARD)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case View.CHART_STUDIO:
        return <ChartStudio />;
      case View.TRADE_FLOW:
        return <SignalComposer onSuccess={() => setCurrentView(View.DASHBOARD)} />;
      case View.COMMUNITY:
        return <Community />;
      case View.ANALYTICS:
        return <Analytics />;
      case View.COURSES:
        return <Courses />;
      case View.REVENUE:
        return <Revenue />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-50">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search signals, members, or settings..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
             <button className="relative text-slate-400 hover:text-white transition-colors">
               <Bell size={20} />
               <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900"></span>
             </button>
             <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-[10px] text-slate-400">Pro Plan • Expires in 12d</p>
                </div>
                <button className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                  <UserCircle size={24} />
                </button>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;