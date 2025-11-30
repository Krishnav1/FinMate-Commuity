

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

export enum CreatorPersona {
  TRADER = 'TRADER',       // Technical Analysis, Signals, Levels
  ANALYST = 'ANALYST',     // Fundamental Analysis, Long-term, Reports
  EDUCATOR = 'EDUCATOR'    // News, Crypto, Macro, General Knowledge
}

export interface BotConfig {
  name: string;
  avatar: string;
  tone: 'Professional' | 'Friendly' | 'Strict' | 'Sarcastic' | 'Coach';
  signature: string;
  welcomeMessage: string;
  enabled: boolean;
}

export interface IntegrationConfig {
  telegram?: {
    botToken: string;
    channelId: string;
    connected: boolean;
  };
  whatsapp?: {
    phoneNumberId: string;
    businessAccountId: string;
    connected: boolean;
  };
  discord?: {
    webhookUrl: string;
    connected: boolean;
  };
}

export interface Signal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  targets: number[];
  status: 'ACTIVE' | 'HIT' | 'STOPPED' | 'PENDING' | 'SCHEDULED';
  timestamp: string;
  createdAt: number;
  confidence: 'High' | 'Medium' | 'Low';
  notes?: string;
  exitPrice?: number;
  pnl?: number;
}

// --- NEW FUNDAMENTAL DATA TYPES (Custom API Mock) ---
export interface FinancialQuarter {
  period: string;
  revenue: number;
  profit: number;
  margin: number;
}

export interface FundamentalData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  changePercent: number;
  marketCap: string;
  sector: string;
  ratios: {
    pe: number;
    pb: number;
    roe: number;
    roce: number;
    divYield: number;
    debtToEq: number;
  };
  quarterlyResults: FinancialQuarter[];
  shareholding: {
    promoters: number;
    fii: number;
    dii: number;
    public: number;
  };
  alphaSignal: string; // AI Generated "Key Insight"
}
// ----------------------------------------------------

export interface Demographics {
  industries: { name: string; percentage: number }[];
  jobFunctions: { name: string; percentage: number }[];
  seniority: { name: string; percentage: number }[];
  locations: { name: string; percentage: number }[];
}

export interface PostPerformance {
  ctr: number; // Click Through Rate
  engagementRate: number;
  viralVelocity: 'High' | 'Medium' | 'Low'; // Speed of engagement in 1st hour
  formatScore?: number; // Internal score for format efficacy
}

// --- NEW GROWTH INTELLIGENCE TYPES ---
export interface ContentMetaData {
  format: 'CAROUSEL' | 'TEXT' | 'IMAGE' | 'VIDEO';
  slideCount?: number;
  visualStyle?: VisualStyle; // 'Corporate', 'Minimalist' etc.
  hookType: 'QUESTION' | 'NUMBER' | 'NEGATIVE' | 'STATEMENT'; // e.g., "Is HDFC Dead?" (Question) vs "5 Reasons..." (Number)
  dominantTone: 'PROFESSIONAL' | 'URGENT' | 'CASUAL' | 'EDUCATIONAL';
  readabilityScore: number; // 1-100 (Flesch-Kincaid)
}

export interface DeepPerformanceMetrics {
  saves: number; // The "Gold Standard" metric
  dwellTimeAvg: number; // Simulated in seconds
  scrollDepthAvg: number; // Percentage
  profileVisits: number;
  newFollowers: number;
}

export interface PublishedContent {
  id: string;
  title: string;
  type: 'REPORT' | 'POST' | 'SIGNAL';
  symbol?: string;
  contentBody: string;
  platform: 'LINKEDIN' | 'TWITTER' | 'TELEGRAM' | 'ALL';
  publishedAt: number;
  imageUrl?: string;
  format?: 'TEXT' | 'CAROUSEL' | 'VIDEO' | 'IMAGE'; 
  
  // Growth Intelligence Data
  metaData?: ContentMetaData;
  socialStats?: {
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    performance?: PostPerformance;
    deepMetrics?: DeepPerformanceMetrics; // NEW
  };
}

export interface ContentRecommendation {
  id: string;
  title: string;
  reason: string;
  actionType: 'REPURPOSE' | 'TREND_JACK' | 'FORMAT_PIVOT' | 'DEEP_DIVE';
  suggestedDraft: string;
  expectedImpact: 'High' | 'Medium';
  referencePostId?: string; // If based on a past post
}

// --- VISUAL CONTENT CREATION TYPES ---
export interface CarouselSlide {
  id: number;
  title: string;
  body: string;
  imageUrl?: string;
  isGenerated?: boolean; // Has the visual been created?
}

export type VisualStyle = 'MINIMALIST' | 'CORPORATE' | 'CYBERPUNK' | 'EDITORIAL' | 'BOLD';

export interface ContentDraft {
  id?: string;
  symbol?: string;
  title?: string;
  text: string;
  generatedImageUrl?: string;
  platforms: ('LINKEDIN' | 'TWITTER' | 'TELEGRAM')[];
  sourceNews?: NewsItem;
  userInsight?: string;
  sourceDataPoint?: string; 
  strategyOrigin?: string; 
  
  // Carousel Specific
  isCarousel?: boolean;
  slides?: CarouselSlide[];
  visualStyle?: VisualStyle;
  postCaption?: string; // The summary text that goes with the carousel
}

export interface PromptTemplate {
  id: string;
  label: string;
  description: string;
  icon: any; 
  systemPrompt: string;
  category: 'Fundamental' | 'Technical' | 'Social';
}

export interface ContentOpportunity {
  id: string;
  headline: string;
  symbol: string;
  type: 'EARNINGS' | 'MACRO' | 'NEWS' | 'TREND';
  aiSuggestion: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  urgency: 'High' | 'Medium' | 'Low';
}

export interface ScheduledItem {
  id: string;
  type: 'SIGNAL' | 'POST' | 'AUDIO' | 'REPORT';
  content: any;
  scheduledTime: number;
  channels: string[];
  status: 'QUEUED' | 'PUBLISHED';
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
  symbol: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  summary?: string;
  link?: string;
  impactScore?: number; 
}

export interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
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
  icon?: any;
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  persona: CreatorPersona;
  contentNiche: string; 
  strategyContext: string;
  botConfig: BotConfig;
  integrationConfig: IntegrationConfig;
  sebiReg: string;
  avatarUrl: string;
  tradingStyles: string[];
  socialLinks: { twitter?: string; youtube?: string; instagram?: string; telegram?: string };
  youtubeVideos: VideoContent[];
  testimonials: Testimonial[];
  milestones: Milestone[];
  toolsUsed: string[];
  totalStudents: number;
  yearsExperience: number;
  competitors?: string[];
  audienceDemographics?: Demographics;
}

export interface GlobalState {
  user: UserProfile;
  signals: Signal[];
  reports: PublishedContent[];
  scheduledItems: ScheduledItem[];
  members: Member[];
  theme: 'dark' | 'light';
  
  // Research Hub State
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  newsFeed: NewsItem[];
  currentFundamentalData: FundamentalData | null;
  
  // Content State
  activeDraft: ContentDraft | null;
  setActiveDraft: (draft: ContentDraft | null) => void;
  generatedImages: string[];
  recommendations: ContentRecommendation[]; // NEW
  
  // Canvas State
  canvasContent: string;
  setCanvasContent: (content: string | ((prev: string) => string)) => void;
  
  // Actions
  addSignal: (signal: Signal) => void;
  updateSignal: (id: string, updates: Partial<Signal>) => void;
  addReport: (report: PublishedContent) => void;
  addScheduledItem: (item: ScheduledItem) => void;
  removeScheduledItem: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}