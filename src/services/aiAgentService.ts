import { BusinessConfig, CalculatedQuote, EventType } from '../types';
import { DECOR_THEMES } from '../data/decorThemes';
import { DECOR_ADD_ONS } from '../data/addOns';
import { calculateEstimatedQuote } from '../utils/pricingEngine';

export interface IntakeContext {
  eventType?: EventType;
  guestCount?: number;
  eventDate?: string;
  venueType?: string;
  themeId?: string;
  selectedAddOns?: string[];
  clientName?: string;
  phone?: string;
  email?: string;
  budgetExpectation?: number;
  stage: 'greeting' | 'event_details' | 'guests_and_date' | 'theme_selection' | 'addons_and_budget' | 'quote_ready' | 'booked';
}

export interface AgentResponse {
  replyText: string;
  quickReplies?: string[];
  updatedContext: IntakeContext;
  quoteGenerated?: CalculatedQuote;
}

// Keyword extractors
function extractEventType(text: string): EventType | undefined {
  const lower = text.toLowerCase();
  if (lower.includes('wedding') || lower.includes('bride') || lower.includes('groom') || lower.includes('reception') || lower.includes('marriage')) return 'Wedding';
  if (lower.includes('gala') || lower.includes('ball') || lower.includes('fundraiser')) return 'Luxury Gala';
  if (lower.includes('birthday') || lower.includes('bday') || lower.includes('turning') || lower.includes('sweet 16') || lower.includes('quinceañera')) return 'Birthday Celebration';
  if (lower.includes('corporate') || lower.includes('company') || lower.includes('summit') || lower.includes('annual dinner') || lower.includes('awards')) return 'Corporate Event';
  if (lower.includes('baby shower') || lower.includes('gender reveal') || lower.includes('newborn')) return 'Baby Shower';
  if (lower.includes('anniversary') || lower.includes('renewal')) return 'Anniversary';
  if (lower.includes('engagement') || lower.includes('proposal party') || lower.includes('roka')) return 'Engagement Party';
  return undefined;
}

function extractGuestCount(text: string): number | undefined {
  const match = text.match(/(\d{1,4})\s*(?:guests?|people|attendees|pax|friends|invites)?/i);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    if (num >= 5 && num <= 5000) return num;
  }
  return undefined;
}

function extractTheme(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const theme of DECOR_THEMES) {
    const nameLower = theme.name.toLowerCase();
    if (lower.includes(theme.id) || lower.includes(nameLower)) return theme.id;
    // Check keywords
    if (theme.id === 'luxury_royal_floral' && (lower.includes('royal') || lower.includes('orchid') || lower.includes('gold floral') || lower.includes('luxury floral'))) return theme.id;
    if (theme.id === 'bohemian_chic_meadow' && (lower.includes('boho') || lower.includes('pampas') || lower.includes('terracotta') || lower.includes('meadow') || lower.includes('rustic'))) return theme.id;
    if (theme.id === 'modern_minimalist_noir' && (lower.includes('minimalist') || lower.includes('noir') || lower.includes('chrome') || lower.includes('modern black'))) return theme.id;
    if (theme.id === 'enchanted_secret_garden' && (lower.includes('garden') || lower.includes('enchanted') || lower.includes('wisteria') || lower.includes('fairy tale'))) return theme.id;
    if (theme.id === 'cyberpunk_celestial_neon' && (lower.includes('neon') || lower.includes('celestial') || lower.includes('starlight') || lower.includes('cyberpunk') || lower.includes('nightclub'))) return theme.id;
    if (theme.id === 'classic_timeless_elegance' && (lower.includes('classic') || lower.includes('white and gold') || lower.includes('timeless') || lower.includes('candelabra'))) return theme.id;
  }
  return undefined;
}

function extractAddOns(text: string): string[] {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  if (lower.includes('arch') || lower.includes('entrance arch')) matched.push('addon_grand_arch');
  if (lower.includes('drape') || lower.includes('draping') || lower.includes('ceiling') || lower.includes('starlight')) matched.push('addon_ceiling_drape');
  if (lower.includes('neon') || lower.includes('sign') || lower.includes('hashtag')) matched.push('addon_neon_sign');
  if (lower.includes('champagne') || lower.includes('wall')) matched.push('addon_champagne_wall');
  if (lower.includes('photobooth') || lower.includes('photo booth') || lower.includes('camera')) matched.push('addon_photobooth');
  if (lower.includes('charger') || lower.includes('cutlery') || lower.includes('flatware') || lower.includes('tableware')) matched.push('addon_tablescape_deluxe');
  if (lower.includes('spark') || lower.includes('pyro') || lower.includes('cold spark')) matched.push('addon_cold_sparks');
  if (lower.includes('fog') || lower.includes('cloud') || lower.includes('dry ice')) matched.push('addon_fog_machine');
  if (lower.includes('lounge') || lower.includes('sofa') || lower.includes('velvet')) matched.push('addon_lounge_seating');
  return matched;
}

function extractDate(text: string): string | undefined {
  // Regex for dates like "Sept 18", "October 24th", "2026-11-15", "12/25/2026", "next month"
  const dateRegex = /\b(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,\s*\d{4})?|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\b/i;
  const match = text.match(dateRegex);
  if (match) return match[0];
  return undefined;
}

function extractEmail(text: string): string | undefined {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const match = text.match(emailRegex);
  return match ? match[1] : undefined;
}

function extractPhone(text: string): string | undefined {
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : undefined;
}

export async function processAgentMessage(
  userMessage: string,
  currentContext: IntakeContext,
  config: BusinessConfig
): Promise<AgentResponse> {
  const updatedContext: IntakeContext = { ...currentContext };
  const persona = config.aiPersonaName || 'Aura';

  // 1. Extract newly mentioned entities
  const eventType = extractEventType(userMessage);
  if (eventType) updatedContext.eventType = eventType;

  const guestCount = extractGuestCount(userMessage);
  if (guestCount) updatedContext.guestCount = guestCount;

  const themeId = extractTheme(userMessage);
  if (themeId) updatedContext.themeId = themeId;

  const date = extractDate(userMessage);
  if (date) updatedContext.eventDate = date;

  const email = extractEmail(userMessage);
  if (email) updatedContext.email = email;

  const phone = extractPhone(userMessage);
  if (phone) updatedContext.phone = phone;

  const newAddOns = extractAddOns(userMessage);
  if (newAddOns.length > 0) {
    const existing = updatedContext.selectedAddOns || [];
    updatedContext.selectedAddOns = Array.from(new Set([...existing, ...newAddOns]));
  }

  // 2. Check if we have enough parameters to generate a quotation
  const hasEvent = !!updatedContext.eventType;
  const hasGuests = !!updatedContext.guestCount;
  const hasTheme = !!updatedContext.themeId;
  const hasDate = !!updatedContext.eventDate;

  // If user says "get quote", "estimate", "pricing" or provides sufficient core details
  const wantsQuote = userMessage.toLowerCase().includes('quote') || 
                     userMessage.toLowerCase().includes('price') || 
                     userMessage.toLowerCase().includes('how much') ||
                     userMessage.toLowerCase().includes('estimate') ||
                     (hasEvent && hasGuests);

  if (wantsQuote || (hasEvent && hasGuests && (hasTheme || hasDate))) {
    // Generate quotation
    const quote = calculateEstimatedQuote({
      eventType: updatedContext.eventType || 'Wedding',
      guestCount: updatedContext.guestCount || 100,
      eventDate: updatedContext.eventDate || 'Upcoming Date',
      venueType: updatedContext.venueType || 'Ballroom / Event Venue',
      themeId: updatedContext.themeId || 'luxury_royal_floral',
      selectedAddOns: updatedContext.selectedAddOns || ['addon_grand_arch'],
      config,
    });

    updatedContext.stage = 'quote_ready';

    const selectedThemeObj = DECOR_THEMES.find(t => t.id === quote.themeId);
    const themeName = selectedThemeObj ? selectedThemeObj.name : 'Bespoke Luxury';

    return {
      replyText: `I've put together a personalized estimate for your **${quote.eventType}** (${quote.guestCount} guests) featuring our **${themeName}** design! ✨\n\nTake a look at the interactive packages below — our **Gold Signature** package is the most popular for full room transformation. You can reserve this quote or request custom modifications:`,
      quickReplies: ['Book Gold Package 💍', 'Add 360 Photo Booth 📸', 'Schedule Styling Call 📞', 'Customize Items ✏️'],
      updatedContext,
      quoteGenerated: quote,
    };
  }

  // Conversational state progression
  if (!updatedContext.eventType) {
    return {
      replyText: `Hello! I'm ${persona}, your 24/7 AI Event Stylist at ${config.companyName}. ✨\n\nI'd love to help bring your vision to life and build an instant estimated quote. What type of celebration are we designing?`,
      quickReplies: ['💍 Luxury Wedding', '🥂 Corporate Gala', '🎂 Milestone Birthday', '🍼 Baby Shower', '✨ Anniversary'],
      updatedContext,
    };
  }

  if (!updatedContext.guestCount) {
    return {
      replyText: `A **${updatedContext.eventType}** sounds wonderful! 🥂 To calculate accurate floral volume and tablescaping, approximately how many guests will you be hosting?`,
      quickReplies: ['50 Guests (Intimate)', '100 - 150 Guests', '200+ Guests (Grand)', '300+ Gala Scale'],
      updatedContext,
    };
  }

  if (!updatedContext.themeId) {
    return {
      replyText: `Got it, styling for **${updatedContext.guestCount} guests**! 🎨 Which aesthetic mood resonates most with your event vibe?`,
      quickReplies: ['👑 Luxury Royal Floral', '🌿 Bohemian Chic Meadow', '✨ Modern Luxe Noir', '🧚 Enchanted Secret Garden', '⚡ Celestial Neon Glow'],
      updatedContext,
    };
  }

  if (!updatedContext.eventDate) {
    return {
      replyText: `The **${DECOR_THEMES.find(t => t.id === updatedContext.themeId)?.name}** theme will look stunning! 📅 What date or month are you planning for your celebration?`,
      quickReplies: ['Next Month', 'Fall 2026', 'Winter Holidays', 'Spring 2027'],
      updatedContext,
    };
  }

  // Default fallback if all basics filled
  const quote = calculateEstimatedQuote({
    eventType: updatedContext.eventType,
    guestCount: updatedContext.guestCount,
    eventDate: updatedContext.eventDate,
    themeId: updatedContext.themeId,
    selectedAddOns: updatedContext.selectedAddOns,
    config,
  });

  return {
    replyText: `Here is your customized quotation based on your selected preferences! ✨`,
    quickReplies: ['Lock in Date 🔒', 'Speak to Lead Stylist 📞', 'Download PDF Proposal 📄'],
    updatedContext,
    quoteGenerated: quote,
  };
}
