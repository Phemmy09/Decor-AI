import React, { useState } from 'react';
import { Lead, PipelineStage } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { LeadCard } from './LeadCard';
import { formatCurrency } from '../../utils/pricingEngine';
import { 
  Sparkles, 
  Flame, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  Archive, 
  Plus, 
  Filter,
  Search
} from 'lucide-react';

interface PipelineKanbanProps {
  onOpenDetails: (lead: Lead) => void;
}

interface ColumnDef {
  id: PipelineStage;
  title: string;
  badgeColor: string;
  icon: React.ReactNode;
  description: string;
}

const COLUMNS: ColumnDef[] = [
  {
    id: 'new_inquiry',
    title: 'New Inquiries',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: <Sparkles className="w-3.5 h-3.5 text-blue-400" />,
    description: 'Fresh incoming messages across channels'
  },
  {
    id: 'qualifying',
    title: 'Qualifying / Chatting',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: <MessageSquare className="w-3.5 h-3.5 text-purple-400" />,
    description: 'AI currently extracting event details'
  },
  {
    id: 'quote_sent',
    title: 'Quote Delivered',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: <FileText className="w-3.5 h-3.5 text-cyan-400" />,
    description: 'Instant multi-tier quote generated'
  },
  {
    id: 'high_value_vip',
    title: '🔥 High-Value VIP',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm',
    icon: <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />,
    description: 'Top priority deal ($2.5k+) ready to close'
  },
  {
    id: 'proposal_sent',
    title: 'Proposal / Contract Sent',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: <FileText className="w-3.5 h-3.5 text-indigo-400" />,
    description: 'Formal contract out for signature'
  },
  {
    id: 'booked_deposit',
    title: 'Booked & Deposit Paid',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
    description: 'Closed won & dates locked in calendar'
  }
];

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({ onOpenDetails }) => {
  const { leads, businessConfig, updateLeadStage } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const sym = businessConfig.currencySymbol;

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.themeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChannel = selectedChannelFilter === 'all' || lead.channel === selectedChannelFilter;
    return matchesSearch && matchesChannel;
  });

  // Calculate total pipeline revenue
  const totalPipelineValue = leads.reduce((sum, l) => {
    return sum + (l.calculatedQuote?.totalEstimatedValue || l.budgetExpectation || 0);
  }, 0);

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.setData('text/plain', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      updateLeadStage(leadId, targetStage);
      setDraggedLeadId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads, couples, themes, dates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-obsidian-850 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          <select
            value={selectedChannelFilter}
            onChange={(e) => setSelectedChannelFilter(e.target.value)}
            className="bg-obsidian-850 border border-slate-700/80 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Channels</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram DM</option>
            <option value="website_widget">Website Widget</option>
            <option value="direct_portal">Direct Portal</option>
          </select>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="text-slate-400">
            Active Leads: <span className="font-bold text-white">{filteredLeads.length}</span>
          </div>
          <div className="text-slate-400">
            Pipeline Value:{' '}
            <span className="font-bold text-gold-400 font-serif">
              {formatCurrency(totalPipelineValue, sym)}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x min-h-[580px]">
        {COLUMNS.map((col) => {
          const colLeads = filteredLeads.filter(l => l.stage === col.id);
          const colTotalValue = colLeads.reduce((sum, l) => {
            return sum + (l.calculatedQuote?.totalEstimatedValue || l.budgetExpectation || 0);
          }, 0);

          const isVipCol = col.id === 'high_value_vip';

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex-shrink-0 w-80 rounded-2xl flex flex-col transition-all duration-200 ${
                isVipCol
                  ? 'bg-obsidian-900/90 border-2 border-amber-500/40 shadow-gold-sm'
                  : 'bg-obsidian-900/60 border border-slate-800/80'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="p-1 rounded-md bg-obsidian-850 border border-slate-800">
                    {col.icon}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">{col.title}</h3>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {colLeads.length} {colLeads.length === 1 ? 'deal' : 'deals'} • {formatCurrency(colTotalValue, sym)}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${col.badgeColor}`}>
                  {colLeads.length}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[650px]">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                  >
                    <LeadCard lead={lead} onOpenDetails={onOpenDetails} />
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-center p-4">
                    <p className="text-xs text-slate-400">No leads in this stage</p>
                    <span className="text-[10px] text-slate-400 mt-1">Drag leads here to update</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
