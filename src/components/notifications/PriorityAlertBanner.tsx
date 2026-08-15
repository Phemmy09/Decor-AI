import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { formatCurrency } from '../../utils/pricingEngine';
import { Flame, Crown, X, ArrowRight, Phone, MessageSquare } from 'lucide-react';

interface PriorityAlertBannerProps {
  onOpenDetails: (lead: any) => void;
}

export const PriorityAlertBanner: React.FC<PriorityAlertBannerProps> = ({ onOpenDetails }) => {
  const { unacknowledgedVipLeads, acknowledgeVipAlert, dismissAllVipAlerts, businessConfig } = useLeads();

  if (unacknowledgedVipLeads.length === 0) return null;

  const topLead = unacknowledgedVipLeads[0];
  const sym = businessConfig.currencySymbol;
  const quoteVal = topLead.calculatedQuote?.totalEstimatedValue || topLead.budgetExpectation || 0;

  return (
    <div className="relative z-40 mb-4 rounded-2xl bg-gradient-to-r from-amber-600/30 via-gold-600/20 to-amber-950/40 border border-amber-500/50 p-4 shadow-gold-glow backdrop-blur-xl animate-in slide-in-from-top duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 text-left w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                🔥 Priority High-Value Lead Alert
              </span>
              {unacknowledgedVipLeads.length > 1 && (
                <span className="text-[10px] text-slate-300 font-bold bg-obsidian-850 px-2 py-0.5 rounded-full">
                  +{unacknowledgedVipLeads.length - 1} more VIPs
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white font-serif mt-0.5">
              {topLead.clientName} is ready to close for {topLead.eventType} on {topLead.eventDate} ({formatCurrency(quoteVal, sym)})
            </h4>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              onOpenDetails(topLead);
              acknowledgeVipAlert(topLead.id);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-obsidian-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-gold-sm transition-all hover:scale-105"
          >
            <span>Review & Close VIP Deal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => acknowledgeVipAlert(topLead.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-850/80 transition-colors"
            title="Acknowledge Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
