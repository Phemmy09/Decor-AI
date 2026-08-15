import React from 'react';
import { Lead, MessagingChannel } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { formatCurrency } from '../../utils/pricingEngine';
import { DECOR_THEMES } from '../../data/decorThemes';
import { 
  Calendar, 
  Users, 
  Crown, 
  Flame, 
  MessageSquare, 
  Globe, 
  Sparkles, 
  ArrowRight,
  MoreVertical,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { InstagramIcon } from '../common/Icons';

interface LeadCardProps {
  lead: Lead;
  onOpenDetails: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onOpenDetails }) => {
  const { businessConfig, updateLeadStage } = useLeads();
  const theme = DECOR_THEMES.find(t => t.id === lead.themeId);
  const sym = businessConfig.currencySymbol;
  const quoteValue = lead.calculatedQuote ? lead.calculatedQuote.totalEstimatedValue : (lead.budgetExpectation || 0);

  const getChannelIcon = (ch: MessagingChannel) => {
    switch (ch) {
      case 'whatsapp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case 'instagram':
        return <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />;
      case 'website_widget':
        return <Globe className="w-3.5 h-3.5 text-gold-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const isVip = lead.isHighValueAlert || lead.stage === 'high_value_vip' || quoteValue >= businessConfig.highValueThreshold;

  return (
    <div
      onClick={() => onOpenDetails(lead)}
      className={`group relative rounded-xl p-4 cursor-pointer transition-all duration-200 border ${
        isVip
          ? 'bg-gradient-to-br from-obsidian-850 via-obsidian-900 to-obsidian-850 border-amber-500/50 hover:border-gold-400 hover:shadow-gold-sm'
          : 'bg-obsidian-850/90 border-slate-800 hover:border-slate-700 hover:bg-obsidian-800'
      }`}
    >
      {/* Top badges & Channel */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-1.5">
          <span className="p-1 rounded-md bg-obsidian-800 border border-slate-700/80" title={lead.channel}>
            {getChannelIcon(lead.channel)}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {lead.eventType}
          </span>
        </div>

        {isVip && (
          <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" /> VIP
          </span>
        )}
      </div>

      {/* Client Name & Handle */}
      <h4 className="text-sm font-bold text-white group-hover:text-gold-300 transition-colors font-serif truncate">
        {lead.clientName}
      </h4>
      <p className="text-[11px] text-slate-400 truncate mb-3">
        {lead.clientHandle || lead.contact.email}
      </p>

      {/* Theme Swatch & Pill */}
      <div className="flex items-center space-x-2 mb-3 px-2 py-1.5 rounded-lg bg-obsidian-950/60 border border-slate-800/80">
        {theme && (
          <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-gold-500/40">
            <img src={theme.bgImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <span className="text-xs font-medium text-slate-300 truncate">
          {lead.themeName || 'Luxury Theme'}
        </span>
      </div>

      {/* Date & Guests metadata */}
      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-3">
        <div className="flex items-center gap-1.5 truncate">
          <Calendar className="w-3 h-3 text-gold-400 shrink-0" />
          <span className="truncate">{lead.eventDate}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Users className="w-3 h-3 text-gold-400 shrink-0" />
          <span>{lead.guestCount} Guests</span>
        </div>
      </div>

      {/* Footer Price & Next Stage Trigger */}
      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase block leading-none">Est. Quote</span>
          <span className="text-sm font-extrabold text-gold-400 font-serif">
            {formatCurrency(quoteValue, sym)}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
            Score: {lead.scoreDetails?.totalScore || 75}
          </span>
        </div>
      </div>
    </div>
  );
};
