

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GlobalState, UserProfile, Signal, Member, ScheduledItem, PublishedContent, CreatorPersona, ContentDraft, NewsItem, FundamentalData, ContentRecommendation } from '../types';
import { generateGrowthStrategy } from '../services/geminiService';

const defaultUser: UserProfile = {
  name: 'Alex Trader',
  email: 'alex@finmate.app',
  bio: 'Professional options trader with 10 years of experience. I specialize in Nifty & BankNifty breakouts using Price Action.',
  persona: CreatorPersona.ANALYST, 
  contentNiche: 'Fundamental Analysis & Long Term Wealth',
  strategyContext: 'I trade pure Price Action. I only take trades when RSI is between 40-60 for continuation.',
  botConfig: {
    name: 'AlexBot',
    avatar: '',
    tone: 'Coach',
    signature: '- Team Alex',
    welcomeMessage: 'Welcome to the inner circle! 🚀 Check the pinned messages for today\'s levels.',
    enabled: true
  },
  integrationConfig: {
    telegram: {
      botToken: '',
      channelId: '',
      connected: false
    },
    whatsapp: {
      phoneNumberId: '',
      businessAccountId: '',
      connected: false
    },
    discord: {
      webhookUrl: '',
      connected: false
    }
  },
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
    { id: '2', user: 'Sarah M.', avatar: 'https://i.pravatar.cc/150?u=sarah', text: 'The Nifty 50 signals are incredibly accurate. The logic he explains is gold.', rating: 5, role: 'Elite Member' }
  ],
  milestones: [
    { year: '2023', title: 'Crossed 10k Students', description: 'Built one of India\'s largest trading communities.' },
    { year: '2021', title: 'SEBI Registration', description: 'Officially became a SEBI Registered Research Analyst.' }
  ],
  toolsUsed: ['TradingView', 'Sensibull', 'Zerodha', 'FinMate'],
  totalStudents: 12500,
  yearsExperience: 10,
  competitors: ['@competitor1', '@competitor2'],
  audienceDemographics: {
    industries: [
      { name: 'Financial Services', percentage: 45 },
      { name: 'Information Technology', percentage: 25 },
      { name: 'Education', percentage: 15 },
      { name: 'Other', percentage: 15 }
    ],
    jobFunctions: [
      { name: 'Finance', percentage: 40 },
      { name: 'Business Dev', percentage: 20 },
      { name: 'Engineering', percentage: 20 },
      { name: 'Operations', percentage: 10 }
    ],
    seniority: [
      { name: 'Senior', percentage: 35 },
      { name: 'Entry', percentage: 25 },
      { name: 'Director', percentage: 15 },
      { name: 'CXO', percentage: 5 },
      { name: 'Manager', percentage: 20 }
    ],
    locations: [
      { name: 'Mumbai', percentage: 40 },
      { name: 'Bangalore', percentage: 30 },
      { name: 'Delhi', percentage: 20 },
      { name: 'Pune', percentage: 10 }
    ]
  }
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
  }
];

const defaultReports: PublishedContent[] = [
  {
    id: 'rep-1',
    title: 'HDFC Bank Analysis',
    type: 'POST',
    symbol: 'HDFCBANK',
    contentBody: 'Q3 Results show NIM expansion. Valuation is at a 5-year low compared to book value.',
    platform: 'LINKEDIN',
    publishedAt: Date.now() - 86400000,
    format: 'CAROUSEL', // Was Text, changed to Carousel for demo variety
    metaData: {
      format: 'CAROUSEL',
      visualStyle: 'CORPORATE',
      hookType: 'QUESTION', // "Is HDFC Dead?"
      dominantTone: 'EDUCATIONAL',
      readabilityScore: 70
    },
    socialStats: {
      impressions: 12500,
      likes: 850,
      comments: 45,
      shares: 120,
      clicks: 450,
      performance: {
        ctr: 3.6,
        engagementRate: 8.1,
        viralVelocity: 'High'
      },
      deepMetrics: {
        saves: 120,
        dwellTimeAvg: 45, // seconds
        scrollDepthAvg: 85,
        profileVisits: 12,
        newFollowers: 5
      }
    }
  },
  {
    id: 'rep-2',
    title: 'Macro Alert: Inflation',
    type: 'POST',
    symbol: 'MACRO',
    contentBody: 'CPI Data suggests a cool off. RBI might pause rates.',
    platform: 'LINKEDIN',
    publishedAt: Date.now() - 172800000,
    format: 'TEXT',
    metaData: {
      format: 'TEXT',
      visualStyle: 'MINIMALIST',
      hookType: 'STATEMENT',
      dominantTone: 'URGENT',
      readabilityScore: 40 // Dense text
    },
    socialStats: {
      impressions: 2100, // Low impressions
      likes: 45,
      comments: 5,
      shares: 2,
      clicks: 10,
      performance: {
         ctr: 0.8,
         engagementRate: 1.2,
         viralVelocity: 'Low'
      },
      deepMetrics: {
        saves: 2,
        dwellTimeAvg: 4, // Low dwell
        scrollDepthAvg: 20,
        profileVisits: 1,
        newFollowers: 0
      }
    }
  }
];

const mockNews: NewsItem[] = [
    { id: '1', headline: 'Reliance Retail Revenue up 10% YoY', symbol: 'NSE:RELIANCE', source: 'Bloomberg', time: '10m ago', sentiment: 'Bullish', summary: 'Revenue hits all time high due to strong festival demand.', impactScore: 9 },
    { id: '2', headline: 'Jio Financials plans new lending arm', symbol: 'NSE:RELIANCE', source: 'Reuters', time: '1h ago', sentiment: 'Bullish', summary: 'Strategic move to capture market share in NBFC space.', impactScore: 8 },
    { id: '3', headline: 'TCS signs multi-year deal with UK Insurer', symbol: 'NSE:TCS', source: 'CNBC', time: '2h ago', sentiment: 'Bullish', summary: 'Deal valued at $500M over 5 years.', impactScore: 7 },
    { id: '4', headline: 'IT Sector outlook revised to stable', symbol: 'NSE:INFY', source: 'Mint', time: '3h ago', sentiment: 'Neutral', summary: 'Attrition rates cooling down across the sector.', impactScore: 5 },
    { id: '5', headline: 'HDFC Bank NIMs under pressure', symbol: 'NSE:HDFCBANK', source: 'Economic Times', time: '4h ago', sentiment: 'Bearish', summary: 'High cost of funds impacting margins in Q3.', impactScore: 8 },
];

// MOCK FUNDAMENTAL DATA (Simulating an API response)
const MOCK_FUNDAMENTALS: Record<string, FundamentalData> = {
  'RELIANCE': {
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd',
    currentPrice: 2450.00,
    changePercent: 1.25,
    marketCap: '₹16.5T',
    sector: 'Oil & Gas / Retail',
    ratios: { pe: 26.5, pb: 2.1, roe: 9.8, roce: 11.2, divYield: 0.3, debtToEq: 0.45 },
    quarterlyResults: [
      { period: 'Q4 FY23', revenue: 210000, profit: 16000, margin: 7.6 },
      { period: 'Q1 FY24', revenue: 205000, profit: 15500, margin: 7.5 },
      { period: 'Q2 FY24', revenue: 220000, profit: 17500, margin: 7.9 },
      { period: 'Q3 FY24', revenue: 235000, profit: 19000, margin: 8.1 },
    ],
    shareholding: { promoters: 50.3, fii: 22.5, dii: 15.2, public: 12.0 },
    alphaSignal: "📈 Revenue is at an all-time high despite oil volatility. Retail segment leading growth."
  },
  'TCS': {
    symbol: 'TCS',
    companyName: 'Tata Consultancy Services',
    currentPrice: 3890.00,
    changePercent: -0.5,
    marketCap: '₹14.2T',
    sector: 'IT Services',
    ratios: { pe: 29.1, pb: 12.5, roe: 46.2, roce: 54.1, divYield: 1.4, debtToEq: 0.0 },
    quarterlyResults: [
      { period: 'Q4 FY23', revenue: 59000, profit: 11000, margin: 18.6 },
      { period: 'Q1 FY24', revenue: 60500, profit: 11500, margin: 19.0 },
      { period: 'Q2 FY24', revenue: 61000, profit: 11800, margin: 19.3 },
      { period: 'Q3 FY24', revenue: 62500, profit: 12100, margin: 19.4 },
    ],
    shareholding: { promoters: 72.3, fii: 12.5, dii: 10.2, public: 5.0 },
    alphaSignal: "⚠️ Best-in-class Margins (19.4%), but revenue growth is slowing. Focus on efficiency."
  }
};

const AppContext = createContext<GlobalState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('finmate_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [signals, setSignals] = useState<Signal[]>(() => {
    const saved = localStorage.getItem('finmate_signals');
    return saved ? JSON.parse(saved) : defaultSignals;
  });

  const [reports, setReports] = useState<PublishedContent[]>(() => {
    const saved = localStorage.getItem('finmate_reports');
    return saved ? JSON.parse(saved) : defaultReports;
  });

  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>(() => {
    const saved = localStorage.getItem('finmate_scheduled');
    return saved ? JSON.parse(saved) : [];
  });

  const [members] = useState<Member[]>([
    { id: '1', name: 'Rahul Sharma', plan: 'Elite', joinedDate: '2023-10-01', status: 'Active' },
    { id: '2', name: 'Priya Patel', plan: 'Pro', joinedDate: '2023-11-12', status: 'Active' },
    { id: '3', name: 'Amit Kumar', plan: 'Free', joinedDate: '2024-01-05', status: 'Active' },
  ]);

  const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', 'TCS', 'INFY', 'HDFCBANK']);
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>(mockNews);
  
  const [activeDraft, setActiveDraft] = useState<ContentDraft | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');
  const [currentFundamentalData, setCurrentFundamentalData] = useState<FundamentalData | null>(null);

  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [canvasContent, setCanvasContent] = useState<string>('');
  
  // Recommendations State
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);

  // Fetch Fundamentals when selectedSymbol changes
  useEffect(() => {
    const cleanSymbol = selectedSymbol.replace('NSE:', '').trim().toUpperCase();
    if (MOCK_FUNDAMENTALS[cleanSymbol]) {
      setCurrentFundamentalData(MOCK_FUNDAMENTALS[cleanSymbol]);
    } else {
      // Fallback mock if data missing
      setCurrentFundamentalData({
        symbol: cleanSymbol,
        companyName: `${cleanSymbol} Corp`,
        currentPrice: 1000,
        changePercent: 0,
        marketCap: '₹--',
        sector: 'Unknown',
        ratios: { pe: 0, pb: 0, roe: 0, roce: 0, divYield: 0, debtToEq: 0 },
        quarterlyResults: [],
        shareholding: { promoters: 0, fii: 0, dii: 0, public: 0 },
        alphaSignal: "Data unavailable for this symbol."
      });
    }
  }, [selectedSymbol]);

  // Generate Recommendations on Load
  useEffect(() => {
    const fetchRecs = async () => {
        const recs = await generateGrowthStrategy(reports);
        setRecommendations(recs);
    };
    if (user.persona !== CreatorPersona.TRADER) {
        fetchRecs();
    }
  }, [user.persona, reports]);

  useEffect(() => {
    localStorage.setItem('finmate_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('finmate_signals', JSON.stringify(signals));
  }, [signals]);

  useEffect(() => {
    localStorage.setItem('finmate_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('finmate_scheduled', JSON.stringify(scheduledItems));
  }, [scheduledItems]);

  const addSignal = (signal: Signal) => {
    setSignals(prev => [signal, ...prev]);
  };

  const updateSignal = (id: string, updates: Partial<Signal>) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addReport = (report: PublishedContent) => {
    setReports(prev => [report, ...prev]);
  };

  const addScheduledItem = (item: ScheduledItem) => {
    setScheduledItems(prev => [...prev, item].sort((a, b) => a.scheduledTime - b.scheduledTime));
  };

  const removeScheduledItem = (id: string) => {
    setScheduledItems(prev => prev.filter(i => i.id !== id));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };
  
  const addToWatchlist = (symbol: string) => {
    const clean = symbol.replace('NSE:', '').toUpperCase();
    if (!watchlist.includes(clean)) setWatchlist(prev => [...prev, clean]);
  };
  
  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  };

  return (
    <AppContext.Provider value={{
      user,
      signals,
      reports,
      scheduledItems,
      members,
      theme: 'dark',
      activeDraft,
      setActiveDraft,
      selectedSymbol,
      setSelectedSymbol,
      currentFundamentalData,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      newsFeed,
      generatedImages,
      canvasContent,
      setCanvasContent,
      recommendations, // NEW
      addSignal,
      updateSignal,
      addReport,
      addScheduledItem,
      removeScheduledItem,
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