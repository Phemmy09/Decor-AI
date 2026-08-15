import { DecorTheme } from '../types';

export const DECOR_THEMES: DecorTheme[] = [
  {
    id: 'luxury_royal_floral',
    name: 'Luxury Royal Floral',
    tagline: 'Cascading fresh orchids, ivory hydrangeas, and 24K gold accents',
    description: 'Immersive opulent design featuring oversized fresh floral arches, gilded candelabras, crystal chandeliers, and velvet drapery.',
    multiplier: 1.45,
    palette: ['#D4AF37', '#FFFBF0', '#691B38', '#1F2937'],
    gradient: 'from-amber-700 via-amber-900 to-black',
    bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    badge: '👑 Most Popular Luxury',
    popularFor: ['Wedding', 'Luxury Gala', 'Anniversary'],
    includedFeatures: [
      'Grand 10ft Premium Floral Entrance Arch',
      'Cascading Italian Ruscus & English Roses',
      'Brushed Gold Geometric Centerpieces',
      'Ambient Warm Candlelight & Fairy Uplighting',
      'Custom Monogram Gold Mirror Welcome Sign'
    ]
  },
  {
    id: 'bohemian_chic_meadow',
    name: 'Bohemian Chic Meadow',
    tagline: 'Earthy pampas grass, warm terracotta, dried palms, and macramé romance',
    description: 'Free-spirited elegance with bespoke wooden arches, neutral textures, woven rattan lanterns, and organic floral installations.',
    multiplier: 1.15,
    palette: ['#C88A58', '#E6D7C3', '#8B5A2B', '#4A3B32'],
    gradient: 'from-orange-950 via-stone-900 to-black',
    bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    badge: '🌿 Trendy & Organic',
    popularFor: ['Wedding', 'Birthday Celebration', 'Baby Shower', 'Engagement Party'],
    includedFeatures: [
      'Triangular Cedar Arch with Fluffy Pampas',
      'Terracotta & Sunset Orange Silk Accents',
      'Rattan Floor Lanterns with LED Pillar Candles',
      'Textured Linen Table Runners with Ceramic Vases',
      'Bespoke Wooden Calligraphy Signage'
    ]
  },
  {
    id: 'modern_minimalist_noir',
    name: 'Modern Luxe Noir & Chrome',
    tagline: 'Architectural florals, smoked glass, black marble, and sleek neon',
    description: 'Ultra-contemporary aesthetic with sculptural floral arrangements, minimalist metallic structures, and moody ambient illumination.',
    multiplier: 1.25,
    palette: ['#111827', '#E5E7EB', '#9CA3AF', '#F59E0B'],
    gradient: 'from-slate-900 via-zinc-900 to-black',
    bgImage: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
    badge: '✨ Ultra Modern',
    popularFor: ['Corporate Event', 'Luxury Gala', 'Birthday Celebration'],
    includedFeatures: [
      'Matte Black Structural Backdrop with Floating Neon',
      'Monochromatic White Calla Lilies & Anthuriums',
      'Smoked Glass Cylinder Vases with Pinspot Lighting',
      'Gunmetal Charger Plates & Satin Napkins',
      'Custom Backlit Acrylic Seating Chart'
    ]
  },
  {
    id: 'enchanted_secret_garden',
    name: 'Enchanted Secret Garden',
    tagline: 'Lush greenery canopy, hanging wisteria, fairy tunnels, and mossy accents',
    description: 'A fairy-tale wonderland with suspended botanical installations, twinkling starry ceiling drapes, and organic garden blooms.',
    multiplier: 1.35,
    palette: ['#064E3B', '#10B981', '#FDE68A', '#374151'],
    gradient: 'from-emerald-950 via-teal-950 to-black',
    bgImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    badge: '🧚 Fantasy & Whimsical',
    popularFor: ['Wedding', 'Birthday Celebration', 'Baby Shower'],
    includedFeatures: [
      'Overhead Hanging Wisteria & Fairy Light Tunnel',
      'Live Fern & Moss Table Centerpieces',
      'Rustic Wooden Table Displays with Bell Jars',
      'Glow-in-the-Dark Crystal Foliage Elements',
      'Floral Swing Photo-Op Backdrop'
    ]
  },
  {
    id: 'cyberpunk_celestial_neon',
    name: 'Celestial Midnight & Neon Glow',
    tagline: 'Deep navy velvet, fiber optic starlight, futuristic neon arches, and laser prisms',
    description: 'Dramatic high-energy setup designed for modern milestone celebrations and tech gala events with custom color-shifting lighting.',
    multiplier: 1.30,
    palette: ['#1E1B4B', '#4338CA', '#06B6D4', '#EC4899'],
    gradient: 'from-indigo-950 via-purple-950 to-black',
    bgImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    badge: '⚡ High Energy & Futuristic',
    popularFor: ['Birthday Celebration', 'Corporate Event'],
    includedFeatures: [
      'Color-Shifting Multi-Ring LED Infinity Arch',
      'Fiber Optic Ceiling Starfield Effect',
      'Custom 3D Neon Event Logo / Hashtag Sign',
      'Holographic Centerpieces with Dynamic Glow Pods',
      'Mirror Finish Dance Floor Draping'
    ]
  },
  {
    id: 'classic_timeless_elegance',
    name: 'Classic White & Gold Elegance',
    tagline: 'Timeless white roses, candlelight glow, satin draping, and crystal glassware',
    description: 'The perennial favorite for high-society weddings and anniversaries that never goes out of style.',
    multiplier: 1.20,
    palette: ['#FFFFFF', '#D4AF37', '#94A3B8', '#1E293B'],
    gradient: 'from-amber-950 via-slate-900 to-black',
    bgImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
    badge: '🕊️ Timeless Romance',
    popularFor: ['Wedding', 'Anniversary', 'Engagement Party'],
    includedFeatures: [
      'Full White Rose & Hydrangea Stage Backdrop',
      'Tall Crystal Candelabras on Every Table',
      'Floor-to-Ceiling White Chiffon Draping',
      'Gold Beaded Glass Charger Plates',
      'Illuminated Aisle Runner with Floral Borders'
    ]
  }
];
