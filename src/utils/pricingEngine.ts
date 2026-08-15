import { BusinessConfig, CalculatedQuote, EventType, QuoteTier } from '../types';
import { DECOR_THEMES } from '../data/decorThemes';
import { DECOR_ADD_ONS } from '../data/addOns';

export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
  companyName: 'LuxeAura Event Artistry',
  ownerName: 'Elena Vance',
  email: 'concierge@luxeaura-events.com',
  phone: '+1 (555) 894-3200',
  currency: 'USD',
  currencySymbol: '$',
  highValueThreshold: 2500,
  enableAudioAlerts: true,
  enablePushAlerts: true,
  aiPersonaName: 'Aura',
  basePrices: {
    'Wedding': 1800,
    'Luxury Gala': 2200,
    'Corporate Event': 1500,
    'Birthday Celebration': 900,
    'Anniversary': 1100,
    'Baby Shower': 750,
    'Engagement Party': 950,
    'Other': 800,
  },
  costPerGuest: 12, // $12 per guest for centerpiece and table accent scaling
};

export interface QuoteCalculationInput {
  eventType: EventType;
  guestCount: number;
  eventDate: string;
  venueType?: string;
  themeId?: string;
  selectedAddOns?: string[];
  config?: BusinessConfig;
}

export function calculateEstimatedQuote(input: QuoteCalculationInput): CalculatedQuote {
  const config = input.config || DEFAULT_BUSINESS_CONFIG;
  const guestCount = Math.max(10, Number(input.guestCount) || 50);
  const eventType = input.eventType || 'Wedding';
  const baseSetupFee = config.basePrices[eventType] || 1200;

  // Find theme multiplier
  const theme = DECOR_THEMES.find(t => t.id === input.themeId) || DECOR_THEMES[0];
  const themeMultiplier = theme ? theme.multiplier : 1.2;

  // Calculate selected add-ons cost
  const selectedAddOnIds = input.selectedAddOns || [];
  const addOnsCost = selectedAddOnIds.reduce((sum, addOnId) => {
    const item = DECOR_ADD_ONS.find(a => a.id === addOnId);
    return sum + (item ? item.price : 0);
  }, 0);

  // Guest scale cost
  const guestCost = guestCount * config.costPerGuest;

  // Silver (Essential) tier
  const silverBase = Math.round(baseSetupFee * 0.85);
  const silverGuest = Math.round(guestCost * 0.75);
  const silverTheme = Math.round(silverBase * (themeMultiplier - 1) * 0.6);
  const silverAddOns = Math.round(addOnsCost * 0.5); // Includes top priority add-on partially
  const silverTotal = silverBase + silverGuest + silverTheme + silverAddOns;

  const silverTier: QuoteTier = {
    id: 'silver',
    name: 'Silver Essential',
    tagline: 'Refined essentials for intimate and sleek gatherings',
    totalPrice: silverTotal,
    depositRequired: Math.round(silverTotal * 0.35),
    highlighted: false,
    features: [
      'Custom 8ft Themed Backdrop / Photo Zone',
      'Table Centerpieces for all tables (Standard)',
      'Warm Ambient LED Uplighting Package',
      'Welcome Easel & Seating Chart Display',
      'Standard Setup, Styling & Next-Day Teardown'
    ],
    breakdown: {
      baseSetup: silverBase,
      guestCost: silverGuest,
      themeCost: silverTheme,
      addOnsCost: silverAddOns,
      seasonDiscountOrFee: 0,
    }
  };

  // Gold (Signature Luxury - Default Recommended)
  const goldBase = Math.round(baseSetupFee);
  const goldGuest = Math.round(guestCost);
  const goldTheme = Math.round(goldBase * (themeMultiplier - 1));
  const goldAddOns = Math.round(addOnsCost);
  const goldTotal = goldBase + goldGuest + goldTheme + goldAddOns;

  const goldTier: QuoteTier = {
    id: 'gold',
    name: 'Gold Signature Luxury',
    tagline: 'Our most sought-after full visual transformation',
    totalPrice: goldTotal,
    depositRequired: Math.round(goldTotal * 0.35),
    highlighted: true,
    features: [
      'Grand 10ft Themed Statement Archway / Stage Backdrop',
      'Lush Elevated Florals & Candlestick Tablescaping',
      'Synchronized Intelligent Color-Tuned Mood Lighting',
      'Custom Laser-Cut Acrylic Welcome Mirror Sign',
      ...selectedAddOnIds.slice(0, 2).map(id => {
        const item = DECOR_ADD_ONS.find(a => a.id === id);
        return item ? item.name : 'Premium Upgrade';
      }),
      'Dedicated On-Site Styling Director for 4 Hours'
    ],
    breakdown: {
      baseSetup: goldBase,
      guestCost: goldGuest,
      themeCost: goldTheme,
      addOnsCost: goldAddOns,
      seasonDiscountOrFee: 0,
    }
  };

  // Platinum (Bespoke Royal)
  const platinumBase = Math.round(baseSetupFee * 1.45);
  const platinumGuest = Math.round(guestCost * 1.35);
  const platinumTheme = Math.round(platinumBase * (themeMultiplier - 1) * 1.3);
  const platinumAddOns = Math.round(addOnsCost * 1.25) + 450; // extra bespoke elements
  const platinumTotal = platinumBase + platinumGuest + platinumTheme + platinumAddOns;

  const platinumTier: QuoteTier = {
    id: 'platinum',
    name: 'Platinum Bespoke Royal',
    tagline: 'Immersive celebrity-grade experience with 360° styling',
    totalPrice: platinumTotal,
    depositRequired: Math.round(platinumTotal * 0.4),
    highlighted: false,
    features: [
      'Full 360° Ceiling-to-Floor Spatial Transformation',
      '12ft Grand Fresh Flower Installation with Crystal Fixtures',
      'Complete Luxury Tablescaping (Gold Cutlery + Glass Chargers)',
      'Custom Neon + Backlit Stage + Starlight Ceiling Draping',
      'All Selected Add-ons Included & Priority Installation Crew',
      'Full Day On-Site Lead Designer & Teardown Concierge'
    ],
    breakdown: {
      baseSetup: platinumBase,
      guestCost: platinumGuest,
      themeCost: platinumTheme,
      addOnsCost: platinumAddOns,
      seasonDiscountOrFee: 0,
    }
  };

  const isHighValue = goldTotal >= config.highValueThreshold || guestCount >= 120;
  
  // Score out of 100
  let score = 50;
  if (goldTotal >= 3500) score += 30;
  else if (goldTotal >= 2500) score += 20;
  else if (goldTotal >= 1500) score += 10;

  if (guestCount >= 100) score += 15;
  if (selectedAddOnIds.length >= 2) score += 10;

  return {
    id: `quote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    calculatedAt: new Date().toISOString(),
    selectedTier: 'gold',
    guestCount,
    eventType,
    eventDate: input.eventDate || 'Upcoming',
    venueType: input.venueType || 'Ballroom / Event Space',
    themeId: theme.id,
    themeName: theme.name,
    selectedAddOns: selectedAddOnIds,
    tiers: {
      silver: silverTier,
      gold: goldTier,
      platinum: platinumTier,
    },
    totalEstimatedValue: goldTotal,
    isHighValue,
    score: Math.min(100, score),
  };
}

export function formatCurrency(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toLocaleString('en-US')}`;
}
