export enum View {
  DASHBOARD = 'DASHBOARD',
  CHART_STUDIO = 'CHART_STUDIO',
  TRADE_FLOW = 'TRADE_FLOW',
  ANALYTICS = 'ANALYTICS',
  COMMUNITY = 'COMMUNITY',
  COURSES = 'COURSES',
  REVENUE = 'REVENUE',
  SETTINGS = 'SETTINGS'
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
  confidence: 'High' | 'Medium' | 'Low';
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