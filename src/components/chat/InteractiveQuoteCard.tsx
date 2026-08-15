import React, { useState } from 'react';
import { CalculatedQuote } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { formatCurrency } from '../../utils/pricingEngine';
import { Check, Sparkles, Crown, ShieldCheck, ChevronRight, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractiveQuoteCardProps {
  quote: CalculatedQuote;
  onBookTier?: (tierId: 'silver' | 'gold' | 'platinum') => void;
  onOpenProposal?: () => void;
  readonly?: boolean;
}

export const InteractiveQuoteCard: React.FC<InteractiveQuoteCardProps> = ({
  quote,
  onBookTier,
  onOpenProposal,
  readonly = false,
}) => {
  const { businessConfig, updateLeadStage, activeLead, leads } = useLeads();
  const [selectedTier, setSelectedTier] = useState<'silver' | 'gold' | 'platinum'>(quote.selectedTier || 'gold');
  const [booked, setBooked] = useState(false);

  const activeTierObj = quote.tiers[selectedTier];
  const sym = businessConfig.currencySymbol;

  const handleBook = () => {
    setBooked(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FFFBF0', '#10B981']
    });

    if (onBookTier) {
      onBookTier(selectedTier);
    } else if (activeLead) {
      updateLeadStage(activeLead.id, 'proposal_sent');
    }
  };

  return (
    <div className="w-full max-w-lg my-3 rounded-2xl overflow-hidden border border-gold-500/40 bg-gradient-to-b from-obsidian-850 via-obsidian-900 to-obsidian-950 shadow-2xl transition-all duration-300">
      {/* Top Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-obsidian-800 via-obsidian-750 to-obsidian-800 border-b border-gold-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gold-400">Instant Tailored Quote</div>
            <h4 className="text-sm font-bold text-white font-serif">{quote.eventType} • {quote.themeName}</h4>
          </div>
        </div>
        {quote.isHighValue && (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
            <Crown className="w-3 h-3 text-gold-400" /> VIP Scale
          </span>
        )}
      </div>

      {/* Quick Specs summary */}
      <div className="grid grid-cols-3 gap-2 px-5 py-2.5 bg-obsidian-900/60 border-b border-slate-800/80 text-[11px]">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Guest Scale</span>
          <span className="font-semibold text-slate-200">{quote.guestCount} Guests</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Target Date</span>
          <span className="font-semibold text-slate-200 truncate block">{quote.eventDate}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Venue</span>
          <span className="font-semibold text-slate-200 truncate block">{quote.venueType || 'Ballroom'}</span>
        </div>
      </div>

      {/* Tier Selector Buttons */}
      <div className="p-4">
        <div className="text-xs font-medium text-slate-300 mb-2">Select Design Tier:</div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(['silver', 'gold', 'platinum'] as const).map((tierKey) => {
            const tier = quote.tiers[tierKey];
            const isSelected = selectedTier === tierKey;
            return (
              <button
                key={tierKey}
                type="button"
                onClick={() => setSelectedTier(tierKey)}
                className={`px-2.5 py-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-gold-500 bg-gold-500/15 shadow-gold-sm text-white'
                    : 'border-slate-800 bg-obsidian-800/60 text-slate-400 hover:border-slate-700 hover:bg-obsidian-800'
                }`}
              >
                {tierKey === 'gold' && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 text-[9px] font-bold rounded bg-gold-500 text-obsidian-950 uppercase tracking-tighter">
                    Popular
                  </span>
                )}
                <div className="text-[11px] font-semibold truncate capitalize">{tierKey}</div>
                <div className={`text-sm font-bold mt-1 ${isSelected ? 'text-gold-300' : 'text-slate-200'}`}>
                  {formatCurrency(tier.totalPrice, sym)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Detail Box */}
        <div className="rounded-xl p-3.5 bg-obsidian-800/80 border border-slate-800 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-bold text-white">{activeTierObj.name}</span>
              <p className="text-xs text-slate-400">{activeTierObj.tagline}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-gold-400 font-serif">
                {formatCurrency(activeTierObj.totalPrice, sym)}
              </div>
              <div className="text-[10px] text-slate-400">
                Deposit: <span className="text-slate-300 font-semibold">{formatCurrency(activeTierObj.depositRequired, sym)}</span> (35%)
              </div>
            </div>
          </div>

          {/* Included Features List */}
          <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Package Inclusions:
            </span>
            {activeTierObj.features.map((feat, idx) => (
              <div key={idx} className="flex items-start text-xs text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mr-1.5 mt-0.5" />
                <span className="leading-tight">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {!readonly && (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleBook}
              disabled={booked}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                booked
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-obsidian-950 shadow-gold-sm'
              }`}
            >
              {booked ? (
                <>
                  <ShieldCheck className="w-4 h-4" /> Package Reserved & Logged in CRM!
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4" /> Reserve {activeTierObj.name.split(' ')[0]} Package
                </>
              )}
            </button>

            {onOpenProposal && (
              <button
                type="button"
                onClick={onOpenProposal}
                className="py-2.5 px-3 rounded-xl text-xs font-medium border border-slate-700 bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1"
                title="View Full Itemized Proposal & Printable Quote"
              >
                <FileText className="w-3.5 h-3.5 text-gold-400" />
                <span>Proposal</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
