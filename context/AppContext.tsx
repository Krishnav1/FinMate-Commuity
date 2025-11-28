import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GlobalState, UserProfile, Signal, Member } from '../types';

const defaultUser: UserProfile = {
  name: 'Alex Trader',
  email: 'alex@finmate.app',
  bio: 'Professional options trader with 10 years of experience. I specialize in Nifty & BankNifty breakouts using Price Action. Helping retail traders become profitable.',
  strategyContext: 'I trade pure Price Action. I only take trades when RSI is between 40-60 for continuation, or >70/<30 for reversals. My favorite setup is a 15-minute flag breakout. I strictly risk 1% per trade. I avoid trading during RBI policy announcements.',
  sebiReg: 'INH000012345',
  avatarUrl: '',
  tradingStyles: ['Scalper', 'Nifty Options', 'Price Action', 'Swing'],
  socialLinks: {
    twitter: '@alextrader',
    youtube: 'Alex Trading Academy',
    instagram: '@alex.markets',
    telegram: 't.me/alexsignals'
  },
  youtubeVideos: [
    { id: '1', title: 'How to trade BankNifty Expiry?', thumbnail: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=400', views: '125K', url: '#' },
    { id: '2', title: 'My 1 Crore Profit Journey', thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400', views: '89K', url: '#' },
    { id: '3', title: 'Stop Loss Hunting Explained', thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=400', views: '45K', url: '#' }
  ],
  testimonials: [
    { id: '1', user: 'Rohan K.', avatar: 'https://i.pravatar.cc/150?u=rohan', text: 'Alex sir changed my psychology. I was losing money for 2 years, now I am consistently profitable.', rating: 5, role: 'Pro Member' },
    { id: '2', user: 'Sarah M.', avatar: 'https://i.pravatar.cc/150?u=sarah', text: 'The Nifty 50 signals are incredibly accurate. The logic he explains is gold.', rating: 5, role: 'Elite Member' },
    { id: '3', user: 'Vikram S.', avatar: 'https://i.pravatar.cc/150?u=vikram', text: 'Best community for options buyers. No noise, just pure price action.', rating: 4, role: 'Student' }
  ],
  milestones: [
    { year: '2023', title: 'Crossed 10k Students', description: 'Built one of India\'s largest trading communities.' },
    { year: '2021', title: 'SEBI Registration', description: 'Officially became a SEBI Registered Research Analyst.' },
    { year: '2018', title: 'Full Time Trading', description: 'Quit corporate job to trade markets full time.' },
    { year: '2014', title: 'First Trade', description: 'Started journey with equity delivery trading.' }
  ],
  toolsUsed: ['TradingView', 'Sensibull', 'Zerodha', 'FinMate', 'Screenr'],
  totalStudents: 12500,
  yearsExperience: 10
};

const defaultSignals: Signal[] = [
  {
    id: 'sig-1',
    symbol: 'NIFTY 50',
    type: 'BUY',
    entry: 22450,
    stopLoss: 22400,
    targets: [22550, 22600],
    status: 'HIT',
    timestamp: '2h ago',
    createdAt: Date.now() - 7200000,
    confidence: 'High',
    notes: 'Strong breakout above VWAP',
    exitPrice: 22550,
    pnl: 100
  },
  {
    id: 'sig-2',
    symbol: 'BANKNIFTY',
    type: 'SELL',
    entry: 47800,
    stopLoss: 47950,
    targets: [47500],
    status: 'ACTIVE',
    timestamp: '30m ago',
    createdAt: Date.now() - 1800000,
    confidence: 'Medium',
    notes: 'Resistance at daily high'
  }
];

const AppContext = createContext<GlobalState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from localStorage if available, else defaults
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('finmate_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [signals, setSignals] = useState<Signal[]>(() => {
    const saved = localStorage.getItem('finmate_signals');
    return saved ? JSON.parse(saved) : defaultSignals;
  });

  const [members] = useState<Member[]>([
    { id: '1', name: 'Rahul Sharma', plan: 'Elite', joinedDate: '2023-10-01', status: 'Active' },
    { id: '2', name: 'Priya Patel', plan: 'Pro', joinedDate: '2023-11-12', status: 'Active' },
    { id: '3', name: 'Amit Kumar', plan: 'Free', joinedDate: '2024-01-05', status: 'Active' },
    { id: '4', name: 'Sneha Gupta', plan: 'Pro', joinedDate: '2023-09-20', status: 'Churned' },
    { id: '5', name: 'Vikram Singh', plan: 'Elite', joinedDate: '2024-02-14', status: 'Active' },
  ]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('finmate_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('finmate_signals', JSON.stringify(signals));
  }, [signals]);

  const addSignal = (signal: Signal) => {
    setSignals(prev => [signal, ...prev]);
  };

  const updateSignal = (id: string, updates: Partial<Signal>) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{
      user,
      signals,
      members,
      theme: 'dark',
      addSignal,
      updateSignal,
      updateProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};