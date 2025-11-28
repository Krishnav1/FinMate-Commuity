export enum View {
  DASHBOARD = 'DASHBOARD',
  CHART_STUDIO = 'CHART_STUDIO',
  TRADE_FLOW = 'TRADE_FLOW',
  ANALYTICS = 'ANALYTICS',
  COMMUNITY = 'COMMUNITY',
  COURSES = 'COURSES',
  REVENUE = 'REVENUE',
  SETTINGS = 'SETTINGS',
  PUBLIC_PROFILE = 'PUBLIC_PROFILE'
}

export interface Signal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  targets: number[];
  status: 'ACTIVE' | 'HIT' | 'STOPPED' | 'PENDING';
  timestamp: string;
  createdAt: number; // Added for sorting
  confidence: 'High' | 'Medium' | 'Low';
  notes?: string;
  exitPrice?: number; // Price where trade was closed
  pnl?: number; // Realized PnL
}

export interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface Member {
  id: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Elite';
  joinedDate: string;
  status: 'Active' | 'Churned';
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface MarketTicker {
  symbol: string;
  price: number;
  change: number;
}

export interface VideoContent {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  url: string;
}

export interface Testimonial {
  id: string;
  user: string;
  avatar: string;
  text: string;
  rating: number;
  role: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  strategyContext: string; // The "Brain" for the AI
  sebiReg: string;
  avatarUrl: string;
  // Portfolio Fields
  tradingStyles: string[];
  socialLinks: { twitter?: string; youtube?: string; instagram?: string; telegram?: string };
  youtubeVideos: VideoContent[];
  testimonials: Testimonial[];
  milestones: Milestone[];
  toolsUsed: string[];
  totalStudents: number;
  yearsExperience: number;
}

export interface GlobalState {
  user: UserProfile;
  signals: Signal[];
  members: Member[];
  theme: 'dark' | 'light';
  addSignal: (signal: Signal) => void;
  updateSignal: (id: string, updates: Partial<Signal>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}