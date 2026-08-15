import React, { useState } from 'react';
import { Lead, PipelineStage, MessagingChannel } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { formatCurrency } from '../../utils/pricingEngine';
import { 
  Search, 
  Download, 
  Flame, 
  ExternalLink, 
  Trash2, 
  MessageSquare, 
  Globe, 
  Sparkles,
  Calendar,
  Users
} from 'lucide-react';
import { InstagramIcon } from '../common/Icons';

interface PipelineTableViewProps {
  onOpenDetails: (lead: Lead) => void;
}

export const PipelineTableView: React.FC<PipelineTableViewProps> = ({ onOpenDetails }) => {
  const { leads, businessConfig, updateLeadStage, deleteLead } = useLeads();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');

  const sym = businessConfig.currencySymbol;

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.clientName.toLowerCase().includes(search.toLowerCase()) ||
      l.eventType.toLowerCase().includes(search.toLowerCase()) ||
      l.themeName.toLowerCase().includes(search.toLowerCase()) ||
      l.contact.email.toLowerCase().includes(search.toLowerCase());

    const matchesStage = stageFilter === 'all' || l.stage === stageFilter;
    const matchesChannel = channelFilter === 'all' || l.channel === channelFilter;

    return matchesSearch && matchesStage && matchesChannel;
  });

  const exportCSV = () => {
    const headers = ['ID,Client Name,Channel,Event Type,Event Date,Guests,Theme,Quote Value,Stage,Score,Phone,Email'];
    const rows = filteredLeads.map(l => {
      const quoteVal = l.calculatedQuote?.totalEstimatedValue || l.budgetExpectation || 0;
      return `"${l.id}","${l.clientName}","${l.channel}","${l.eventType}","${l.eventDate}",${l.guestCount},"${l.themeName}",${quoteVal},"${l.stage}",${l.scoreDetails?.totalScore || 75},"${l.contact.phone}","${l.contact.email}"`;
    });
    const blob = new Blob([[headers.join('\n'), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `decor_ai_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getChannelBadge = (ch: MessagingChannel) => {
    switch (ch) {
      case 'whatsapp':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5" /> WhatsApp</span>;
      case 'instagram':
        return <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] flex items-center gap-1"><InstagramIcon className="w-2.5 h-2.5" /> Instagram</span>;
      case 'website_widget':
        return <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-[10px] flex items-center gap-1"><Globe className="w-2.5 h-2.5" /> Website</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" /> Direct</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Export Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-obsidian-850 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-obsidian-850 border border-slate-700/80 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Stages</option>
            <option value="new_inquiry">New Inquiry</option>
            <option value="qualifying">Qualifying</option>
            <option value="quote_sent">Quote Sent</option>
            <option value="high_value_vip">🔥 High-Value VIP</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="booked_deposit">Booked & Paid</option>
          </select>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="bg-obsidian-850 border border-slate-700/80 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Channels</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="website_widget">Website Widget</option>
            <option value="direct_portal">Direct Portal</option>
          </select>
        </div>

        <button
          onClick={exportCSV}
          className="px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-gold-400" /> Export CSV
        </button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-obsidian-900/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Client / Prospect</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Event & Date</th>
                <th className="py-3.5 px-4">Guests</th>
                <th className="py-3.5 px-4">Theme Style</th>
                <th className="py-3.5 px-4">Est. Quote</th>
                <th className="py-3.5 px-4">Stage</th>
                <th className="py-3.5 px-4">VIP Score</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.map((l) => {
                const quoteVal = l.calculatedQuote?.totalEstimatedValue || l.budgetExpectation || 0;
                const isVip = l.isHighValueAlert || l.stage === 'high_value_vip' || quoteVal >= businessConfig.highValueThreshold;

                return (
                  <tr
                    key={l.id}
                    className="hover:bg-obsidian-800/50 transition-colors group cursor-pointer"
                    onClick={() => onOpenDetails(l)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        {isVip && <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 animate-pulse" />}
                        <div>
                          <span className="font-bold text-white group-hover:text-gold-300 block">{l.clientName}</span>
                          <span className="text-[10px] text-slate-400">{l.contact.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getChannelBadge(l.channel)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{l.eventType}</div>
                      <div className="text-[10px] text-slate-400">{l.eventDate}</div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-300">
                      {l.guestCount}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="truncate block max-w-[150px]">{l.themeName}</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-gold-400 font-serif">
                      {formatCurrency(quoteVal, sym)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-obsidian-800 border border-slate-700 text-slate-300">
                        {l.stage.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-200">{l.scoreDetails?.totalScore || 75}</span>/100
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onOpenDetails(l)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-obsidian-750"
                          title="Open Details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteLead(l.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-obsidian-750"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No leads matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
