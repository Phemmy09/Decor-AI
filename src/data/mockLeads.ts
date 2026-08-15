import { Lead } from '../types';
import { calculateEstimatedQuote, DEFAULT_BUSINESS_CONFIG } from '../utils/pricingEngine';
import { calculateLeadScore } from '../utils/leadScorer';

// Seed Lead 1: High-Value VIP Wedding (Instagram DM)
const quote1 = calculateEstimatedQuote({
  eventType: 'Wedding',
  guestCount: 220,
  eventDate: '2026-09-18',
  venueType: 'The St. Regis Grand Ballroom',
  themeId: 'luxury_royal_floral',
  selectedAddOns: ['addon_grand_arch', 'addon_ceiling_drape', 'addon_cold_sparks'],
  config: DEFAULT_BUSINESS_CONFIG
});
const score1 = calculateLeadScore(quote1, DEFAULT_BUSINESS_CONFIG, 220, '2026-09-18', ['addon_grand_arch', 'addon_ceiling_drape', 'addon_cold_sparks']);

// Seed Lead 2: High-Value Tech Gala (WhatsApp)
const quote2 = calculateEstimatedQuote({
  eventType: 'Luxury Gala',
  guestCount: 300,
  eventDate: '2026-10-05',
  venueType: 'Metropolitan Glass Pavilion',
  themeId: 'modern_minimalist_noir',
  selectedAddOns: ['addon_neon_sign', 'addon_photobooth', 'addon_champagne_wall'],
  config: DEFAULT_BUSINESS_CONFIG
});
const score2 = calculateLeadScore(quote2, DEFAULT_BUSINESS_CONFIG, 300, '2026-10-05', ['addon_neon_sign', 'addon_photobooth', 'addon_champagne_wall']);

// Seed Lead 3: Milestone 30th Birthday (Website Widget)
const quote3 = calculateEstimatedQuote({
  eventType: 'Birthday Celebration',
  guestCount: 65,
  eventDate: '2026-09-02',
  venueType: 'Rooftop Lounge 88',
  themeId: 'cyberpunk_celestial_neon',
  selectedAddOns: ['addon_neon_sign', 'addon_photobooth'],
  config: DEFAULT_BUSINESS_CONFIG
});
const score3 = calculateLeadScore(quote3, DEFAULT_BUSINESS_CONFIG, 65, '2026-09-02', ['addon_neon_sign', 'addon_photobooth']);

// Seed Lead 4: Enchanted Baby Shower (Instagram DM)
const quote4 = calculateEstimatedQuote({
  eventType: 'Baby Shower',
  guestCount: 45,
  eventDate: '2026-09-27',
  venueType: 'Private Residence Garden Estate',
  themeId: 'enchanted_secret_garden',
  selectedAddOns: ['addon_grand_arch'],
  config: DEFAULT_BUSINESS_CONFIG
});
const score4 = calculateLeadScore(quote4, DEFAULT_BUSINESS_CONFIG, 45, '2026-09-27', ['addon_grand_arch']);

// Seed Lead 5: Bohemian Vineyard Wedding (WhatsApp - Booked)
const quote5 = calculateEstimatedQuote({
  eventType: 'Wedding',
  guestCount: 150,
  eventDate: '2026-11-14',
  venueType: 'Sonoma Valley Estate',
  themeId: 'bohemian_chic_meadow',
  selectedAddOns: ['addon_grand_arch', 'addon_tablescape_deluxe'],
  config: DEFAULT_BUSINESS_CONFIG
});
const score5 = calculateLeadScore(quote5, DEFAULT_BUSINESS_CONFIG, 150, '2026-11-14', ['addon_grand_arch', 'addon_tablescape_deluxe']);

export const INITIAL_MOCK_LEADS: Lead[] = [
  {
    id: 'lead_001_vip_wedding',
    clientName: 'Sophia Montgomery & Arthur Sterling',
    clientHandle: '@sophiamontgomery',
    channel: 'instagram',
    contact: {
      phone: '+1 (415) 890-2194',
      email: 'sophia.montgomery@outlook.com',
      location: 'San Francisco, CA'
    },
    eventType: 'Wedding',
    eventDate: '2026-09-18',
    guestCount: 220,
    venueType: 'The St. Regis Grand Ballroom',
    themeId: 'luxury_royal_floral',
    themeName: 'Luxury Royal Floral',
    selectedAddOns: ['addon_grand_arch', 'addon_ceiling_drape', 'addon_cold_sparks'],
    budgetExpectation: 8000,
    calculatedQuote: quote1,
    stage: 'high_value_vip',
    scoreDetails: score1,
    isHighValueAlert: true,
    alertAcknowledged: false,
    internalNotes: 'VIP Couple! Bride wants dramatic fresh flower arch and ceiling starlight draping. Budget approved by wedding planner.',
    createdAt: '2026-08-14T18:30:00Z',
    lastActivityAt: '2026-08-15T02:15:00Z',
    assignedTo: 'Elena Vance (Lead Stylist)',
    tags: ['🔥 VIP $6k+', 'Fall Wedding', 'St. Regis', 'Hot Lead'],
    messages: [
      {
        id: 'm1',
        sender: 'client',
        content: 'Hi Aura! We are planning our autumn wedding at the St. Regis for ~220 guests and are in love with your royal floral installations.',
        timestamp: '18:30',
        channel: 'instagram'
      },
      {
        id: 'm2',
        sender: 'agent',
        content: 'Congratulations Sophia & Arthur! 🥂 The St. Regis is an extraordinary venue. For 220 guests, our Luxury Royal Floral design creates a breathtaking fairytale atmosphere with cascading white orchids and gold crystal candelabras. What date are you eyeing?',
        timestamp: '18:31',
        channel: 'instagram'
      },
      {
        id: 'm3',
        sender: 'client',
        content: 'September 18th! We also definitely want the 12ft Grand Arch, starlight ceiling drapes, and indoor cold sparks for our entrance.',
        timestamp: '18:32',
        channel: 'instagram'
      },
      {
        id: 'm4',
        sender: 'agent',
        content: 'Breathtaking choices! I have mapped out your bespoke design and calculated your instant multi-tier quotation right here:',
        timestamp: '18:33',
        channel: 'instagram',
        interactiveQuote: quote1
      }
    ]
  },
  {
    id: 'lead_002_tech_gala',
    clientName: 'AeroDynamics AI Annual Gala (Marcus Thorne)',
    clientHandle: '+1 (212) 555-0193',
    channel: 'whatsapp',
    contact: {
      phone: '+1 (212) 555-0193',
      email: 'm.thorne@aerodynamics.ai',
      location: 'New York, NY'
    },
    eventType: 'Luxury Gala',
    eventDate: '2026-10-05',
    guestCount: 300,
    venueType: 'Metropolitan Glass Pavilion',
    themeId: 'modern_minimalist_noir',
    themeName: 'Modern Luxe Noir & Chrome',
    selectedAddOns: ['addon_neon_sign', 'addon_photobooth', 'addon_champagne_wall'],
    budgetExpectation: 12000,
    calculatedQuote: quote2,
    stage: 'proposal_sent',
    scoreDetails: score2,
    isHighValueAlert: true,
    alertAcknowledged: true,
    internalNotes: 'Corporate annual celebration. Need invoice with PO number. Champagne wall + Glam photobooth approved.',
    createdAt: '2026-08-13T14:10:00Z',
    lastActivityAt: '2026-08-14T20:45:00Z',
    assignedTo: 'Elena Vance',
    tags: ['Corporate VIP', '300 Guests', 'Paid Fast'],
    messages: [
      {
        id: 'w1',
        sender: 'client',
        content: 'Hello, looking for a high-end corporate stylist for our annual AI awards gala in NYC. 300 VIP attendees.',
        timestamp: '14:10',
        channel: 'whatsapp'
      },
      {
        id: 'w2',
        sender: 'agent',
        content: 'Welcome Marcus! We specialize in cutting-edge gala productions. Our Modern Luxe Noir theme with black chrome, custom architectural florals, and ambient beam lighting will deliver a premier tech aesthetic.',
        timestamp: '14:11',
        channel: 'whatsapp'
      },
      {
        id: 'w3',
        sender: 'client',
        content: 'Sounds sleek. Event is October 5th. Let’s include custom LED neon branding, glam photo booth, and a 7-tier champagne wall.',
        timestamp: '14:13',
        channel: 'whatsapp'
      },
      {
        id: 'w4',
        sender: 'agent',
        content: 'Here is your official instant executive quote and line-item package breakdown:',
        timestamp: '14:14',
        channel: 'whatsapp',
        interactiveQuote: quote2
      }
    ]
  },
  {
    id: 'lead_003_celestial_birthday',
    clientName: 'Chloe Bennett',
    clientHandle: 'Website Chat Visitor #492',
    channel: 'website_widget',
    contact: {
      phone: '+1 (310) 774-8821',
      email: 'chloe.b@gmail.com',
      location: 'Los Angeles, CA'
    },
    eventType: 'Birthday Celebration',
    eventDate: '2026-09-02',
    guestCount: 65,
    venueType: 'Rooftop Lounge 88',
    themeId: 'cyberpunk_celestial_neon',
    themeName: 'Celestial Midnight & Neon Glow',
    selectedAddOns: ['addon_neon_sign', 'addon_photobooth'],
    budgetExpectation: 3500,
    calculatedQuote: quote3,
    stage: 'quote_sent',
    scoreDetails: score3,
    isHighValueAlert: false,
    alertAcknowledged: true,
    internalNotes: 'Client wants "Chloe is 30" custom neon sign and celestial starfield lighting on the rooftop.',
    createdAt: '2026-08-15T01:20:00Z',
    lastActivityAt: '2026-08-15T04:10:00Z',
    assignedTo: 'Aura Automated',
    tags: ['Rooftop 30th', 'Neon Theme', 'Ready for Quote'],
    messages: [
      {
        id: 'wb1',
        sender: 'client',
        content: 'Hi! Planning my 30th birthday on Sept 2nd on a rooftop for 65 friends. Love your neon and celestial setups.',
        timestamp: '01:20',
        channel: 'website_widget'
      },
      {
        id: 'wb2',
        sender: 'agent',
        content: 'Happy early 30th Chloe! 🎉 Celestial Midnight with custom neon and dynamic glow pods looks electrifying on rooftops against the night city skyline.',
        timestamp: '01:21',
        channel: 'website_widget'
      },
      {
        id: 'wb3',
        sender: 'agent',
        content: 'Here is your curated 30th birthday estimate:',
        timestamp: '01:22',
        channel: 'website_widget',
        interactiveQuote: quote3
      }
    ]
  },
  {
    id: 'lead_004_garden_baby_shower',
    clientName: 'Amara & Julian Hayes',
    clientHandle: '@amara_hayes',
    channel: 'instagram',
    contact: {
      phone: '+1 (512) 663-9012',
      email: 'amara.hayes@designstudio.co',
      location: 'Austin, TX'
    },
    eventType: 'Baby Shower',
    eventDate: '2026-09-27',
    guestCount: 45,
    venueType: 'Private Residence Garden Estate',
    themeId: 'enchanted_secret_garden',
    themeName: 'Enchanted Secret Garden',
    selectedAddOns: ['addon_grand_arch'],
    budgetExpectation: 2200,
    calculatedQuote: quote4,
    stage: 'qualifying',
    scoreDetails: score4,
    isHighValueAlert: false,
    alertAcknowledged: true,
    internalNotes: 'Enchanted whimsical theme. Checking if outdoor floral swing can be set up under their oak tree.',
    createdAt: '2026-08-14T21:40:00Z',
    lastActivityAt: '2026-08-15T00:30:00Z',
    assignedTo: 'Aura Automated',
    tags: ['Baby Shower', 'Garden Aesthetic'],
    messages: [
      {
        id: 'ig1',
        sender: 'client',
        content: 'Hi! Can you do an enchanted garden setup with hanging wisteria for a baby shower on Sept 27th?',
        timestamp: '21:40',
        channel: 'instagram'
      },
      {
        id: 'ig2',
        sender: 'agent',
        content: 'Hello Amara! Yes, our Enchanted Secret Garden installation with suspended botanical blooms and fairy lights is gorgeous for outdoor garden estates. About how many guests are you expecting?',
        timestamp: '21:42',
        channel: 'instagram'
      }
    ]
  },
  {
    id: 'lead_005_boho_vineyard_closed',
    clientName: 'Olivia & Liam Vance',
    clientHandle: '+1 (707) 349-8810',
    channel: 'whatsapp',
    contact: {
      phone: '+1 (707) 349-8810',
      email: 'olivia.vance@vancemedia.com',
      location: 'Sonoma, CA'
    },
    eventType: 'Wedding',
    eventDate: '2026-11-14',
    guestCount: 150,
    venueType: 'Sonoma Valley Estate',
    themeId: 'bohemian_chic_meadow',
    themeName: 'Bohemian Chic Meadow',
    selectedAddOns: ['addon_grand_arch', 'addon_tablescape_deluxe'],
    budgetExpectation: 6500,
    calculatedQuote: quote5,
    stage: 'booked_deposit',
    scoreDetails: score5,
    isHighValueAlert: true,
    alertAcknowledged: true,
    internalNotes: 'Deposit of $1,850 received via Stripe. Contract signed by Olivia. Site visit scheduled for September.',
    createdAt: '2026-08-10T11:00:00Z',
    lastActivityAt: '2026-08-14T16:00:00Z',
    assignedTo: 'Elena Vance',
    tags: ['Deposit Paid', 'Signed Contract', 'Vineyard Wedding'],
    messages: [
      {
        id: 'v1',
        sender: 'client',
        content: 'Deposit has been paid! Thank you Elena and Aura for the seamless quote process.',
        timestamp: '15:58',
        channel: 'whatsapp'
      },
      {
        id: 'v2',
        sender: 'agent',
        content: 'Deposit confirmed! 🎉 Your date is locked for November 14th. We are so excited to bring your Bohemian Chic vision to life in Sonoma!',
        timestamp: '16:00',
        channel: 'whatsapp'
      }
    ]
  }
];
