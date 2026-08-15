import React, { useState } from 'react';
import { Lead, PipelineStage } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { DECOR_THEMES } from '../../data/decorThemes';
import { DECOR_ADD_ONS } from '../../data/addOns';
import { formatCurrency } from '../../utils/pricingEngine';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Globe, 
  Flame, 
  FileText, 
  Send, 
  CheckCircle2, 
  Crown, 
  Layers, 
  Clock, 
  Edit3, 
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { InstagramIcon } from '../common/Icons';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onOpenProposal: (lead: Lead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onOpenProposal,
}) => {
  const { businessConfig, updateLeadStage, updateLead, deleteLead } = useLeads();
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'quote' | 'notes'>('overview');
  const [internalNotes, setInternalNotes] = useState(lead?.internalNotes || '');
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!lead) return null;

  const theme = DECOR_THEMES.find(t => t.id === lead.themeId);
  const quote = lead.calculatedQuote;
  const sym = businessConfig.currencySymbol;
  const quoteTotal = quote ? quote.totalEstimatedValue : (lead.budgetExpectation || 0);

  const stages: { id: PipelineStage; label: string }[] = [
    { id: 'new_inquiry', label: 'New Inquiry' },
    { id: 'qualifying', label: 'Qualifying' },
    { id: 'quote_sent', label: 'Quote Sent' },
    { id: 'high_value_vip', label: '🔥 High-Value VIP' },
    { id: 'proposal_sent', label: 'Proposal Sent' },
    { id: 'booked_deposit', label: 'Booked & Paid' },
  ];

  const handleSaveNotes = () => {
    updateLead({
      ...lead,
      internalNotes,
      lastActivityAt: new Date().toISOString()
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleQuickWhatsApp = () => {
    const cleanPhone = lead.contact.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${lead.clientName}! This is ${businessConfig.ownerName} from ${businessConfig.companyName}. I saw your inquiry for your ${lead.eventType} on ${lead.eventDate}. I loved your ${lead.themeName} vision and would love to lock in your date!`
    );
    window.open(`https://wa.me/${cleanPhone || '15558943200'}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-2xl border border-gold-500/30 flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border-b border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-serif">{lead.clientName}</h3>
                {lead.isHighValueAlert && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> High-Value VIP
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {lead.eventType} • {lead.guestCount} Guests • Channel: <span className="capitalize text-slate-300">{lead.channel.replace('_', ' ')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenProposal(lead)}
              className="px-3 py-1.5 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/50 text-gold-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-gold-sm"
            >
              <FileText className="w-3.5 h-3.5" /> Proposal / Invoice
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Progression Selector Bar */}
        <div className="px-6 py-2.5 bg-obsidian-900/90 border-b border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Pipeline Stage:
          </span>
          <div className="flex items-center space-x-1.5">
            {stages.map((st) => {
              const isCurrent = lead.stage === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => updateLeadStage(lead.id, st.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-gold-500 text-obsidian-950 shadow-gold-sm'
                      : 'bg-obsidian-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-obsidian-900/60">
          {[
            { id: 'overview', label: 'Event Overview & Moodboard' },
            { id: 'transcript', label: `Chat Transcript (${lead.messages.length})` },
            { id: 'quote', label: 'Pricing & Itemized Breakdown' },
            { id: 'notes', label: 'Internal Notes & CRM' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-gold-500 text-gold-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-obsidian-850 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">Estimated Value</span>
                  <div className="text-xl font-bold text-gold-400 font-serif">
                    {formatCurrency(quoteTotal, sym)}
                  </div>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Crown className="w-3 h-3" /> Lead Score: {lead.scoreDetails?.totalScore || 80}/100
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-obsidian-850 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">Target Date & Venue</span>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" /> {lead.eventDate}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {lead.venueType || 'Ballroom / Event Space'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-obsidian-850 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">Client Contact</span>
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-gold-400" /> {lead.contact.phone}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                    <Mail className="w-3 h-3 text-slate-500 shrink-0" /> {lead.contact.email}
                  </div>
                </div>
              </div>

              {/* Theme Moodboard Box */}
              {theme && (
                <div className="rounded-2xl overflow-hidden border border-gold-500/30 bg-obsidian-850">
                  <div className="relative h-40 overflow-hidden">
                    <img src={theme.bgImage} alt={theme.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-gold-500 text-obsidian-950 uppercase tracking-wider">
                        {theme.badge}
                      </span>
                      <h3 className="text-lg font-bold text-white font-serif mt-1">{theme.name}</h3>
                      <p className="text-xs text-slate-300">{theme.tagline}</p>
                    </div>
                  </div>

                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
                        Included Spatial Deliverables:
                      </h4>
                      <ul className="space-y-1.5">
                        {theme.includedFeatures.map((feat, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">
                        Selected Add-On Elements:
                      </h4>
                      <div className="space-y-1.5">
                        {lead.selectedAddOns.map((addonId) => {
                          const item = DECOR_ADD_ONS.find(a => a.id === addonId);
                          return (
                            <div key={addonId} className="p-2 rounded-lg bg-obsidian-900 border border-slate-800 flex items-center justify-between text-xs">
                              <span className="text-slate-200">{item ? item.name : addonId}</span>
                              <span className="font-semibold text-gold-400">
                                +{formatCurrency(item ? item.price : 0, sym)}
                              </span>
                            </div>
                          );
                        })}
                        {lead.selectedAddOns.length === 0 && (
                          <span className="text-xs text-slate-500">No add-ons requested</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Close Action Center */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-obsidian-850 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-gold-400" /> 1-Click Priority Close Actions
                  </h4>
                  <p className="text-[11px] text-slate-400">Instantly reach out to lock in the client date and collect deposit.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleQuickWhatsApp}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Prospect
                  </button>
                  <a
                    href={`tel:${lead.contact.phone}`}
                    className="px-3 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-gold-400" /> Direct Call
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 mb-2">
                Automated 24/7 Chat History ({lead.messages.length} messages)
              </div>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-slate-800 space-y-3 max-h-[400px] overflow-y-auto">
                {lead.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'agent' ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                        m.sender === 'agent'
                          ? 'bg-obsidian-800 text-slate-200 border border-slate-700/80 rounded-tl-none'
                          : 'bg-gold-500 text-obsidian-950 font-medium rounded-tr-none'
                      }`}
                    >
                      <div className="whitespace-pre-line">{m.content}</div>
                      <span className="block text-[9px] mt-1 opacity-70 text-right">{m.timestamp}</span>
                    </div>
                  </div>
                ))}
                {lead.messages.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6">No transcript recorded for this lead yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: QUOTE BREAKDOWN */}
          {activeTab === 'quote' && quote && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {(['silver', 'gold', 'platinum'] as const).map((tKey) => {
                  const t = quote.tiers[tKey];
                  return (
                    <div
                      key={tKey}
                      className={`p-4 rounded-xl border ${
                        tKey === 'gold'
                          ? 'border-gold-500 bg-gold-500/10 shadow-gold-sm'
                          : 'border-slate-800 bg-obsidian-850'
                      }`}
                    >
                      <div className="text-xs font-bold uppercase text-slate-300">{t.name}</div>
                      <div className="text-lg font-black text-gold-400 font-serif mt-1">
                        {formatCurrency(t.totalPrice, sym)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Deposit: {formatCurrency(t.depositRequired, sym)}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span>Base Production:</span>
                          <span className="text-slate-200 font-semibold">{formatCurrency(t.breakdown.baseSetup, sym)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Guest Floral Scale:</span>
                          <span className="text-slate-200 font-semibold">{formatCurrency(t.breakdown.guestCost, sym)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Theme Crafting:</span>
                          <span className="text-slate-200 font-semibold">{formatCurrency(t.breakdown.themeCost, sym)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Selected Add-ons:</span>
                          <span className="text-slate-200 font-semibold">{formatCurrency(t.breakdown.addOnsCost, sym)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-obsidian-850 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Need to adjust or apply custom pricing?</h4>
                  <p className="text-[11px] text-slate-400">You can generate an official digital contract and proposal with customized terms.</p>
                </div>
                <button
                  onClick={() => onOpenProposal(lead)}
                  className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs shadow-gold-sm"
                >
                  Generate Official Proposal
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: INTERNAL NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Internal Lead Notes & Event Requirements
                </label>
                <textarea
                  rows={6}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record specific floral requests, venue load-in restrictions, wedding planner contacts, discount approvals..."
                  className="w-full bg-obsidian-900 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-gold-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Notes
                </button>
                {isSaved && <span className="text-xs text-emerald-400 font-medium">Saved to CRM!</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
