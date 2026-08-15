export type MessagingChannel = 'whatsapp' | 'instagram' | 'website_widget' | 'direct_portal';

export type EventType = 
  | 'Wedding'
  | 'Luxury Gala'
  | 'Birthday Celebration'
  | 'Corporate Event'
  | 'Baby Shower'
  | 'Anniversary'
  | 'Engagement Party'
  | 'Other';

export type PipelineStage = 
  | 'new_inquiry'
  | 'qualifying'
  | 'quote_sent'
  | 'high_value_vip'
  | 'proposal_sent'
  | 'booked_deposit'
  | 'closed_lost';

export interface DecorTheme {
  id: string;
  name: string;
  tagline: string;
  description: string;
  multiplier: number;
  palette: string[];
  gradient: string;
  bgImage: string;
  badge: string;
  popularFor: EventType[];
  includedFeatures: string[];
}

export interface AddOnItem {
  id: string;
  name: string;
  category: 'Florals' | 'Backdrops' | 'Lighting' | 'Tablescape' | 'Special FX' | 'Interactive';
  price: number;
  description: string;
  icon: string;
  popular?: boolean;
}

export interface QuoteTier {
  id: 'silver' | 'gold' | 'platinum';
  name: string;
  tagline: string;
  totalPrice: number;
  depositRequired: number;
  highlighted?: boolean;
  features: string[];
  breakdown: {
    baseSetup: number;
    guestCost: number;
    themeCost: number;
    addOnsCost: number;
    seasonDiscountOrFee: number;
  };
}

export interface CalculatedQuote {
  id: string;
  calculatedAt: string;
  selectedTier: 'silver' | 'gold' | 'platinum';
  guestCount: number;
  eventType: EventType;
  eventDate: string;
  venueType: string;
  themeId: string;
  themeName: string;
  selectedAddOns: string[];
  tiers: {
    silver: QuoteTier;
    gold: QuoteTier;
    platinum: QuoteTier;
  };
  totalEstimatedValue: number;
  isHighValue: boolean;
  score: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'agent' | 'system';
  content: string;
  timestamp: string;
  channel: MessagingChannel;
  interactiveQuote?: CalculatedQuote;
  quickReplies?: string[];
  mediaUrl?: string;
}

export interface LeadScoreDetails {
  totalScore: number;
  isHighValue: boolean;
  budgetScore: number;
  guestCountScore: number;
  urgencyScore: number;
  addOnScore: number;
  reasons: string[];
}

export interface Lead {
  id: string;
  clientName: string;
  clientHandle?: string;
  channel: MessagingChannel;
  contact: {
    phone: string;
    email: string;
    location?: string;
  };
  eventType: EventType;
  eventDate: string;
  guestCount: number;
  venueType: string;
  themeId: string;
  themeName: string;
  selectedAddOns: string[];
  budgetExpectation?: number;
  calculatedQuote?: CalculatedQuote;
  stage: PipelineStage;
  scoreDetails: LeadScoreDetails;
  isHighValueAlert: boolean;
  alertAcknowledged: boolean;
  messages: ChatMessage[];
  internalNotes: string;
  createdAt: string;
  lastActivityAt: string;
  assignedTo?: string;
  tags: string[];
}

export interface BusinessConfig {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  currency: string;
  currencySymbol: string;
  highValueThreshold: number; // e.g., $2,500
  enableAudioAlerts: boolean;
  enablePushAlerts: boolean;
  aiPersonaName: string;
  geminiApiKey?: string;
  webhookUrl?: string;
  basePrices: {
    Wedding: number;
    'Luxury Gala': number;
    'Birthday Celebration': number;
    'Corporate Event': number;
    'Baby Shower': number;
    'Anniversary': number;
    'Engagement Party': number;
    'Other': number;
  };
  costPerGuest: number;
}
