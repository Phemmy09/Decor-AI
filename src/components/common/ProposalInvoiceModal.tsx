import React, { useEffect } from 'react';
import { Lead, CalculatedQuote } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { formatCurrency } from '../../utils/pricingEngine';
import { DECOR_THEMES } from '../../data/decorThemes';
import { DECOR_ADD_ONS } from '../../data/addOns';
import { Printer, X, Download, ShieldCheck, Sparkles, Check } from 'lucide-react';

interface ProposalInvoiceModalProps {
  data: { lead: Lead; quote?: CalculatedQuote } | null;
  onClose: () => void;
}

export const ProposalInvoiceModal: React.FC<ProposalInvoiceModalProps> = ({ data, onClose }) => {
  const { businessConfig } = useLeads();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!data) return null;

  const { lead } = data;
  const quote = data.quote || lead.calculatedQuote;
  const sym = businessConfig.currencySymbol;
  const theme = DECOR_THEMES.find(t => t.id === lead.themeId);

  const selectedTier = quote?.tiers[quote.selectedTier || 'gold'] || {
    name: 'Gold Signature Luxury',
    totalPrice: lead.budgetExpectation || 4500,
    depositRequired: Math.round((lead.budgetExpectation || 4500) * 0.35),
    breakdown: {
      baseSetup: 1800,
      guestCost: lead.guestCount * 12,
      themeCost: 450,
      addOnsCost: 800,
      seasonDiscountOrFee: 0,
    },
    features: [
      'Full 10ft Themed Statement Archway / Backdrop',
      'Elevated Fresh Floral & Candle Tablescaping',
      'Intelligent Color-Tuned Mood Lighting',
      'Welcome Mirror Calligraphy Sign'
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#FAF8F5] text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-amber-900/20 font-sans print-card"
      >
        {/* Top Control Bar (Sticky, hidden during print) */}
        <div className="no-print sticky top-0 z-20 px-6 py-3.5 bg-obsidian-900 text-white flex items-center justify-between border-b border-slate-800 shadow-md">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Official Event Decor Proposal & Quotation</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Proposal Document Body */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-amber-900/20 pb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                {businessConfig.companyName}
              </h1>
              <p className="text-xs text-amber-800 font-serif italic mt-0.5">Bespoke Spatial Artistry & Event Styling</p>
              <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                <p>{businessConfig.ownerName} • Lead Creative Director</p>
                <p>{businessConfig.email} • {businessConfig.phone}</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-300">
                Official Proposal
              </span>
              <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                <p>Proposal Ref: <strong className="text-slate-800">#{lead.id.substring(0, 10).toUpperCase()}</strong></p>
                <p>Date Generated: {new Date().toLocaleDateString()}</p>
                <p>Valid Through: 14 Days from Issue</p>
              </div>
            </div>
          </div>

          {/* Client & Event Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-amber-50/60 p-4 rounded-xl border border-amber-200/60 text-xs">
            <div>
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">Prepared For</span>
              <h3 className="text-sm font-bold text-slate-900">{lead.clientName}</h3>
              <p className="text-slate-600">{lead.contact.phone}</p>
              <p className="text-slate-600">{lead.contact.email}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">Event Specifications</span>
              <p className="font-semibold text-slate-800">{lead.eventType} • {lead.guestCount} Guests</p>
              <p className="text-slate-600">Event Date: <span className="font-medium text-slate-900">{lead.eventDate}</span></p>
              <p className="text-slate-600">Venue: {lead.venueType || 'Ballroom / Private Estate'}</p>
            </div>
          </div>

          {/* Selected Theme Concept */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Aesthetic Concept & Deliverables
            </h3>
            <div className="p-4 rounded-xl bg-white border border-amber-900/15 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif">{lead.themeName}</h4>
                  <p className="text-xs text-slate-600">{theme?.tagline}</p>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {selectedTier.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                {selectedTier.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mr-1.5 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Itemized Financial Breakdown Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Itemized Quotation & Investment
            </h3>
            <table className="w-full text-left text-xs border border-amber-900/15 rounded-xl overflow-hidden bg-white">
              <thead className="bg-amber-100/70 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Item & Description</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-2.5 px-4">
                    <span className="font-semibold">Base Production & Structural Setup</span>
                    <p className="text-[11px] text-slate-500">Includes styling director, crew load-in, hardware rigs, and teardown.</p>
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold">
                    {formatCurrency(selectedTier.breakdown.baseSetup, sym)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">
                    <span className="font-semibold">Guest Tablescaping & Floral Scaling</span>
                    <p className="text-[11px] text-slate-500">Curated centerpieces and accents calculated for {lead.guestCount} guests.</p>
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold">
                    {formatCurrency(selectedTier.breakdown.guestCost, sym)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">
                    <span className="font-semibold">Theme Customization & Architectural Artistry</span>
                    <p className="text-[11px] text-slate-500">Custom color-matched florals, drapery fabrics, and entrance signage.</p>
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold">
                    {formatCurrency(selectedTier.breakdown.themeCost, sym)}
                  </td>
                </tr>
                {lead.selectedAddOns.map((addonId) => {
                  const item = DECOR_ADD_ONS.find(a => a.id === addonId);
                  return (
                    <tr key={addonId}>
                      <td className="py-2.5 px-4">
                        <span className="font-semibold">Add-On: {item ? item.name : addonId}</span>
                        <p className="text-[11px] text-slate-500">{item?.description}</p>
                      </td>
                      <td className="py-2.5 px-4 text-right font-semibold">
                        {formatCurrency(item ? item.price : 0, sym)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-amber-50/80 border-t border-amber-200 text-slate-900 font-bold">
                <tr>
                  <td className="py-3 px-4 text-sm font-serif">Total Estimated Package Investment</td>
                  <td className="py-3 px-4 text-right text-base text-amber-900 font-serif">
                    {formatCurrency(selectedTier.totalPrice, sym)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-xs font-normal text-slate-600">
                    Required Retainer Deposit to Lock Calendar (35%)
                  </td>
                  <td className="py-2 px-4 text-right text-xs font-bold text-emerald-700">
                    {formatCurrency(selectedTier.depositRequired, sym)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment & Terms Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-slate-600 pt-4 border-t border-amber-900/15">
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Reservation Policy:</h4>
              <p>Dates are held on a first-deposit basis. A 35% non-refundable retainer reserves your event team and locks wholesale flower sourcing.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Final Balance & Changes:</h4>
              <p>Final guest counts and balance payment are due 14 days prior to event installation.</p>
            </div>
          </div>

          {/* Signature Block */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-amber-900/20">
            <div>
              <div className="h-10 border-b border-slate-400"></div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-1">Client Signature & Date</span>
            </div>
            <div>
              <div className="h-10 border-b border-slate-400 flex items-end">
                <span className="font-serif italic text-amber-900 text-sm font-bold">{businessConfig.ownerName}</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-1">
                {businessConfig.companyName} Director
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
