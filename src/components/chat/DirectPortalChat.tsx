import React, { useState } from 'react';
import { EventType } from '../../types';
import { DECOR_THEMES } from '../../data/decorThemes';
import { DECOR_ADD_ONS } from '../../data/addOns';
import { useLeads } from '../../context/LeadContext';
import { calculateEstimatedQuote, formatCurrency } from '../../utils/pricingEngine';
import { InteractiveQuoteCard } from './InteractiveQuoteCard';
import { Sparkles, Calendar, Users, MapPin, Check, Plus, ArrowRight, RefreshCw } from 'lucide-react';

export const DirectPortalChat: React.FC = () => {
  const { businessConfig, addNewLeadFromIntake, setActiveProposalQuote } = useLeads();
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [guestCount, setGuestCount] = useState<number>(150);
  const [eventDate, setEventDate] = useState<string>('2026-10-24');
  const [venueType, setVenueType] = useState<string>('Grand Ballroom / Luxury Estate');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('luxury_royal_floral');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(['addon_grand_arch', 'addon_ceiling_drape']);
  const [clientName, setClientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [generatedQuote, setGeneratedQuote] = useState<any>(null);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleGenerateQuote = () => {
    const quote = calculateEstimatedQuote({
      eventType,
      guestCount,
      eventDate,
      venueType,
      themeId: selectedThemeId,
      selectedAddOns,
      config: businessConfig,
    });

    setGeneratedQuote(quote);

    // Auto-log to CRM pipeline
    addNewLeadFromIntake({
      clientName: clientName || 'Concierge Portal Client',
      channel: 'direct_portal',
      contact: {
        phone: phone || '+1 (555) 349-1029',
        email: email || 'prospect@luxuryevents.com',
        location: venueType,
      },
      eventType,
      eventDate,
      guestCount,
      venueType,
      themeId: selectedThemeId,
      themeName: quote.themeName,
      selectedAddOns,
      budgetExpectation: quote.totalEstimatedValue,
    }, quote);
  };

  return (
    <div className="max-w-4xl mx-auto rounded-2xl glass-panel p-6 border border-gold-500/20 shadow-2xl">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> 24/7 AI Luxury Event Estimator
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">Design Your Bespoke Spatial Atmosphere</h2>
        <p className="text-xs text-slate-400 mt-1">Select your event specs to generate instant itemized 3-tier proposals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Form Controls */}
        <div className="space-y-4">
          {/* Event Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Wedding', 'Luxury Gala', 'Birthday Celebration', 'Corporate Event'] as EventType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventType(type)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                    eventType === type
                      ? 'border-gold-500 bg-gold-500/15 text-gold-200'
                      : 'border-slate-800 bg-obsidian-850 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Guests */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gold-400" /> Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-obsidian-850 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-gold-400" /> Guest Count: <span className="text-gold-400 font-bold">{guestCount}</span>
              </label>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full accent-gold-500 mt-2"
              />
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Decoration Style & Moodboard</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {DECOR_THEMES.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-gold-500 bg-gold-500/10 shadow-gold-sm'
                        : 'border-slate-800/80 bg-obsidian-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                        <img src={theme.bgImage} alt={theme.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{theme.name}</h4>
                        <span className="text-[10px] text-slate-400 truncate block max-w-[200px]">{theme.tagline}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-gold-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Add-on Visual Upgrades</label>
            <div className="grid grid-cols-2 gap-1.5">
              {DECOR_ADD_ONS.slice(0, 6).map((addon) => {
                const isChecked = selectedAddOns.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddOn(addon.id)}
                    className={`p-2 rounded-lg border text-left text-[11px] transition-all flex items-center justify-between ${
                      isChecked
                        ? 'border-gold-500/60 bg-gold-500/15 text-gold-200'
                        : 'border-slate-800 bg-obsidian-850 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate pr-1">{addon.name.split('(')[0]}</span>
                    <span className="font-semibold text-gold-400">+{formatCurrency(addon.price, businessConfig.currencySymbol)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Details (Optional) */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              placeholder="Your Name (e.g. Rachel & Alex)"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-obsidian-850 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
            <input
              type="text"
              placeholder="Phone / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-obsidian-850 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateQuote}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4" /> Calculate Instant Quote & Sync to CRM
          </button>
        </div>

        {/* Right Column: Instant Live Preview */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-obsidian-900/60 border border-slate-800/80">
          {generatedQuote ? (
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">Live Quotation Result</span>
                <button
                  onClick={handleGenerateQuote}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Recalculate
                </button>
              </div>
              <InteractiveQuoteCard
                quote={generatedQuote}
                onOpenProposal={() => {
                  const lead = addNewLeadFromIntake({ clientName: clientName || 'Direct Portal Client' }, generatedQuote);
                  setActiveProposalQuote({ lead, quote: generatedQuote });
                }}
              />
            </div>
          ) : (
            <div className="text-center p-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white font-serif">Awaiting Event Parameters</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Customize your guest count and decor options on the left, then click calculate to generate real-time 3-tier proposals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
